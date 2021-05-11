import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './logo';
import { BrowserRouter as Router } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <Router>
    <Logo />
  </Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
