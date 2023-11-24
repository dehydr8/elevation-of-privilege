import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from './board';
import { DEFAULT_TURN_DURATION } from '../../../utils/constants';
import { DEFAULT_GAME_MODE } from '../../../utils/GameMode';

jest.mock('../model/model.jsx');

const G = {
  dealt: [],
  players: {
    0: ['T3', 'T4', 'T5'],
  },
  order: [0, 1, 2],
  scores: [0, 0, 0],
  identifiedThreats: {},
  selectedDiagram: 0,
  selectedComponent: '',
  threat: {
    modal: false,
  },
  passed: [],
  suit: 'T',
  round: 1,
  startingCard: 'T3',
  gameMode: DEFAULT_GAME_MODE,
  turnDuration: DEFAULT_TURN_DURATION,
  turnFinishTargetTime: Date.now() + DEFAULT_TURN_DURATION * 1000,
};
const ctx = {
  actionPlayers: [0, 1, 2],
};
// Suppress REST calls during test
Board.prototype.apiGetRequest = jest.fn();

describe('Board', () => {
  it('renders without crashing', async () => {
    
    // when
    render(<Board G={G} ctx={ctx} matchID="123" moves={{}} events={{}} playerID="0" />);

    // then
    await screen.getByRole(`button`, {
      name: `Download Threats`
    });
  
  });

  it('should render imprint link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = 'https://example.tld/imprint/'

    // when
    render(<Board G={G} ctx={ctx} matchID="123" moves={{}} events={{}} playerID="0" />);

    // when

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Imprint`
    });
    expect(links.length).toBe(1);
  });

  it('should not render imprint link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = "";

    // when
    render(<Board G={G} ctx={ctx} matchID="123" moves={{}} events={{}} playerID="0" />);

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Imprint`
    });
    expect(links.length).toBe(0);
  });

  it('should render privacy link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = 'https://example.tld/privacy/'

    // when
    render(<Board G={G} ctx={ctx} matchID="123" moves={{}} events={{}} playerID="0" />);

    // when

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Privacy`
    });
    expect(links.length).toBe(1);
  });

  it('should not render privacy link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = "";

    // when
    render(<Board G={G} ctx={ctx} matchID="123" moves={{}} events={{}} playerID="0" />);

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Privacy`
    });
    expect(links.length).toBe(0);
  });
  
});
