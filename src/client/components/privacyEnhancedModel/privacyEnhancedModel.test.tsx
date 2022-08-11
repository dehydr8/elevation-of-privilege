import { render, screen } from '@testing-library/react';
import React from 'react';
import PrivacyEnhancedModel from './privacyEnhancedModel';

describe('privacy enhanced model', () => {
  it('should provide link to model', () => {
    const linkToModel = 'https://link/to/model';

    render(<PrivacyEnhancedModel modelRef={linkToModel} />);

    screen.getByText(linkToModel);
    screen.getByRole('link');
  });

  it('should not provide link to model if there is no modelRef', () => {
    render(<PrivacyEnhancedModel modelRef={undefined} />);

    expect(screen.queryByRole('link')).toBeNull();
  });
});
