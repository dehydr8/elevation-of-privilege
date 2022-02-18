import React from 'react';
import ReactDOM from 'react-dom';
import { GameMode } from '../../../utils/constants';
import LicenseAttribution from './licenseAttribution';

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

it('gives the correct license for EoP', () => {
  ReactDOM.render(<LicenseAttribution gameMode={GameMode.EOP} />, div);

  const licenseAttribution = document.querySelector('.license-attribution');
  expect(licenseAttribution.innerHTML).toContain('CC-BY-3.0');
});

it('gives the correct license for Cornucopia', () => {
  ReactDOM.render(<LicenseAttribution gameMode={GameMode.CORNUCOPIA} />, div);

  const licenseAttribution = document.querySelector('.license-attribution');
  expect(licenseAttribution.innerHTML).toContain('CC-BY-SA-3.0');
});
