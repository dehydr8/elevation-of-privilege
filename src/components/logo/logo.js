import React from 'react';
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom'

class Logo extends React.Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { history } = this.props;
    return (
      <img src="logo.png" alt="logo" height="120px" onClick={() => history.push('/')} />
    );
  }
}

export default withRouter(Logo);