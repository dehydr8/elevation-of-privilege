import { DEFAULT_GAME_MODE, ModelType } from '@eop/shared';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Status from './status';

import type { GameState } from '@eop/shared';
import type { Ctx } from 'boardgame.io';

describe('Status', () => {
  const G: GameState = {
    dealt: ['T2'],
    players: [[]],
    scores: [0, 0, 0],
    gameMode: DEFAULT_GAME_MODE,
    passed: [],
    suit: undefined,
    dealtBy: '0',
    round: 0,
    numCardsPlayed: 0,
    lastWinner: 0,
    maxRounds: 0,
    selectedDiagram: 0,
    selectedComponent: '',
    selectedThreat: '',
    threat: {
      modal: false,
      new: false,
    },
    identifiedThreats: [],
    startingCard: '',
    turnDuration: 0,
    modelType: ModelType.IMAGE,
  };

  it('renders waiting for player to play a card text in play stage', async () => {
    // given
    const ctx = { currentPlayer: '0' } as Ctx;

    // when
    render(
      <Status
        G={G}
        ctx={ctx}
        playerID={null}
        names={['P1', 'P2', 'P3']}
        dealtCard={''}
        isInThreatStage={false}
      />,
    );

    // then
    const waitingForPlayerText = await findBrokenByText(
      'Waiting for P1 to play a card.',
    );
    expect(waitingForPlayerText).toBeInTheDocument();
  });

  it('renders waiting for players to play threats or pass text in threat stage', async () => {
    // given
    const ctx = { currentPlayer: '0', numPlayers: 3 } as Ctx;

    // when
    render(
      <Status
        G={G}
        ctx={ctx}
        names={['P1', 'P2', 'P3']}
        dealtCard="T2"
        playerID="0"
        isInThreatStage={true}
      />,
    );

    // then
    const text = await findBrokenByText(
      'You dealt E2, waiting for You, P2 and P3 to add threats or pass.',
    );
    expect(text).toBeInTheDocument();
  });

  it('renders last won in play stage, if a round has been won already', async () => {
    // given
    const GWithWInnerOfPreviousRound = { ...G, round: 2, lastWinner: 1 };
    const ctx = { currentPlayer: '0' } as Ctx;

    // when
    render(
      <Status
        G={GWithWInnerOfPreviousRound}
        ctx={ctx}
        names={['P1', 'P2', 'P3']}
        dealtCard=""
        playerID="0"
        isInThreatStage={false}
      />,
    );

    // then
    const waitingForPlayerText = await findBrokenByText(
      'Last round won by P2. Waiting for You to play a card.',
    );
    expect(waitingForPlayerText).toBeInTheDocument();
  });
});

function findBrokenByText(text: string) {
  return screen.findByText((_, element) => {
    const hasText = (element: Element | null) => element?.textContent === text;
    const nodeHasText = hasText(element);
    const childrenDontHaveText = Array.from(element?.children ?? []).every(
      (child) => !hasText(child),
    );

    return nodeHasText && childrenDontHaveText;
  });
}
