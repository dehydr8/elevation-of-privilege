import { render, screen } from '@testing-library/react';
import React from 'react';
import { GameMode } from '../../../utils/constants';
import LicenseAttribution from './licenseAttribution';

describe('licence attribution', () => {
  it('gives the correct license for EoP', () => {
    render(<LicenseAttribution gameMode={GameMode.EOP} />);

    screen.getByText('CC-BY-3.0');
  });

  it('gives the correct license for Cornucopia', () => {
    render(<LicenseAttribution gameMode={GameMode.CORNUCOPIA} />);

    screen.getByText('CC-BY-SA-3.0');
  });
});
