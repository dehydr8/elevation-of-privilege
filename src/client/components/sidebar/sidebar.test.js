import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './sidebar';
import Timer from '../timer/timer';
import { act } from 'react-dom/test-utils';
import { DEFAULT_GAME_MODE } from '../../../utils/constants';

jest.mock('../timer/timer');

it('renders without crashing', () => {
  const G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
    turnDuration: 0,
    passed: [],
    gameMode: DEFAULT_GAME_MODE
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  ReactDOM.render(<Sidebar G={G} matchID="1234" ctx={ctx} moves={moves} current={true} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('doesn\'t render timer when duration isn\'t given or is 0', () => {
  let G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
    passed: [],
    gameMode: DEFAULT_GAME_MODE
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(<Sidebar G={G} gameID="1234" ctx={ctx} moves={moves} current={true} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  });
  expect(Timer).not.toHaveBeenCalled();

  G = {
    ...G,
    turnDuration: 0
  };
  act(() => {
    ReactDOM.render(<Sidebar G={G} gameID="1234" ctx={ctx} moves={moves} current={true} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  });
  expect(Timer).not.toHaveBeenCalled();

  ReactDOM.unmountComponentAtNode(div);
});

it('renders timer when duration is greater than zero', () => {
  let G = {
    dealt: ["T1"],
    order: [0,1,2],
    scores: [0,0,0],
    passed: [],
    turnDuration: 120,
    gameMode: DEFAULT_GAME_MODE
  };
  const ctx = {};
  const moves = {};
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(<Sidebar G={G} gameID="1234" ctx={ctx} moves={moves} current={true} active={true} names={["P1", "P2", "P3"]} playerID="0" />, div);
  });
  expect(Timer).toHaveBeenCalled();

  ReactDOM.unmountComponentAtNode(div);
})