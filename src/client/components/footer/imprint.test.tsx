import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Imprint from './imprint';

describe('Imprint', () => {
  it('should render link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = 'https://example.tld/imprint/'
    render(<Imprint />);

    // when
    const links = await screen.queryAllByRole('link');

    // then
    expect(links.length).toBe(1);
  });

  it('should not render link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = "";
    render(<Imprint />);

    // when
    const links = await screen.queryAllByRole('link');

    // then
    expect(links.length).toBe(0);
  });
});
