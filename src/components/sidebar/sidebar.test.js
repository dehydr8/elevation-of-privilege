import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './sidebar';

it('renders without crashing', () => {
  const G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<Sidebar G={G} gameID="1234" ctx={ctx} moves={moves} current={true} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
