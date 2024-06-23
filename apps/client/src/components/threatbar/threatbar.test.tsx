import { GameMode, ModelType } from '@eop/shared';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Threatbar from './threatbar';

import type { GameState, ThreatDragonModel } from '@eop/shared';

describe('<Threatbar>', () => {
  const selectedDiagram = 0;
  const G: GameState = {
    gameMode: GameMode.EOP,
    threat: {
      modal: false,
      new: false,
    },
    selectedDiagram,
    selectedComponent: 'component1',
    identifiedThreats: [
      {
        component1: {
          threat1: {
            title: 'Identified Threat 1',
            modal: false,
            new: false,
          },
          threat2: {
            title: 'Identified Threat 2',
            modal: false,
            new: false,
          },
        },
      },
    ],
    dealt: [],
    passed: [],
    suit: undefined,
    dealtBy: '',
    players: [],
    round: 0,
    numCardsPlayed: 0,
    scores: [],
    lastWinner: 0,
    maxRounds: 0,
    selectedThreat: '',
    startingCard: '',
    turnDuration: 0,
    modelType: ModelType.IMAGE,
  };

  it('shows identified threats in reverse order', () => {
    const model: ThreatDragonModel = {
      summary: {
        title: 'title',
      },
      detail: {
        diagrams: [
          {
            id: 0,
            diagramJson: {
              cells: [
                {
                  size: { width: 0, height: 0 },
                  position: { x: 0, y: 0 },
                  angle: 0,
                  z: 0,
                  id: 'component1',
                  type: 'tm.Actor',
                  attrs: {
                    text: {
                      text: 'text',
                    },
                  },
                  hasOpenThreats: true,
                  threats: [
                    {
                      title: 'Existing Threat 1',
                      status: 'Open',
                      description: '',
                      mitigation: '',
                      severity: '',
                      type: '',
                    },
                    {
                      title: 'Existing Threat 2',
                      status: 'Open',
                      description: '',
                      mitigation: '',
                      severity: '',
                      type: '',
                    },
                  ],
                },
              ],
            },
            diagramType: 'STRIDE',
            size: { width: 0, height: 0 },
            thumbnail: '',
            title: '',
          },
        ],
      },
    };

    render(
      <Threatbar
        G={G}
        moves={{}}
        active
        names={[]}
        model={model}
        isInThreatStage={false}
        playerID={null}
      />,
    );

    const threats = screen.getAllByText(/^Identified Threat \d+$/);
    expect(threats).toHaveLength(2);
    expect(threats[0]).toHaveTextContent('Identified Threat 2');
    expect(threats[1]).toHaveTextContent('Identified Threat 1');
  });

  it('shows existing threats in reverse order', () => {
    const model: ThreatDragonModel = {
      summary: {
        title: 'title',
      },
      detail: {
        diagrams: [
          {
            id: 0,
            diagramJson: {
              cells: [
                {
                  size: { width: 0, height: 0 },
                  position: { x: 0, y: 0 },
                  angle: 0,
                  z: 0,
                  id: 'component1',
                  type: 'tm.Actor',
                  attrs: {
                    text: {
                      text: 'text',
                    },
                  },
                  hasOpenThreats: true,
                  threats: [
                    {
                      title: 'Existing Threat 1',
                      status: 'Open',
                      description: '',
                      mitigation: '',
                      severity: '',
                      type: '',
                    },
                    {
                      title: 'Existing Threat 2',
                      status: 'Open',
                      description: '',
                      mitigation: '',
                      severity: '',
                      type: '',
                    },
                  ],
                },
              ],
            },
            diagramType: 'STRIDE',
            size: { width: 0, height: 0 },
            thumbnail: '',
            title: '',
          },
        ],
      },
    };

    render(
      <Threatbar
        G={G}
        moves={{}}
        active
        names={[]}
        model={model}
        isInThreatStage={false}
        playerID={null}
      />,
    );

    const threats = screen.getAllByText(/^Existing Threat \d+$/);
    expect(threats).toHaveLength(2);
    expect(threats[0]).toHaveTextContent('Existing Threat 2');
    expect(threats[1]).toHaveTextContent('Existing Threat 1');
  });
});
