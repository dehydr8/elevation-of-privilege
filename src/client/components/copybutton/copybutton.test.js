import React from 'react';
import ReactDOM from 'react-dom';
import CopyButton from './copybutton';
import { act } from 'react-dom/test-utils';
import * as utils from '../../utils/utils';

let div = null;
beforeEach(() => {
  div = document.createElement('div');
  document.body.appendChild(div);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(div);
  div.remove();
  div = null;
});

it('renders without crashing', () => {
  ReactDOM.render(<CopyButton text={'Some sample text'} />, div);
});

it('test button copied when clicked', () => {
  const copyToClipboardSpy = jest.spyOn(utils, 'copyToClipboard');

  act(() => {
    ReactDOM.render(<CopyButton text={'Hello, world!'} />, div);
  });

  const button = document.querySelector('.btn');

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(copyToClipboardSpy).toHaveBeenCalledWith('Hello, world!');
});
