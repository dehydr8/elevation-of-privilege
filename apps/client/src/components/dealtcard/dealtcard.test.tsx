import { DEFAULT_GAME_MODE } from '@eop/shared';
import React from 'react';
import ReactDOM from 'react-dom';

import DealtCard from './dealtcard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DealtCard card="T3" gameMode={DEFAULT_GAME_MODE} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
