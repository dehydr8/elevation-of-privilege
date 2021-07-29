import { TurnOrder, PlayerView } from 'boardgame.io/core';
import { DEFAULT_START_SUIT, STARTING_CARD_MAP } from '../utils/constants';
import { shuffleCards, endGameIf, onTurnEnd, endTurnIf} from './utils';
import { toggleModal, toggleModalUpdate, updateThreat, selectDiagram, selectComponent, selectThreat, pass, deleteThreat, addOrUpdateThreat, draw } from './moves.js'

export const ElevationOfPrivilege = {
  name: 'elevation-of-privilege',
  setup(ctx, setupData) {
    const startSuit = (setupData) ?  setupData.startSuit || DEFAULT_START_SUIT : DEFAULT_START_SUIT
    const startingCard = STARTING_CARD_MAP[startSuit];

    let scores = [];
    let shuffled = shuffleCards(ctx, startingCard);

    for (let i=0; i<ctx.numPlayers; i++) {
      scores.push(0);
    }

    let ret = {
      dealt: [],
      passed: [],
      suit: "",
      dealtBy: "",
      players: shuffled.players,
      round: 1,
      numCardsPlayed: 0,
      scores,
      lastWinner: shuffled.first,
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
  endIf: endGameIf,
  
  moves: {
    draw,
    selectDiagram,
    selectComponent,
    selectThreat,
  },

  turn: {
    order: {
      ...TurnOrder.DEFAULT, // Simple clockwise turns
      first: (G, ctx) => {  // Starting player
        return G.lastWinner;
      },
    },
    endIf: endTurnIf,
    onEnd: onTurnEnd,
    stages: {
      threats: {
        moves: {
          addOrUpdateThreat,
          deleteThreat,
          pass,
          selectDiagram,
          selectComponent,
          selectThreat,
          toggleModal,
          toggleModalUpdate,
          updateThreat
        },
      }
    },
  },
};