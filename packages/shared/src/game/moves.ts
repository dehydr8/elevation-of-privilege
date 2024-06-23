import { INVALID_MOVE } from 'boardgame.io/core';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { getDealtCard, getValidMoves } from '../utils/utils';
import { getThreatDescription } from './definitions';
import { hasPlayerPassed } from './utils';

import type { GameState } from './gameState';
import type { Threat } from './threat';
import type { Suit } from '../utils/cardDefinitions';
import type { MoveFn } from 'boardgame.io';

type MoveFnContext<G> = Parameters<MoveFn<G>>[0];

export const toggleModal: MoveFn<GameState> = ({ G, playerID }) => {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (
    hasPlayerPassed(G, playerID) ||
    (G.threat.modal && G.threat.owner !== playerID) ||
    G.suit === undefined
  ) {
    return INVALID_MOVE;
  }
  const card = getDealtCard(G);
  return {
    ...G,
    threat: {
      ...G.threat,
      modal: !G.threat.modal,
      new: true,
      owner: playerID,
      type: G.suit,
      id: uuidv4(),
      title: '',
      severity: 'Medium',
      description: getThreatDescription(card, G.gameMode),
      mitigation: '',
    },
  };
};

export const toggleModalUpdate: MoveFn<GameState> = (
  { G, playerID },
  threat: Threat,
) => {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (hasPlayerPassed(G, playerID) || threat.owner !== playerID) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    threat: {
      ...G.threat,
      modal: !G.threat.modal,
      new: false,
      id: threat.id,
      owner: playerID,
      title: threat.title,
      type: threat.type,
      severity: threat.severity,
      description: threat.description,
      mitigation: threat.mitigation,
    },
  };
};

export function updateThreat<Field extends keyof Threat>(
  { G }: MoveFnContext<GameState>,
  field: Field,
  value: Threat[Field],
): ReturnType<MoveFn<GameState>> {
  return {
    ...G,
    threat: {
      ...G.threat,
      [field]: value,
    },
  };
}

export const selectDiagram: MoveFn<GameState> = (
  { G, playerID },
  id: number,
) => {
  // if the player has passed, they shouldn't be able to select diagrams
  if (hasPlayerPassed(G, playerID)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedDiagram: id,
    selectedComponent: '',
    selectedThreat: '',
  };
};

export const selectComponent: MoveFn = ({ G, playerID }, id: string) => {
  // if the player has passed, they shouldn't be able to select components
  if (hasPlayerPassed(G, playerID)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedComponent: id,
    selectedThreat: '',
  };
};

export const selectThreat: MoveFn<GameState> = (
  { G, playerID },
  id: string,
) => {
  // if the player has passed, they shouldn't be able to select threat
  if (hasPlayerPassed(G, playerID)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedThreat: id,
  };
};

export const pass: MoveFn<GameState> = ({ G, playerID }) => {
  if (playerID === undefined) {
    return INVALID_MOVE;
  }

  const passed = [...G.passed];

  if (!hasPlayerPassed(G, playerID)) {
    passed.push(playerID);
  }

  return {
    ...G,
    passed,
  };
};

export const deleteThreat: MoveFn<GameState> = (
  { G, playerID },
  threat: Threat & { id: string },
) => {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (
    hasPlayerPassed(G, playerID) ||
    threat.owner !== playerID ||
    playerID === undefined
  ) {
    return INVALID_MOVE;
  }

  const scores = [...G.scores];
  scores[Number.parseInt(playerID)]--;

  const identifiedThreats = _.cloneDeep(G.identifiedThreats);
  delete identifiedThreats[G.selectedDiagram]?.[G.selectedComponent][threat.id];

  return {
    ...G,
    scores,
    selectedThreat: '',
    identifiedThreats,
  };
};

export const addOrUpdateThreat: MoveFn<GameState> = ({ G, playerID }) => {
  const threatTitle = G.threat.title?.trim();
  const threatDescription = G.threat.description?.trim();
  const threatMitigation = G.threat.mitigation?.trim();

  if (
    playerID === undefined ||
    G.threat.owner !== playerID ||
    _.isEmpty(threatTitle) ||
    _.isEmpty(threatDescription) ||
    G.threat.id === undefined
  ) {
    return INVALID_MOVE;
  }

  const scores = [...G.scores];

  // only update score if it's a new threat
  if (G.threat.new) {
    scores[Number.parseInt(playerID)]++;
  }

  const identifiedThreats = [...G.identifiedThreats];
  identifiedThreats[G.selectedDiagram] = {
    ...identifiedThreats[G.selectedDiagram],
    [G.selectedComponent]: {
      ...G.identifiedThreats[G.selectedDiagram]?.[G.selectedComponent],
      [G.threat.id]: {
        ...G.threat,
        title: threatTitle,
        description: threatDescription,
        mitigation: threatMitigation || 'No mitigation provided.',
      },
    },
  };

  return {
    ...G,
    scores,
    threat: {
      ...G.threat,
      modal: false,
    },
    selectedThreat: G.threat.id,
    identifiedThreats,
  };
};

export const draw: MoveFn<GameState> = ({ G, ctx, events }, card: string) => {
  const deck = [...G.players[Number.parseInt(ctx.currentPlayer)]];
  const suit = G.suit;

  // check if the move is valid
  if (!getValidMoves(deck, suit, G.round, G.startingCard).includes(card)) {
    return INVALID_MOVE;
  }

  const index = deck.indexOf(card);
  deck.splice(index, 1);

  const dealt = [...G.dealt];

  dealt[parseInt(ctx.currentPlayer)] = card;
  const numCardsPlayed = G.numCardsPlayed + 1;

  // only update the suit if no suit exists
  const newSuit = suit ?? (card.slice(0, 1) as Suit);

  const dealtBy = ctx.currentPlayer;

  // move into threats stage
  events?.setActivePlayers?.({ all: 'threats' });

  return {
    ...G,
    dealt,
    suit: newSuit,
    numCardsPlayed,
    dealtBy,
    players: {
      ...G.players,
      [ctx.currentPlayer]: deck,
    },
    turnFinishTargetTime: Date.now() + G.turnDuration * 1000,
  };
};
