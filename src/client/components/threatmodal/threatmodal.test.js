import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ThreatModal from './threatmodal';
import { DEFAULT_GAME_MODE } from '../../../utils/GameMode';

it('renders without crashing for a new threat', () => {
  const G = {
    dealt: ['T1'],
    order: [0, 1, 2],
    scores: [0, 0, 0],
    selectedComponent: '',
    selectedDiagram: '0',
    identifiedThreats: {},
    threat: {
      modal: true,
      owner: '0',
    },
    gameMode: DEFAULT_GAME_MODE,
  };
  const ctx = {};
  const moves = {};

  render(
    <ThreatModal
      isOpen
      G={G}
      ctx={ctx}
      model={null}
      moves={moves}
      active={true}
      names={['P1', 'P2', 'P3']}
      playerID="0"
    />,
  );
});

it('renders without crashing for an existing threat', () => {
  const G = {
    dealt: ['T1'],
    order: [0, 1, 2],
    scores: [0, 0, 0],
    selectedComponent: '',
    selectedDiagram: '0',
    identifiedThreats: {},
    threat: {
      modal: true,
      new: false,
      owner: '0',
    },
    gameMode: DEFAULT_GAME_MODE,
  };
  const ctx = {};
  const moves = {};

  render(
    <ThreatModal
      isOpen
      G={G}
      ctx={ctx}
      model={null}
      moves={moves}
      active={true}
      names={['P1', 'P2', 'P3']}
      playerID="0"
    />,
  );
});

describe('for the owner of the threat', () => {
  const playerID = '0';
  const G = {
    dealt: ['T1'],
    order: [0, 1, 2],
    scores: [0, 0, 0],
    selectedComponent: '',
    selectedDiagram: '0',
    identifiedThreats: {},
    threat: {
      modal: true,
      owner: playerID,
    },
    gameMode: DEFAULT_GAME_MODE,
  };
  const ctx = {};
  const moves = {};

  it('renders a close button', () => {
    // when
    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={moves}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    // then
    screen.getByText('×');
  });

  it('renders save and cancel buttons', () => {
    // when
    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={moves}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    // then
    screen.getByText('Save');
    screen.getByText('Cancel');
  });

  it('calls the toggleModal move when the close button is clicked', () => {
    // given
    const toggleModal = jest.fn();
    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={{ toggleModal }}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    const close = screen.getByText('×');

    // when
    fireEvent.click(close);

    // then
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  it('calls the toggleModal move when the cancel button is clicked', () => {
    // given
    const toggleModal = jest.fn();
    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={{ toggleModal }}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    const cancel = screen.getByText('Cancel');

    // when
    fireEvent.click(cancel);

    // then
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  it('calls the the updateThreat move when the title is changed and unfocused', () => {
    // given
    const addOrUpdateThreat = jest.fn();
    const updateThreat = jest.fn();

    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={{ addOrUpdateThreat, updateThreat }}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    const title = screen.getByLabelText('Title');

    // when
    fireEvent.focus(title);
    fireEvent.change(title, { target: { value: 'Some Threat Title' } });
    fireEvent.blur(title);

    // then
    expect(updateThreat).toHaveBeenCalledTimes(1);
    expect(updateThreat).toHaveBeenCalledWith('title', 'Some Threat Title');
  });

  it('calls the addOrUpdateThreat move when the save button is clicked', () => {
    // given
    const addOrUpdateThreat = jest.fn();
    const updateThreat = jest.fn();

    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={{ addOrUpdateThreat, updateThreat }}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    const title = screen.getByLabelText('Title');
    const description = screen.getByLabelText('Description');
    const save = screen.getByText('Save');

    fireEvent.focus(title);
    fireEvent.change(title, { target: { value: 'Some Threat Title' } });
    fireEvent.blur(title);
    fireEvent.focus(description);
    fireEvent.change(description, {
      target: { value: 'Some Description' },
    });
    fireEvent.blur(description);

    // when
    fireEvent.click(save);

    // then
    expect(addOrUpdateThreat).toHaveBeenCalledTimes(1);
  });
});

describe('for players other than the owner of the threat', () => {
  const playerID = '0';
  const ownerID = '1';
  const G = {
    dealt: ['T1'],
    order: [0, 1, 2],
    scores: [0, 0, 0],
    selectedComponent: '',
    selectedDiagram: '0',
    identifiedThreats: {},
    threat: {
      modal: true,
      owner: ownerID,
    },
    gameMode: DEFAULT_GAME_MODE,
  };
  const ctx = {};
  const moves = {};

  it('does not render a close button', () => {
    // when
    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={moves}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    // then
    expect(screen.queryByText('×')).toBeNull();
  });

  it('does not render save and cancel buttons', () => {
    // when
    render(
      <ThreatModal
        isOpen
        G={G}
        ctx={ctx}
        model={null}
        moves={moves}
        active={true}
        names={['P1', 'P2', 'P3']}
        playerID={playerID}
      />,
    );

    // then
    expect(screen.queryByText('Save')).toBeNull();
    expect(screen.queryByText('Cancel')).toBeNull();
  });
});
