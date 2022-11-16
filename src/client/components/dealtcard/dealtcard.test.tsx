import React from 'react';
import ReactDOM from 'react-dom';
import DealtCard from './dealtcard';
import { DEFAULT_GAME_MODE } from '../../../utils/GameMode';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DealtCard card="T3" gameMode={DEFAULT_GAME_MODE} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
