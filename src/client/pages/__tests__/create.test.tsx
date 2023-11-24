import React from 'react';
import { render, screen } from '@testing-library/react';
import Create from '../create';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Create', () => {
  it('renders without crashing', async () => {
    render(<Router><Create /></Router>);

    await screen.getAllByRole('button', {
      name: 'Proceed'
    });
  });

  it('should render imprint link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = 'https://example.tld/imprint/'

    // when
    render(<Router><Create /></Router>);

    // when

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Imprint`
    });
    expect(links.length).toBe(1);
  });

  it('should not render imprint link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_IMPRINT = "";

    // when
    render(<Router><Create /></Router>);

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Imprint`
    });
    expect(links.length).toBe(0);
  });

  it('should render privacy link if env var is defined', async () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = 'https://example.tld/privacy/'

    // when
    render(<Router><Create /></Router>);

    // when

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Privacy`
    });
    expect(links.length).toBe(1);
  });

  it('should not render privacy link if env var is not defined', async () => {
    // given
    process.env.REACT_APP_EOP_PRIVACY = "";

    // when
    render(<Router><Create /></Router>);

    // then
    const links = await screen.queryAllByRole('link', {
      name: `Privacy`
    });
    expect(links.length).toBe(0);
  });

});
