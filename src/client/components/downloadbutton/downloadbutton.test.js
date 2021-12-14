import React from 'react';
import ReactDOM from 'react-dom';
import DownloadButton from './downloadbutton';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without crashing', () => {
  ReactDOM.render(
    <DownloadButton apiEndpoint="download" playerID={0} matchID="1234" />,
    container,
  );
});
