import React from 'react';
import PropTypes from 'prop-types';
import './licenseAttribution.css';
import { GAMEMODE_CORNUCOPIA, GAMEMODE_EOP } from '../../../utils/constants';

class LicenseAttribution extends React.Component {
  static get propTypes() {
    return {
      gameMode: PropTypes.string.isRequired,
    };
  }

  render() {
    switch (this.props.gameMode) {
      case GAMEMODE_EOP:
        return (
          <div className="license-attribution">
            The card game{' '}
            <a href="https://www.microsoft.com/en-us/download/details.aspx?id=20303">
              Elevation of Privilege
            </a>{' '}
            by <a href="https://adam.shostack.org/">Adam Shostack</a> is
            licensed under{' '}
            <a href="https://creativecommons.org/licenses/by/3.0/us/">
              CC-BY-3.0
            </a>
            .
          </div>
        );

      case GAMEMODE_CORNUCOPIA:
        return (
          <div className="license-attribution">
            The card game{' '}
            <a href="https://owasp.org/www-project-cornucopia/">Cornucopia</a>{' '}
            by the <a href="https://owasp.org/">OWASP foundation</a> is licensed
            under{' '}
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">
              CC-BY-SA-3.0
            </a>
            .
          </div>
        );

      default:
        return <></>;
    }
  }
}

export default LicenseAttribution;
