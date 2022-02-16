import type { Location, History } from 'history';
import PropTypes from 'prop-types';
import React, { Validator } from 'react';
import { match, RouteComponentProps, withRouter } from 'react-router-dom';

class Logo extends React.Component<RouteComponentProps> {
  static get propTypes() {
    return {
      match: PropTypes.object.isRequired as Validator<match>,
      location: PropTypes.object.isRequired as Validator<Location<unknown>>,
      history: PropTypes.object.isRequired as Validator<History<unknown>>,
    };
  }

  render() {
    const { history } = this.props;
    return (
      <img
        src="logo.png"
        alt="logo"
        height="120px"
        onClick={() => history.push('/')}
      />
    );
  }
}

export default withRouter(Logo);
