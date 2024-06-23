import { GameMode } from '@eop/shared';
import type React from 'react';

import './licenseAttribution.css';

interface LicenseAttributionProps {
  gameMode: GameMode;
}

const LicenseAttribution: React.FC<LicenseAttributionProps> = ({
  gameMode,
}) => {
  switch (gameMode) {
    case GameMode.EOP:
      return (
        <div className="license-attribution">
          The card game{' '}
          <a href="https://www.microsoft.com/en-us/download/details.aspx?id=20303">
            Elevation of Privilege
          </a>{' '}
          by <a href="https://adam.shostack.org/">Adam Shostack</a> is licensed
          under{' '}
          <a href="https://creativecommons.org/licenses/by/3.0/us/">
            CC-BY-3.0
          </a>
          .
        </div>
      );

    case GameMode.CORNUCOPIA:
      return (
        <div className="license-attribution">
          The card game{' '}
          <a href="https://owasp.org/www-project-cornucopia/">Cornucopia</a> by
          the <a href="https://owasp.org/">OWASP foundation</a> is licensed
          under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC-BY-SA-3.0
          </a>
          .
        </div>
      );

    case GameMode.CUMULUS:
      return (
        <div className="license-attribution">
          The card game{' '}
          <a href="https://owasp.org/www-project-cumulus/">OWASP Cumulus</a> by{' '}
          <a href="https://www.tngtech.com/en/index.html">
            TNG Technology Consulting
          </a>{' '}
          is licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>.
        </div>
      );

    case GameMode.EOMLSEC:
      return (
        <div className="license-attribution">
          The card game{' '}
          <a href="https://github.com/kantega/elevation-of-mlsec">
            Elevation of MLsec
          </a>{' '}
          by <a href="https://www.kantega.no/">Kantega AS</a> is licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0 DEED
          </a>
          .
        </div>
      );

    default:
      return <></>;
  }
};

export default LicenseAttribution;
