import React from 'react';
import PropTypes from 'prop-types';

class DealtCard extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
    gamemode: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={`playing-card ${(this.props.gamemode === "Cornucopia") ? "c" : ""}card${this.props.card.toLowerCase()} active card-rounded scaled-big`} />
    );
  }
}

export default DealtCard;