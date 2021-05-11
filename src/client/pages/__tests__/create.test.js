import React from 'react';
import ReactDOM from 'react-dom';
import Create from '../create';
import { BrowserRouter as Router } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <Router>
    <Create />
  </Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
