import React from 'react';
import { render, screen } from '@testing-library/react';
import Imprint from './imprint';

describe('Imprint', () => {
  it('should render link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = 'https://example.tld/imprint/'
    render(<Imprint />);

    // when
    const link = await screen.findByRole('link');

    // then
    expect(link).toBeInTheDocument();
  });

  it('should not render link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = "";
    render(<Imprint />);

    // when
    const link = screen.queryByRole('link');

    // then
    expect(link).not.toBeInTheDocument();
  });
});
