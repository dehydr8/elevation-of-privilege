import { INVALID_MOVE} from 'boardgame.io/core'
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { getDealtCard, getValidMoves } from '../utils/utils';
import { getThreatDescription } from './definitions.js';
import { hasPlayerPassed } from './utils';

export function toggleModal(G, ctx) {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (hasPlayerPassed(G, ctx) || (G.threat.modal && G.threat.owner !== ctx.playerID)) {
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
      title: "",
      severity: "Medium",
      description: getThreatDescription(card),
      mitigation: "",
    },
  }
}

export function toggleModalUpdate(G, ctx, threat) {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (hasPlayerPassed(G, ctx) || (threat.owner !== ctx.playerID)) {
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
  }
}

export function updateThreat(G, ctx, field, value) {
  return {
    ...G,
    threat: {
      ...G.threat,
      [field]: value,
    }
  }
}

export function selectDiagram(G, ctx, id) {
  // if the player has passed, they shouldn't be able to select diagrams
  if (hasPlayerPassed(G, ctx)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedDiagram: id,
    selectedComponent: "",
    selectedThreat: "",
  }
}

export function selectComponent(G, ctx, id) {
  // if the player has passed, they shouldn't be able to select components
  if (hasPlayerPassed(G, ctx)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedComponent: id,
    selectedThreat: "",
  }
}

export function selectThreat(G, ctx, id) {
  // if the player has passed, they shouldn't be able to select threat
  if (hasPlayerPassed(G, ctx)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedThreat: id,
  }
}

export function pass(G, ctx, id) {
  let passed = [...G.passed];
  
  if (!hasPlayerPassed(G, ctx)) {
    passed.push(ctx.playerID);
  }

  return {
    ...G,
    passed,
  }
}

export function deleteThreat(G, ctx, threat) {
  // if the player has passed, they shouldn't be able to toggle the modal
  if (hasPlayerPassed(G, ctx) || (threat.owner !== ctx.playerID)) {
    return INVALID_MOVE;
  }

  let scores = [...G.scores];
  scores[ctx.playerID]--;

  let identifiedThreats = _.cloneDeep(G.identifiedThreats);
  delete identifiedThreats[G.selectedDiagram][G.selectedComponent][threat.id];

  return {
    ...G,
    scores,
    selectedThreat: "",
    identifiedThreats,
  }
}

export function addOrUpdateThreat(G, ctx) {
  let threat_title = G.threat.title.trim();
  let threat_description = G.threat.description.trim();
  let threat_mitigation = G.threat.mitigation.trim();

  if (G.threat.owner !== ctx.playerID || _.isEmpty(threat_title) || _.isEmpty(threat_description)) {
    return INVALID_MOVE;
  }

  let scores = [...G.scores];

  // only update score if it's a new threat
  if (G.threat.new) {
    scores[ctx.playerID]++;
  }

  // TODO: have a cleaner or readable approach to updating this object
  let identifiedThreats = _.cloneDeep(G.identifiedThreats);
  
  if (!(G.selectedDiagram in identifiedThreats)) {
    Object.assign(identifiedThreats, {[G.selectedDiagram]: {}});
  }

  if (!(G.selectedComponent in identifiedThreats[G.selectedDiagram])) {
    Object.assign(identifiedThreats[G.selectedDiagram], {[G.selectedComponent]: {}});
  }

  Object.assign(identifiedThreats[G.selectedDiagram][G.selectedComponent], {
    [G.threat.id]: {
      id: G.threat.id,
      owner: G.threat.owner,
      title: threat_title,
      type: G.threat.type,
      severity: G.threat.severity,
      description: threat_description,
      mitigation: threat_mitigation || "No mitigation provided.",
    }
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
  }
}

export function draw(G, ctx, card) {
  let deck = [...G.players[ctx.currentPlayer]];
  let suit = G.suit;
  

  // check if the move is valid
  if (!getValidMoves(deck, suit, G.round, G.startingCard).includes(card)) {
    return INVALID_MOVE;
  }

  let dealtBy = G.dealtBy;
  let index = deck.indexOf(card);
  deck.splice(index, 1);

  let dealt = [...G.dealt];
  let numCardsPlayed = G.numCardsPlayed

  dealt[parseInt(ctx.currentPlayer)] = card;
  numCardsPlayed++;

  // only update the suit if no suit exists
  if (suit === "")
    suit = card.substr(0, 1);

  dealtBy = ctx.currentPlayer;

  // move into threats stage
  ctx.events.setActivePlayers({all: 'threats'});

  return {
    ...G,
    dealt,
    suit,
    numCardsPlayed,
    dealtBy,
    players: {
      ...G.players,
      [ctx.currentPlayer]: deck,
    }
  };
}