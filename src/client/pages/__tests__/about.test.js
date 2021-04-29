import React from 'react';
import ReactDOM from 'react-dom';
import About from '../about';
import { BrowserRouter as Router } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <About />
    </Router>
  , div);
  ReactDOM.unmountComponentAtNode(div);
});