import _ from 'lodash';
import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import Timer from './timer'

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without crashing', () => {
  render(<Timer duration={60} targetTime={Date.now() + 60 * 1000} />, container);
});