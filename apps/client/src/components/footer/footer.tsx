import React from 'react';
import type { FC } from 'react';
import packageJson from '../../../package.json';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Imprint from './imprint';
import './footer.css';
import Privacy from './privacy';

type FooterProps = {
  short?: boolean;
};

const Footer: FC<FooterProps> = ({ short }) => (
  <small className="text-muted">
    v{packageJson.version}
    {!short && (
      <>
        <span>
          {' '}
          - made with{' '}
          {/* @ts-expect-error @fortawesome/react-fontawesome uses an older version of @fortawesome/fontawesome-svg-core (1.3.0), which makes the types incompatible. It still works correctly at runtime. */}
          <FontAwesomeIcon icon={faHeart} style={{ color: '#00cc00' }} /> at
          Careem and{' '}
          <a href="https://www.tngtech.com/en/">TNG Technology Consulting</a> -
          Elevation of Privilege was originally invented at Microsoft,
          Cornucopia was developed at OWASP, Cumulus was started at{' '}
          <a href="https://www.tngtech.com/en/">TNG Technology Consulting</a>,
          Elevation of MLsec was developed at{' '}
          <a href="https://www.kantega.no/">Kantega AS</a>.
        </span>
        <div className="footer-container">
          <Imprint />
          <Privacy />
        </div>
      </>
    )}
  </small>
);

Footer.defaultProps = {
  short: false,
};

export default Footer;
