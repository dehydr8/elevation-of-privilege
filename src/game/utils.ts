import type { PlayerID } from 'boardgame.io';
import {
  CARD_LIMIT,
  DECK_HANDS,
  DECK_SUITS,
  DEFAULT_GAME_MODE,
  DEFAULT_START_SUIT,
  DEFAULT_TURN_DURATION,
  INVALID_CARDS,
  MODEL_TYPE_DEFAULT,
  MODEL_TYPE_IMAGE,
  STARTING_CARD_MAP,
  TRUMP_CARD_PREFIX,
} from '../utils/constants';

import type { Ctx } from './context';
import type { GameState } from './gameState';
import type { SetupData } from './setupData';

const scores: Record<string, number> = {};
const deck: string[] = [];
for (let i = 0; i < DECK_SUITS.length; i++) {
  for (let j = 0; j < DECK_HANDS.length; j++) {
    const c = DECK_SUITS[i] + DECK_HANDS[j];
    deck.push(c);
    scores[c] = j;
    if (DECK_SUITS[i] === TRUMP_CARD_PREFIX) {
      scores[c] += 100;
    }
  }
}

export function shuffleCards(
  ctx: Ctx,
  startingCard: string,
): {
  players: string[][];
  first: number;
  cardsToDeal: number;
} {
  const players = [];
  const totalCardsToDeal = Math.min(
    Math.floor(deck.length / ctx.numPlayers) * ctx.numPlayers,
    CARD_LIMIT * ctx.numPlayers,
  );
  //totalCardsToDeal = ctx.numPlayers * 2;

  // shuffle the deck first
  let shuffled = ctx.random.Shuffle(deck);

  // remove the startingCard card and resize to totalCardsToDeal
  shuffled.splice(shuffled.indexOf(startingCard), 1);
  shuffled = shuffled.slice(0, totalCardsToDeal - 1);

  // make sure startingCard is in the shuffled cards
  shuffled.push(startingCard);
  shuffled = ctx.random.Shuffle(shuffled);

  const cardsToDeal = totalCardsToDeal / ctx.numPlayers;
  let first = 0;

  for (let i = 0; i < cardsToDeal * ctx.numPlayers; i += cardsToDeal) {
    const slice = shuffled.slice(i, i + cardsToDeal);
    players.push(slice);

    if (slice.indexOf(startingCard) >= 0) first = i / cardsToDeal;
  }
  return {
    players,
    first,
    cardsToDeal,
  };
}

export function setupGame(ctx: Ctx, setupData?: SetupData): GameState {
  const startSuit = setupData?.startSuit ?? DEFAULT_START_SUIT;
  const gameMode = setupData?.gameMode ?? DEFAULT_GAME_MODE;
  const modelType = setupData?.modelType ?? MODEL_TYPE_DEFAULT;
  const turnDuration = setupData?.turnDuration ?? DEFAULT_TURN_DURATION;

  INVALID_CARDS[gameMode].forEach((c) => deck.splice(deck.indexOf(c), 1));
  const startingCard = STARTING_CARD_MAP[gameMode][startSuit];

  const scores = new Array(ctx.numPlayers).fill(0);
  const shuffled = shuffleCards(ctx, startingCard);

  return {
    dealt: [],
    passed: [],
    suit: '',
    dealtBy: '',
    players: shuffled.players,
    round: 1,
    numCardsPlayed: 0,
    scores,
    lastWinner: shuffled.first,
    maxRounds: shuffled.cardsToDeal,
    selectedDiagram: 0,
    // as image models don't have components, put a dummy id here to treat the entire image as selected
    selectedComponent: modelType === MODEL_TYPE_IMAGE ? 'image' : '',
    selectedThreat: '',
    threat: {
      modal: false,
      new: true,
    },
    identifiedThreats: {},
    startingCard: startingCard,
    gameMode: gameMode,
    turnDuration: turnDuration,
    modelType,
  };
}

export function firstPlayer(G: GameState): number {
  return G.lastWinner;
}

export function hasPlayerPassed(G: GameState, ctx: Ctx): boolean {
  return (G.passed as (string | undefined)[]).includes(ctx.playerID);
}

export function getWinner(suit: string, dealt: string[]): number {
  let winner = 0,
    max = -1;
  for (let i = 0; i < dealt.length; i++) {
    const c = dealt[i];
    if (c.startsWith(suit) || c.startsWith(TRUMP_CARD_PREFIX)) {
      const score = scores[c];
      if (score > max) {
        max = score;
        winner = i;
      }
    }
  }
  return winner;
}

export function endGameIf(G: GameState): number | undefined {
  if (G.round > G.maxRounds) {
    const scores = [...G.scores];
    const winner = scores.indexOf(Math.max(...scores));
    return winner;
  }
}

export function endTurnIf(
  G: GameState,
  ctx: Ctx,
): boolean | { next: PlayerID } {
  const passed = [...G.passed];
  if (passed.length >= ctx.numPlayers) {
    if (G.numCardsPlayed >= ctx.numPlayers) {
      //end of trick
      const lastWinner = getWinner(G.suit, G.dealt);
      return { next: lastWinner.toString() }; // choose next player
    }
    return true;
  }
  return false;
}

export function onTurnEnd(G: GameState, ctx: Ctx): GameState {
  let dealt = [...G.dealt];
  let suit = G.suit;
  let dealtBy = G.dealtBy;
  const scores = [...G.scores];
  let round = G.round;
  let lastWinner = G.lastWinner;
  let numCardsPlayed = G.numCardsPlayed;

  // calculate the scores
  //end of trick
  if (numCardsPlayed >= ctx.numPlayers) {
    lastWinner = getWinner(suit, dealt);

    scores[lastWinner]++;

    dealt = [];
    suit = '';
    dealtBy = '';
    numCardsPlayed = 0;
    round++;
  }
  return {
    ...G,
    dealt,
    lastWinner,
    dealtBy,
    suit,
    scores,
    numCardsPlayed,
    round,
    passed: [], // reset the passed array when the phase ends
  };
}
