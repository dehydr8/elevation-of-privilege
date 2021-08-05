import React from 'react';
import PropTypes from 'prop-types';
import packageJson from '../../../../package.json';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Footer extends React.Component {

  static propTypes = {
    short: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <small className="text-muted">
        v {packageJson.version}
        {!this.props.short && <span> - made with <FontAwesomeIcon icon={faHeart} style={{color: "#00cc00"}} /> at Careem and <a href="https://www.tngtech.com/en/">TNG Technology Consulting</a> - game originally invented by Microsoft</span>}
      </small>
    );
  }
}

Footer.defaultProps = {
  short: false,
}

export default Footer;
