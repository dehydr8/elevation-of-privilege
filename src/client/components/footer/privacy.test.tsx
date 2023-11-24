import React from 'react';
import { render, screen } from '@testing-library/react';
import Privacy from './privacy';

describe('Privacy', () => {
  it('should render link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = 'https://example.tld/privacy/'
    render(<Privacy />);

    // when
    const link = await screen.findByRole('link');

    // then
    expect(link).toBeInTheDocument();
  });

  it('should not render link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = "";
    render(<Privacy />);

    // when
    const link = screen.queryByRole('link');

    // then
    expect(link).not.toBeInTheDocument();
  });
});
