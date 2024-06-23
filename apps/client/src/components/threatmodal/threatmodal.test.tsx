import { DEFAULT_GAME_MODE, ModelType } from '@eop/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ThreatModal from './threatmodal';

import type { GameState } from '@eop/shared';

const baseG: GameState = {
  dealt: ['T1'],
  scores: [0, 0, 0],
  selectedComponent: '',
  selectedDiagram: 0,
  identifiedThreats: [],
  threat: {
    modal: true,
    new: true,
    owner: '0',
  },
  gameMode: DEFAULT_GAME_MODE,
  passed: [],
  suit: undefined,
  dealtBy: '',
  players: [],
  round: 0,
  numCardsPlayed: 0,
  lastWinner: 0,
  maxRounds: 0,
  selectedThreat: '',
  startingCard: '',
  turnDuration: 0,
  modelType: ModelType.IMAGE,
};

const moves = {};

it('renders without crashing for a new threat', () => {
  const moves = {};

  render(
    <ThreatModal
      playerID="0"
      G={baseG}
      moves={moves}
      names={['P1', 'P2', 'P3']}
      isOpen
    />,
  );
});

it('renders without crashing for an existing threat', () => {
  const G: GameState = { ...baseG, threat: { ...baseG.threat, new: false } };

  render(
    <ThreatModal
      playerID="0"
      G={G}
      moves={moves}
      names={['P1', 'P2', 'P3']}
      isOpen
    />,
  );
});

describe('for the owner of the threat', () => {
  const playerID = '0';
  const G: GameState = {
    ...baseG,
    threat: { ...baseG.threat, owner: playerID },
  };

  it('renders a close button', () => {
    // when
    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={moves}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    // then
    screen.getByText('×');
  });

  it('renders save and cancel buttons', () => {
    // when
    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={moves}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    // then
    screen.getByText('Save');
    screen.getByText('Cancel');
  });

  it('calls the toggleModal move when the close button is clicked', async () => {
    // given
    const toggleModal = jest.fn();
    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={{ toggleModal }}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    const close = screen.getByText('×');

    // when
    await userEvent.click(close);

    // then
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  it('calls the toggleModal move when the cancel button is clicked', async () => {
    // given
    const toggleModal = jest.fn();
    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={{ toggleModal }}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    const cancel = screen.getByText('Cancel');

    // when
    await userEvent.click(cancel);

    // then
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  it('calls the the updateThreat move when the title is changed and unfocused', async () => {
    // given
    const addOrUpdateThreat = jest.fn();
    const updateThreat = jest.fn();

    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={{ addOrUpdateThreat, updateThreat }}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    const title = screen.getByLabelText('Title');
    const description = screen.getByLabelText('Description');

    // when
    const user = userEvent.setup();
    await user.tripleClick(title);
    await user.keyboard('Some Threat Title');
    await user.tripleClick(description);

    // then
    expect(updateThreat).toHaveBeenCalledTimes(1);
    expect(updateThreat).toHaveBeenCalledWith('title', 'Some Threat Title');
  });

  it('calls the addOrUpdateThreat move when the save button is clicked', async () => {
    // given
    const addOrUpdateThreat = jest.fn();
    const updateThreat = jest.fn();

    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={{ addOrUpdateThreat, updateThreat }}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    const title = screen.getByLabelText('Title');
    const description = screen.getByLabelText('Description');
    const save = screen.getByText('Save');

    const user = userEvent.setup();
    await user.tripleClick(title);
    await user.keyboard('Some Threat Title');
    await user.tripleClick(description);
    await user.keyboard('Some Description');

    // when
    await userEvent.click(save);

    // then
    expect(addOrUpdateThreat).toHaveBeenCalledTimes(1);
  });
});

describe('for players other than the owner of the threat', () => {
  const playerID = '0';
  const ownerID = '1';

  const G: GameState = {
    ...baseG,
    threat: {
      ...baseG.threat,
      owner: ownerID,
    },
  };

  it('does not render a close button', () => {
    // when
    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={moves}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    // then
    expect(screen.queryByText('×')).not.toBeInTheDocument();
  });

  it('does not render save and cancel buttons', () => {
    // when
    render(
      <ThreatModal
        playerID={playerID}
        G={G}
        moves={moves}
        names={['P1', 'P2', 'P3']}
        isOpen
      />,
    );

    // then
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
});
