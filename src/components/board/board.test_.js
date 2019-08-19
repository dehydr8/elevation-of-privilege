import React from 'react';
import ReactDOM from 'react-dom';
import Board from './board';

it('renders without crashing', () => {
  const div = document.createElement('div');
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
    }
  }
  const ctx = {
    actionPlayers: [0, 1, 2]
  }

  ReactDOM.render(<Board G={G} ctx={ctx} gameID="123" moves={{}} events={{}} playerID="0" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
