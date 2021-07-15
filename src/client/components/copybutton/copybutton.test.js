import React from 'react';
import ReactDOM from 'react-dom';
import CopyButton from './copybutton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CopyButton text={"Some sample text"} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
