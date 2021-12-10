import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import Timer from './timer';
import { act } from 'react-dom/test-utils';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without crashing', () => {
  act(() => {
    render(
      <Timer duration={60} targetTime={Date.now() + 60 * 1000} />,
      container,
    );
  });
  expect(container.querySelector('.timer-wrapper')).toBeTruthy();
});

it("doesn't render when not active", () => {
  act(() => {
    render(
      <Timer
        active={false}
        duration={60}
        targetTime={Date.now() + 60 * 1000}
      />,
      container,
    );
  });
  expect(container.querySelector('.timer-wrapper')).toBeFalsy();
});

it("doesn't render when duration is zero", () => {
  act(() => {
    render(
      <Timer duration={0} targetTime={Date.now() + 60 * 1000} />,
      container,
    );
  });
  expect(container.querySelector('.timer-wrapper')).toBeFalsy();
});
