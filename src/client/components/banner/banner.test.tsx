import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from './banner';

describe('Banner', () => {
  it('should render link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_BANNER_TEXT = 'This is a banner text'
    render(<Banner />);

    // when
    const banners = await screen.queryAllByText('This is a banner text');

    // then
    expect(banners.length).toBe(1);
  });

  it('should not render link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_BANNER_TEXT = "";
    render(<Banner />);

    // when
    const banners = await screen.queryAllByText('This is a banner text');

    // then
    expect(banners.length).toBe(0);
  });
});
