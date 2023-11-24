import React from 'react';
import Sidebar from './sidebar';
import { DEFAULT_GAME_MODE } from '../../../utils/GameMode';
import { render, screen } from '@testing-library/react';
import type { GameState } from '../../../game/gameState';
import { ModelType } from '../../../utils/constants';
import type { Ctx } from 'boardgame.io';

describe('Sidebar', () => {
  it('renders without crashing', async () => {
    // given
    const G: GameState = {
      dealt: ['T1'],
      passed: ['1', '2'],
      suit: undefined,
      dealtBy: '0',
      players: [['T2'], ['T3'], ['T4']],
      round: 0,
      numCardsPlayed: 1,
      scores: [0, 0],
      lastWinner: 0,
      maxRounds: 10,
      selectedDiagram: 0,
      selectedComponent: 'some-component',
      selectedThreat: 'some-threat',
      threat: {
        modal: false,
        new: true,
      },
      identifiedThreats: {},
      startingCard: 'the starting card',
      gameMode: DEFAULT_GAME_MODE,
      turnDuration: 0,
      modelType: ModelType.PRIVACY_ENHANCED,
      turnFinishTargetTime: 0,
    };
    const ctx = { numPlayers: 3 } as Ctx;
    const moves = {};

    render(
      <Sidebar
        G={G}
        matchID="1234"
        ctx={ctx}
        moves={moves}
        current={true}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID="0"
        secret="super secret"
      />,
    );

    // when
    const foo = await screen.findByText('You are the last one to pass!');

    // then
    expect(foo).toBeInTheDocument();
  });
});
