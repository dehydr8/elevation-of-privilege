import React from 'react';
import ReactDOM from 'react-dom';
import { GAMEMODE_EOP } from '../../../utils/constants';
import Threatbar from './threatbar';

it('renders without crashing', () => {
  const G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
    selectedComponent: "",
    selectedDiagram: "0",
    identifiedThreats: {},
    threat: {
      modal: false,
    },
    gameMode: GAMEMODE_EOP
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<Threatbar G={G} ctx={ctx} model={null} moves={moves} active={true} names={["P1", "P2", "P3"]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
