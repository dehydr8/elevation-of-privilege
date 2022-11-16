import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { GameMode } from '../../../utils/GameMode';
import React from 'react';
import Threatbar from './threatbar';

describe('<Threatbar>', () => {
  const G = {
    gameMode: GameMode.EOP,
    threat: {
      modal: false,
    },
    selectedDiagram: 'diagram1',
    selectedComponent: 'component1',
    identifiedThreats: {
      diagram1: {
        component1: {
          threat1: {
            title: 'Identified Threat 1',
          },
          threat2: {
            title: 'Identified Threat 2',
          },
        },
      },
    },
  };

  it('shows identified threats in reverse order', () => {
    const model = {
      detail: {
        diagrams: {
          diagram1: {
            diagramJson: {
              cells: [
                {
                  id: 'component1',
                  type: 'type',
                  attrs: {
                    text: {
                      text: 'text',
                    },
                  },
                  threats: [
                    {
                      title: 'Existing Threat 1',
                    },
                    {
                      title: 'Existing Threat 2',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    render(
      <Threatbar G={G} ctx={{}} moves={{}} active names={[]} model={model} />,
    );

    const threats = screen.getAllByText(/^Identified Threat \d+$/);
    expect(threats).toHaveLength(2);
    expect(threats[0]).toHaveTextContent('Identified Threat 2');
    expect(threats[1]).toHaveTextContent('Identified Threat 1');
  });

  it('shows existing threats in reverse order', () => {
    const model = {
      detail: {
        diagrams: {
          diagram1: {
            diagramJson: {
              cells: [
                {
                  id: 'component1',
                  type: 'type',
                  attrs: {
                    text: {
                      text: 'text',
                    },
                  },
                  threats: [
                    {
                      title: 'Existing Threat 1',
                    },
                    {
                      title: 'Existing Threat 2',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    render(
      <Threatbar G={G} ctx={{}} moves={{}} active names={[]} model={model} />,
    );

    const threats = screen.getAllByText(/^Existing Threat \d+$/);
    expect(threats).toHaveLength(2);
    expect(threats[0]).toHaveTextContent('Existing Threat 2');
    expect(threats[1]).toHaveTextContent('Existing Threat 1');
  });
});
