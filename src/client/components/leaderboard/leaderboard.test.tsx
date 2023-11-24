import React from 'react';
import Leaderboard from './leaderboard';
import { DEFAULT_GAME_MODE } from '../../../utils/GameMode';
import { render, screen } from '@testing-library/react';

describe('Leaderboard', () => {
  it('renders without crashing', () => {
    // given
    render(
      <Leaderboard
        scores={[0, 0, 0]}
        names={['P1', 'P2', 'P3']}
        cards={['T3', 'T4', 'T5']}
        playerID="0"
        passedUsers={[]}
        gameMode={DEFAULT_GAME_MODE}
      />,
    );

    // when
    const result = screen.getByText('E3');

    // then
    expect(result).toBeInTheDocument();
  });
});
