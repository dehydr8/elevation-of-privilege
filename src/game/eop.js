import { TurnOrder, INVALID_MOVE, PlayerView } from 'boardgame.io/core';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { DECK_HANDS, DECK_SUITS, DEFAULT_START_SUIT, INVALID_CARDS, STARTING_CARD_MAP, TRUMP_CARD_PREFIX } from '../utils/constants';
import { getDealtCard, getPlayers, getValidMoves } from '../utils/utils';
import { getThreatDescription } from './definitions.js';

let scores = {};
let deck = [];
for (let i=0; i<DECK_SUITS.length; i++) {
  for (let j=0; j<DECK_HANDS.length; j++) {
    let c = DECK_SUITS[i] + DECK_HANDS[j];
    deck.push(c);
    scores[c] = j;
    if (DECK_SUITS[i] === TRUMP_CARD_PREFIX) {
      scores[c] += 100;
    }
  }
}
// remove invalid cards
INVALID_CARDS.forEach(c => deck.splice(deck.indexOf(c), 1));

export function shuffleCards(ctx, startingCard) {
  let players = [];
  let totalCardsToDeal = Math.floor(deck.length / ctx.numPlayers) * ctx.numPlayers;

  //totalCardsToDeal = ctx.numPlayers * 2;

  // shuffle the deck first
  let shuffled = ctx.random.Shuffle(deck);
  
  // remove the startingCard card and resize to totalCardsToDeal
  shuffled.splice(shuffled.indexOf(startingCard), 1);
  shuffled = shuffled.slice(0, totalCardsToDeal - 1);

  // make sure startingCard is in the shuffled cards
  shuffled.push(startingCard);
  shuffled = ctx.random.Shuffle(shuffled);

  let cardsToDeal = totalCardsToDeal / ctx.numPlayers;
  let first = 0;

  for (let i=0; i<cardsToDeal*ctx.numPlayers; i+=cardsToDeal) {
    let slice = shuffled.slice(i, i+cardsToDeal);
    players.push(slice);

    if (slice.indexOf(startingCard) >= 0)
      first = i / cardsToDeal;
  }

  return {
    players,
    first,
    cardsToDeal,
  }
}

export function getWinner(suit, dealt) {
  let winner = 0, max = -1;
  for (let i=0; i<dealt.length; i++) {
    let c = dealt[i];
    if (c.startsWith(suit) || c.startsWith(TRUMP_CARD_PREFIX)) {
      let score = scores[c];
      if (score > max) {
        max = score;
        winner = i;
      }
    }
  }
  return winner;
}

export const ElevationOfPrivilege = {
  name: 'elevation-of-privilege',
  setup(ctx, setupData) {
    const startSuit = (setupData) ?  setupData.startSuit || DEFAULT_START_SUIT : DEFAULT_START_SUIT
    const startingCard = STARTING_CARD_MAP[startSuit];

    let scores = [];
    let shuffled = shuffleCards(ctx, startingCard);
    let order = [];
    for (let i=0; i<ctx.numPlayers; i++) {
      order.push(i.toString());
    }
    for (let i=0; i<ctx.numPlayers; i++) {
      scores.push(0);
    }
    for (let i=0; i<shuffled.first; i++) {
      let element = order.shift();
      order.push(element);
    }

    let ret = {
      dealt: [],
      passed: [],
      suit: "",
      dealtBy: "",
      order,
      players: shuffled.players,
      round: 1,
      scores,
      playOrderPos: 0,
      lastWinner: -1,
      maxRounds: shuffled.cardsToDeal,
      selectedDiagram: 0,
      selectedComponent: "",
      selectedThreat: "",
      threat: {
        modal: false,
        new: true,
      },
      identifiedThreats: {},
      startingCard: startingCard
    }
    return ret;
  },

  playerView: PlayerView.STRIP_SECRETS,
  endIf: (G, ctx) => {
    if (G.round > G.maxRounds) {
      let scores = [...G.scores];
      let winner = 0, max = -1;
      for (let i=0; i<scores.length; i++) {
        if (scores[i] > max) {
          winner = i;
          max = scores[i];
        }
      }
      return winner;
    }
  },
  turn: {
    order: TurnOrder.CUSTOM_FROM('order'),
    onEnd: (G, ctx) => {
      // ctx.events.endPhase(); ending phase when not in a phase breaks everything
      ctx.events.setActivePlayers({all: 'threats'})
      return {
        ...G,
        playOrderPos: G.playOrderPos + 1,
      }
    },
  },
  moves: {
    draw,
    selectDiagram,
    selectComponent,
    selectThreat,
  },
  // phases: {
  //   threats: {
  //     turn: {
  //       order: {
  //         first: (G, ctx) => {
  //           return ctx.currentPlayer;
  //         },
  //         next: (G, ctx) => {
  //           return ctx.currentPlayer;
  //         }
  //       },
  //     },
  //     next: 'play',
  //     moves: {
  //       addOrUpdateThreat,
  //       deleteThreat,
  //       pass,
  //       selectDiagram,
  //       selectComponent,
  //       selectThreat,
  //       toggleModal,
  //       toggleModalUpdate,
  //       updateThreat
  //     },
  //     endIf: (G, ctx) => {
  //       let passed = [...G.passed];
  //       return passed.length >= ctx.numPlayers;
  //     },
  //     onEnd: (G, ctx) => {
  //       let dealt = [...G.dealt];
  //       let order = [...G.order];
  //       let suit = G.suit;
  //       let dealtBy = G.dealtBy;
  //       let scores = [...G.scores];
  //       let round = G.round;
  //       let lastWinner = G.lastWinner;

  //       // calculate the scores
  //       if (dealt.length >= ctx.numPlayers) {
  //         let idx = getWinner(suit, dealt);
  //         lastWinner = order[idx];
  
  //         scores[lastWinner]++;
  
  //         order = [];
  //         for (let i=0; i<ctx.numPlayers; i++) {
  //           order.push(i.toString());
  //         }
  //         for (let i=0; i<lastWinner; i++) {
  //           let element = order.shift();
  //           order.push(element);
  //         }
  
  //         dealt = [];
  //         suit = "";
  //         dealtBy = "";
  //         round++;
  //       }

  //       return {
  //         ...G,
  //         dealt,
  //         lastWinner,
  //         dealtBy,
  //         order,
  //         suit,
  //         scores,
  //         round,
  //         passed: [], // reset the passed array when the phase ends
  //       }
  //     },
  //   },
  //   play: {
  //     start: true,
  //     turn: {
  //       order: TurnOrder.CUSTOM_FROM('order'),
  //       onEnd: (G, ctx) => {
  //         ctx.events.endPhase();
  //         ctx.events.setActivePlayers({all: 'threats'})
  //         return {
  //           ...G,
  //           playOrderPos: G.playOrderPos + 1,
  //         }
  //       },
  //     },
  //     next: 'threats',
  //     moves: {
  //       draw,
  //       selectDiagram,
  //       selectComponent,
  //       selectThreat,
  //     },
  //   },
  // },
};

function toggleModal(G, ctx) {
  // if the player has passed, they shouldn't be able to toggle the modal
  let passed = [...G.passed];
  if (passed.includes(ctx.playerID) || (G.threat.modal && G.threat.owner !== ctx.playerID)) {
    return INVALID_MOVE;
  }
  let card = getDealtCard(G);
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

function toggleModalUpdate(G, ctx, threat) {
  // if the player has passed, they shouldn't be able to toggle the modal
  let passed = [...G.passed];
  if (passed.includes(ctx.playerID) || (threat.owner !== ctx.playerID)) {
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

function updateThreat(G, ctx, field, value) {
  return {
    ...G,
    threat: {
      ...G.threat,
      [field]: value,
    }
  }
}

function selectDiagram(G, ctx, id) {
  // if the player has passed, they shouldn't be able to select diagrams
  let passed = [...G.passed];
  if (passed.includes(ctx.playerID)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedDiagram: id,
    selectedComponent: "",
    selectedThreat: "",
  }
}

function selectComponent(G, ctx, id) {
  // if the player has passed, they shouldn't be able to select components
  let passed = [...G.passed];
  if (passed.includes(ctx.playerID)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedComponent: id,
    selectedThreat: "",
  }
}

function selectThreat(G, ctx, id) {
  // if the player has passed, they shouldn't be able to select threat
  let passed = [...G.passed];
  if (passed.includes(ctx.playerID)) {
    return INVALID_MOVE;
  }

  return {
    ...G,
    selectedThreat: id,
  }
}

function pass(G, ctx, id) {
  let passed = [...G.passed];
  
  if (!passed.includes(ctx.playerID)) {
    passed.push(ctx.playerID);
  }

  return {
    ...G,
    passed,
  }
}

function deleteThreat(G, ctx, threat) {
  // if the player has passed, they shouldn't be able to toggle the modal
  let passed = [...G.passed];
  if (passed.includes(ctx.playerID) || (threat.owner !== ctx.playerID)) {
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

function addOrUpdateThreat(G, ctx) {
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

function draw(G, ctx, card) {
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

  dealt.push(card);

  // only update the suit if no suit exists
  if (suit === "")
    suit = card.substr(0, 1);

  dealtBy = ctx.currentPlayer;

  ctx.events.endTurn();

  return {
    ...G,
    dealt,
    suit,
    dealtBy,
    players: {
      ...G.players,
      [ctx.currentPlayer]: deck,
    }
  };
}
