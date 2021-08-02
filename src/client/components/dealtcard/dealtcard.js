import React from 'react';
import PropTypes from 'prop-types';
import { isGameModeCornucopia } from '../../../utils/utils';

class DealtCard extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
    gameMode: PropTypes.string.isRequired,
  };

  render() {
    const cardClass = this.props.card ? this.props.card.toLowerCase() : '-none';
    return (
      <div className={`playing-card ${(isGameModeCornucopia(this.props.gameMode)) ? "c" : ""}card${this.props.card.toLowerCase()} active card-rounded scaled-big`} />
    );
  }
}

export default DealtCard;