import type { PlayerID } from 'boardgame.io';
import {
  Card,
  Suit,
  getAllCards,
  getCardScore,
  getStartingCard,
} from '../utils/cardDefinitions';
import {
  CARD_LIMIT,
  DEFAULT_GAME_MODE,
  DEFAULT_START_SUIT,
  DEFAULT_TURN_DURATION,
  GameMode,
  ModelType,
} from '../utils/constants';
import type { Ctx } from './context';
import type { GameState } from './gameState';
import type { SetupData } from './setupData';

export function setupGame(ctx: Ctx, setupData?: SetupData): GameState {
  const startSuit = setupData?.startSuit ?? DEFAULT_START_SUIT;
  const gameMode = setupData?.gameMode ?? DEFAULT_GAME_MODE;
  const modelType = setupData?.modelType ?? ModelType.DEFAULT;
  const turnDuration = setupData?.turnDuration ?? DEFAULT_TURN_DURATION;

  const deck = getAllCards(gameMode);
  const startingCard = getStartingCard(gameMode, startSuit);

  const scores = new Array(ctx.numPlayers).fill(0);
  const handsPerPlayers = shuffleCards(ctx, deck, startingCard);

  return {
    dealt: [],
    passed: [],
    suit: undefined,
    dealtBy: '',
    players: handsPerPlayers,
    round: 1,
    numCardsPlayed: 0,
    scores,
    lastWinner: getPlayerHoldingStartingCard(
      handsPerPlayers,
      startingCard,
    ) as number,
    maxRounds: getNumberOfCardsPerHand(handsPerPlayers),
    selectedDiagram: 0,
    // as image models don't have components, put a dummy id here to treat the entire image as selected
    selectedComponent: modelType === ModelType.IMAGE ? 'image' : '',
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

// TODO: Testing!!!
function shuffleCards(ctx: Ctx, deck: Card[], startingCard: Card): Card[][] {
  const numberCardsPerHand = Math.min(
    Math.floor(deck.length / ctx.numPlayers),
    CARD_LIMIT,
  );
  const numberCardsToDeal = ctx.numPlayers * numberCardsPerHand;

  const shuffledDeck = ctx.random.Shuffle<Card>(deck);
  let choppedDeck = shuffledDeck.slice(0, numberCardsToDeal);
  if (!choppedDeck.includes(startingCard)) {
    choppedDeck[0] = startingCard;
    choppedDeck = ctx.random.Shuffle<Card>(choppedDeck);
  }

  // partition deck into player hands
  const handsPerPlayer = shuffledDeck.reduce(
    (resultingArray: Card[][], item: Card, index: number) => {
      const playerIndex = Math.floor(index / numberCardsPerHand);

      resultingArray[playerIndex] = ([] as Card[]).concat(
        resultingArray[playerIndex] ?? [],
        item,
      );
      return resultingArray;
    },
    [],
  );

  return handsPerPlayer;
}

function getPlayerHoldingStartingCard(
  handsPerPlayers: Card[][],
  startingCard: Card,
): keyof Card[][] {
  return handsPerPlayers.findIndex((hand) => hand.includes(startingCard));
}

function getNumberOfCardsPerHand(handsPerPlayer: Card[][]): number {
  return handsPerPlayer[0]?.length ?? 0;
}

export function firstPlayer(G: GameState): number {
  return G.lastWinner;
}

export function hasPlayerPassed(G: GameState, ctx: Ctx): boolean {
  return (G.passed as (string | undefined)[]).includes(ctx.playerID);
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
      const lastWinner = getWinner(G.dealt, G.suit, G.gameMode);
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
    lastWinner = getWinner(dealt, suit, G.gameMode);

    scores[lastWinner]++;

    dealt = [];
    suit = undefined;
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

function getWinner(
  dealtCards: Card[],
  currentSuit: Suit | undefined,
  gameMode: GameMode,
): number {
  const scores = dealtCards.map((card) =>
    getCardScore(card, currentSuit, gameMode),
  );
  const winner = scores.indexOf(Math.max(...scores));
  return winner;
}
