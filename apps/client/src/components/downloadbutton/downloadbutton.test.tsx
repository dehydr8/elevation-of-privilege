import React from 'react';
import { render, screen } from '@testing-library/react';

import DownloadButton from './downloadbutton';

describe('DownloadButton', () => {
  it('renders without crashing', async () => {
    // given
    render(
      <DownloadButton
        apiEndpoint="download"
        playerID="0"
        matchID="1234"
        secret="someSecret"
      >
        Button Text
      </DownloadButton>,
    );

    // when
    const button = await screen.findByRole('button', { name: 'Button Text' });

    // then
    expect(button).toBeInTheDocument();
  });
});
