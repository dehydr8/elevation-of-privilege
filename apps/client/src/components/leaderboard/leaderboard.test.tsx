import { DEFAULT_GAME_MODE } from '@eop/shared';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Leaderboard from './leaderboard';

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
