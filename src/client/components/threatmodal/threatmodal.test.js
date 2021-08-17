import React from 'react';
import ReactDOM from 'react-dom';
import ThreatModal from './threatmodal';
import { DEFAULT_GAME_MODE } from '../../../utils/constants';


it('renders modal without crashing', () => {
  const G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
    selectedComponent: "",
    selectedDiagram: "0",
    identifiedThreats: {},
    threat: {
      modal: true,
      owner: "0",
    },
    gameMode: DEFAULT_GAME_MODE
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<ThreatModal isOpen G={G} ctx={ctx} model={null} moves={moves} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders modal for update', () => {
  const G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
    selectedComponent: "",
    selectedDiagram: "0",
    identifiedThreats: {},
    threat: {
      modal: true,
      new: false,
      owner: "0",
    },
    gameMode: DEFAULT_GAME_MODE
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<ThreatModal isOpen G={G} ctx={ctx} model={null} moves={moves} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  ReactDOM.unmountComponentAtNode(div);
});