import { INVALID_MOVE } from 'boardgame.io/core';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { getDealtCard, getValidMoves } from '../utils/utils';
import { getThreatDescription } from './definitions';
import { hasPlayerPassed } from './utils';

import type { Ctx } from './context';
import type { GameState } from './gameState';
import type { Threat } from './threat';
import type { Suit } from '../utils/cardDefinitions';

export function toggleModal(
  G: GameState,
  ctx: Ctx,
): GameState | typeof INVALID_MOVE {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (
    hasPlayerPassed(G, ctx) ||
    (G.threat.modal && G.threat.owner !== ctx.playerID) ||
    !G.suit
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
      owner: ctx.playerID,
      type: G.suit,
      id: uuidv4(),
      title: '',
      severity: 'Medium',
      description: getThreatDescription(card, G.gameMode),
      mitigation: '',
    },
  };
}

export function toggleModalUpdate(
  G: GameState,
  ctx: Ctx,
  threat: Threat,
): GameState | typeof INVALID_MOVE {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (hasPlayerPassed(G, ctx) || threat.owner !== ctx.playerID) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    threat: {
      ...G.threat,
      modal: !G.threat.modal,
      new: false,
      id: threat.id,
      owner: ctx.playerID,
      title: threat.title,
      type: threat.type,
      severity: threat.severity,
      description: threat.description,
      mitigation: threat.mitigation,
    },
  };
}

export function updateThreat<Field extends keyof Threat>(
  G: GameState,
  _: Ctx,
  field: Field,
  value: Threat[Field],
): GameState | typeof INVALID_MOVE {
  return {
    ...G,
    threat: {
      ...G.threat,
      [field]: value,
    },
  };
}

export function selectDiagram(
  G: GameState,
  ctx: Ctx,
  id: number,
): GameState | typeof INVALID_MOVE {
  // if the player has passed, they shouldn't be able to select diagrams
  if (hasPlayerPassed(G, ctx)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedDiagram: id,
    selectedComponent: '',
    selectedThreat: '',
  };
}

export function selectComponent(
  G: GameState,
  ctx: Ctx,
  id: string,
): GameState | typeof INVALID_MOVE {
  // if the player has passed, they shouldn't be able to select components
  if (hasPlayerPassed(G, ctx)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedComponent: id,
    selectedThreat: '',
  };
}

export function selectThreat(
  G: GameState,
  ctx: Ctx,
  id: string,
): GameState | typeof INVALID_MOVE {
  // if the player has passed, they shouldn't be able to select threat
  if (hasPlayerPassed(G, ctx)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedThreat: id,
  };
}

export function pass(G: GameState, ctx: Ctx): GameState | typeof INVALID_MOVE {
  if (ctx.playerID === undefined) {
    return INVALID_MOVE;
  }

  const passed = [...G.passed];

  if (!hasPlayerPassed(G, ctx)) {
    passed.push(ctx.playerID);
  }

  return {
    ...G,
    passed,
  };
}

export function deleteThreat(
  G: GameState,
  ctx: Ctx,
  threat: Threat & { id: string },
): GameState | typeof INVALID_MOVE {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (
    hasPlayerPassed(G, ctx) ||
    threat.owner !== ctx.playerID ||
    ctx.playerID === undefined
  ) {
    return INVALID_MOVE;
  }

  const scores = [...G.scores];
  scores[Number.parseInt(ctx.playerID)]--;

  const identifiedThreats = _.cloneDeep(G.identifiedThreats);
  delete identifiedThreats[G.selectedDiagram][G.selectedComponent][threat.id];

  return {
    ...G,
    scores,
    selectedThreat: '',
    identifiedThreats,
  };
}

export function addOrUpdateThreat(
  G: GameState,
  ctx: Ctx,
): GameState | typeof INVALID_MOVE {
  const threatTitle = G.threat.title?.trim();
  const threatDescription = G.threat.description?.trim();
  const threatMitigation = G.threat.mitigation?.trim();

  if (
    ctx.playerID === undefined ||
    G.threat.owner !== ctx.playerID ||
    _.isEmpty(threatTitle) ||
    _.isEmpty(threatDescription) ||
    G.threat.id === undefined
  ) {
    return INVALID_MOVE;
  }

  const scores = [...G.scores];

  // only update score if it's a new threat
  if (G.threat.new) {
    scores[Number.parseInt(ctx.playerID)]++;
  }

  // TODO: have a cleaner or readable approach to updating this object
  const identifiedThreats = _.cloneDeep(G.identifiedThreats);

  // Are these necessary
  if (!(G.selectedDiagram in identifiedThreats)) {
    Object.assign(identifiedThreats, { [G.selectedDiagram]: {} });
  }

  if (!(G.selectedComponent in identifiedThreats[G.selectedDiagram])) {
    Object.assign(identifiedThreats[G.selectedDiagram], {
      [G.selectedComponent]: {},
    });
  }

  //is object.assign required here?
  Object.assign(identifiedThreats[G.selectedDiagram][G.selectedComponent], {
    [G.threat.id]: {
      id: G.threat.id,
      owner: G.threat.owner,
      title: threatTitle,
      type: G.threat.type,
      severity: G.threat.severity,
      description: threatDescription,
      mitigation: threatMitigation || 'No mitigation provided.',
    },
  });

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
}

export function draw(
  G: GameState,
  ctx: Ctx,
  card: string,
): typeof INVALID_MOVE | GameState {
  const deck = [...G.players[Number.parseInt(ctx.currentPlayer)]];
  let suit = G.suit;

  // check if the move is valid
  if (!getValidMoves(deck, suit, G.round, G.startingCard).includes(card)) {
    return INVALID_MOVE;
  }

  let dealtBy = G.dealtBy;
  const index = deck.indexOf(card);
  deck.splice(index, 1);

  const dealt = [...G.dealt];
  let numCardsPlayed = G.numCardsPlayed;

  dealt[parseInt(ctx.currentPlayer)] = card;
  numCardsPlayed++;

  // only update the suit if no suit exists
  if (!suit) suit = card.substr(0, 1) as Suit;

  dealtBy = ctx.currentPlayer;

  // move into threats stage
  ctx.events?.setActivePlayers?.({ all: 'threats' });

  return {
    ...G,
    dealt,
    suit,
    numCardsPlayed,
    dealtBy,
    players: {
      ...G.players,
      [ctx.currentPlayer]: deck,
    },
    turnFinishTargetTime: Date.now() + G.turnDuration * 1000,
  };
}
