import { TurnOrder, PlayerView } from 'boardgame.io/core';
import { endGameIf, onTurnEnd, endTurnIf, firstPlayer, setupGame} from './utils';
import { toggleModal, toggleModalUpdate, updateThreat, selectDiagram, selectComponent, selectThreat, pass, deleteThreat, addOrUpdateThreat, draw } from './moves.js'

export const ElevationOfPrivilege = {
  name: 'elevation-of-privilege',
  setup: setupGame,

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
      first: firstPlayer
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