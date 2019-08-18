import React from 'react';
import ReactDOM from 'react-dom';
import Deck from './deck';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Deck suit="" cards={[]} phase="play" round={0} current={false} active={false} onCardSelect={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
