import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from './banner';

describe('Banner', () => {
  const envBackup = process.env

  afterEach(() => process.env = envBackup);
  
  it('should render link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_BANNER_TEXT = 'This is a banner text'
    render(<Banner />);

    // when
    const banner = await screen.findByText('This is a banner text');

    // then
    expect(banner).toBeInTheDocument();
  });

  it('should not render link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_BANNER_TEXT = "";
    render(<Banner />);

    // when
    const banner = await screen.queryByText('This is a banner text');

    // then
    expect(banner).not.toBeInTheDocument();
  });
});
