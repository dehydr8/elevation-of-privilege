import React from 'react';
import ReactDOM from 'react-dom';
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
    }
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<Threatbar G={G} ctx={ctx} model={null} moves={moves} active={true} names={["P1", "P2", "P3"]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

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
    }
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<Threatbar G={G} ctx={ctx} model={null} moves={moves} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
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
    }
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<Threatbar G={G} ctx={ctx} model={null} moves={moves} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
