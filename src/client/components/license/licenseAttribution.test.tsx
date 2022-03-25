import React from 'react';
import { render, screen } from '@testing-library/react';
import { GAMEMODE_CORNUCOPIA, GAMEMODE_EOP } from '../../../utils/constants';
import LicenseAttribution from './licenseAttribution';

describe('licence attribution', () => {
  it('gives the correct license for EoP', () => {
    render(<LicenseAttribution gameMode={GAMEMODE_EOP} />);

    screen.getByText('CC-BY-3.0');
  });

  it('gives the correct license for Cornucopia', () => {
    render(<LicenseAttribution gameMode={GAMEMODE_CORNUCOPIA} />);

    screen.getByText('CC-BY-SA-3.0');
  });
});
