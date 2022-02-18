import React from 'react';
import ReactDOM from 'react-dom';
import Deck from './deck';
import { GameMode } from '../../../utils/constants';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Deck
      suit=""
      cards={[]}
      phase="play"
      round={0}
      current={false}
      active={false}
      onCardSelect={() => {}}
      startingCard="T3"
      gameMode={GameMode.EOP}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('renders active card correctly', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Deck
      suit=""
      cards={['T3', 'S2']}
      phase="play"
      round={0}
      current={true}
      active={true}
      onCardSelect={() => {}}
      startingCard="T3"
      gameMode={GameMode.EOP}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

// TODO: Test card renders correctly for cornucopia as well
