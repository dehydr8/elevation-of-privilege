import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from './board';
import { DEFAULT_TURN_DURATION, ModelType } from '../../../utils/constants';
import { DEFAULT_GAME_MODE } from '../../../utils/GameMode';
import type { GameState } from '../../../game/gameState';
import type { Ctx } from 'boardgame.io';
import nock from 'nock';

import { API_PORT } from '../../../utils/serverConfig';

const baseUrl = `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;

beforeAll(() => {
  nock(baseUrl)
    .get('/players')
    .reply(200, { players: [{ id: 0, name: 'Player 0' }] });
});

const G: GameState = {
  dealt: [],
  players: [['T3', 'T4', 'T5']],
  scores: [0, 0, 0],
  identifiedThreats: {},
  selectedDiagram: 0,
  selectedComponent: '',
  threat: {
    modal: false,
    new: false,
  },
  passed: [],
  suit: 'T',
  round: 1,
  startingCard: 'T3',
  gameMode: DEFAULT_GAME_MODE,
  turnDuration: DEFAULT_TURN_DURATION,
  turnFinishTargetTime: Date.now() + DEFAULT_TURN_DURATION * 1000,
  dealtBy: '',
  numCardsPlayed: 0,
  lastWinner: 0,
  maxRounds: 10,
  selectedThreat: 'some-threat',
  modelType: ModelType.IMAGE,
};
const ctx = {
  numPlayers: 1,
  currentPlayer: '0',
  activePlayers: { '0': 'threats' },
} as unknown as Ctx;

describe('Board', () => {
  it('renders without crashing', () => {
    // when
    render(
      <Board
        G={G}
        ctx={ctx}
        matchID="123"
        moves={{}}
        playerID="0"
        credentials=""
      />,
    );

    // then
    screen.getByRole(`button`, {
      name: `Download Threats`,
    });
  });

  it('should render imprint link if env var is defined', () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = 'https://example.tld/imprint/';

    // when
    render(
      <Board
        G={G}
        ctx={ctx}
        matchID="123"
        moves={{}}
        playerID="0"
        credentials=""
      />,
    );

    // then
    const links = screen.queryAllByRole('link', {
      name: `Imprint`,
    });
    expect(links.length).toBe(1);
  });

  it('should not render imprint link if env var is not defined', () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = '';

    // when
    render(
      <Board
        G={G}
        ctx={ctx}
        matchID="123"
        moves={{}}
        playerID="0"
        credentials=""
      />,
    );

    // then
    const links = screen.queryAllByRole('link', {
      name: `Imprint`,
    });
    expect(links.length).toBe(0);
  });

  it('should render privacy link if env var is defined', () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = 'https://example.tld/privacy/';

    // when
    render(
      <Board
        G={G}
        ctx={ctx}
        matchID="123"
        moves={{}}
        playerID="0"
        credentials=""
      />,
    );

    // then
    const links = screen.queryAllByRole('link', {
      name: `Privacy`,
    });
    expect(links.length).toBe(1);
  });

  it('should not render privacy link if env var is not defined', () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = '';

    // when
    render(
      <Board
        G={G}
        ctx={ctx}
        matchID="123"
        moves={{}}
        playerID="0"
        credentials=""
      />,
    );

    // then
    const links = screen.queryAllByRole('link', {
      name: `Privacy`,
    });
    expect(links.length).toBe(0);
  });
});
