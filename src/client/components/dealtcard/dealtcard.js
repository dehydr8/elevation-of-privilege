import React from 'react';
import PropTypes from 'prop-types';

class DealtCard extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
  };

  render() {
    let gamemode = false;
    return (
      <div className={`playing-card ${(gamemode) ? "c" : ""}card${this.props.card.toLowerCase()} active card-rounded scaled-big`} />
    );
  }
}

export default DealtCard;