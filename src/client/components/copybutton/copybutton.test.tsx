import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CopyButton from './copybutton';
import * as utils from '../../utils/utils';

describe('CopyButton', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', async () => {
    // given
    render(<CopyButton text={'Some sample text'}>Button Text</CopyButton>);

    // when
    const button = await screen.findByRole('button', { name: 'Button Text' });

    // then
    expect(button).toBeInTheDocument();
  });

  it('test button copied when clicked', async () => {
    // given
    const copyToClipboardSpy = jest.spyOn(utils, 'copyToClipboard');
    copyToClipboardSpy.mockResolvedValueOnce();
    render(<CopyButton text={'Hello, world!'}>Button Text</CopyButton>);
    const button = await screen.findByRole('button', { name: 'Button Text' });

    // when
    userEvent.click(button);

    // then
    expect(copyToClipboardSpy).toHaveBeenCalledWith('Hello, world!');
    const img = await within(button).findByRole('img', { hidden: true });
    expect(img).toHaveClass('fa-check');
    await waitFor(() => expect(img).toHaveClass('fa-copy'));
  });
});
