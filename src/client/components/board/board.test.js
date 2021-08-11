import React from 'react';
import ReactDOM from 'react-dom';
import Board from './board';
import * as model from '../model/model';
import { DEFAULT_GAME_MODE } from '../../../utils/constants';

jest.mock('../model/model.js');


it('renders without crashing', async() => {
  Board.prototype.componentDidMount = jest.fn();

  const div = document.createElement('div');
  document.body.appendChild(div);

  const G = {
    dealt: [],
    players: {
      "0": ["T3", "T4", "T5"]
    },
    order: [0, 1, 2],
    scores: [0, 0, 0],
    identifiedThreats: {

    },
    selectedDiagram: 0,
    selectedComponent: "",
    threat: {
      modal: false,
    },
    passed: [],
    suit: 'T',
    round: 1,
    startingCard: 'T3',
    gameMode: DEFAULT_GAME_MODE,
  }
  const ctx = {
    actionPlayers: [0, 1, 2]
  }

  ReactDOM.render(<Board G={G} ctx={ctx} matchID="123" moves={{}} events={{}} playerID="0" />, div);

  ReactDOM.unmountComponentAtNode(div);
  div.remove();
});
