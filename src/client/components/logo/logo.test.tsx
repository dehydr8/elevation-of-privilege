import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Logo from './logo';

describe('logo', () => {
  it('is rendered with alt text', () => {
    render(
      <Router>
        <Logo />
      </Router>,
    );

    screen.getByAltText('logo');
  });
});
