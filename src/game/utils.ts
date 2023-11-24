import type { Ctx, DefaultPluginAPIs, FnContext, PlayerID } from 'boardgame.io';
import {
  Card,
  Suit,
  getAllCards,
  getCardScore,
  getStartingCard,
} from '../utils/cardDefinitions';
import {
  CARD_LIMIT,
  DEFAULT_START_SUIT,
  DEFAULT_TURN_DURATION,
  ModelType,
} from '../utils/constants';
import { DEFAULT_GAME_MODE, GameMode } from '../utils/GameMode';
import type { GameState } from './gameState';
import type { SetupData } from './setupData';

export function setupGame(
  { ctx, ...context }: DefaultPluginAPIs & { ctx: Ctx },
  setupData?: SetupData,
): GameState {
  const startSuit = setupData?.startSuit ?? DEFAULT_START_SUIT;
  const gameMode = setupData?.gameMode ?? DEFAULT_GAME_MODE;
  const modelType = setupData?.modelType ?? ModelType.PRIVACY_ENHANCED;
  const turnDuration = setupData?.turnDuration ?? DEFAULT_TURN_DURATION;
  const modelReference = setupData?.modelReference;

  const deck = getAllCards(gameMode);
  const startingCard = getStartingCard(gameMode, startSuit);

  const scores = new Array(ctx.numPlayers).fill(0);
  const handsPerPlayers = shuffleCards({ ctx, ...context }, deck, startingCard);

  return {
    dealt: [],
    passed: [],
    suit: undefined,
    dealtBy: '',
    players: handsPerPlayers,
    round: 1,
    numCardsPlayed: 0,
    scores,
    lastWinner: getPlayerHoldingStartingCard(handsPerPlayers, startingCard),
    maxRounds: getNumberOfCardsPerHand(handsPerPlayers),
    selectedDiagram: 0,
    // as image models or links don't have components, put a dummy id here to treat the entire image as selected
    selectedComponent: modelType === ModelType.THREAT_DRAGON ? '' : 'dummy',
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
    modelReference,
  };
}

export function shuffleCards(
  {
    ctx,
    random,
  }: DefaultPluginAPIs & {
    ctx: Ctx;
  },
  deck: Card[],
  startingCard: Card,
): Card[][] {
  const numberCardsPerHand = Math.min(
    Math.floor(deck.length / ctx.numPlayers),
    CARD_LIMIT,
  );
  const numberCardsToDeal = ctx.numPlayers * numberCardsPerHand;

  const shuffledDeck = random.Shuffle<Card>(deck);
  let choppedDeck = shuffledDeck.slice(0, numberCardsToDeal);
  if (!choppedDeck.includes(startingCard)) {
    choppedDeck[0] = startingCard;
    choppedDeck = random.Shuffle<Card>(choppedDeck);
  }

  // partition deck into player hands
  const handsPerPlayer = choppedDeck.reduce(
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
): number {
  return handsPerPlayers.findIndex((hand) => hand.includes(startingCard));
}

function getNumberOfCardsPerHand(handsPerPlayer: Card[][]): number {
  return handsPerPlayer[0]?.length ?? 0;
}

export function firstPlayer({ G }: FnContext<GameState>): number {
  return G.lastWinner;
}

export function hasPlayerPassed(G: GameState, playerID: PlayerID): boolean {
  return (G.passed as (string | undefined)[]).includes(playerID);
}

export function endGameIf({ G }: FnContext<GameState>): number | undefined {
  if (G.round > G.maxRounds) {
    const scores = [...G.scores];
    const winner = scores.indexOf(Math.max(...scores));
    return winner;
  }
}

export function endTurnIf({
  G,
  ctx,
}: FnContext<GameState>): boolean | { next: PlayerID } {
  if (G.suit === undefined) {
    // A turn must have a defined suit. Otherwise it is not a turn and cannot end.
    return false;
  }
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

export function onTurnEnd({ G, ctx }: FnContext<GameState>): GameState {
  let dealt = [...G.dealt];
  let suit = G.suit;
  let dealtBy = G.dealtBy;
  const scores = [...G.scores];
  let round = G.round;
  let lastWinner = G.lastWinner;
  let numCardsPlayed = G.numCardsPlayed;

  if (suit === undefined) {
    // This should not happen, during a turn the suit should have a defined value.
    // If we run into such an inconsistent state, return the old `G` and hope someone fixes the state
    return G;
  }

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
  currentSuit: Suit,
  gameMode: GameMode,
): number {
  const scores = dealtCards.map((card) =>
    getCardScore(card, currentSuit, gameMode),
  );
  const winner = scores.indexOf(Math.max(...scores));
  return winner;
}
