import React from 'react';
import PropTypes from 'prop-types';
import { isGameModeCornucopia } from '../../../utils/constants';

class DealtCard extends React.Component {
  static get propTypes() {
    return {
      card: PropTypes.string.isRequired,
      gameMode: PropTypes.string.isRequired,
    };
  }

  render() {
    return (
      <div
        className={`playing-card ${
          isGameModeCornucopia(this.props.gameMode)
            ? ` cornucopiacard ccard${this.props.card.toLowerCase()}`
            : `card${this.props.card.toLowerCase()}`
        } active card-rounded scaled-big`}
      />
    );
  }
}

export default DealtCard;
