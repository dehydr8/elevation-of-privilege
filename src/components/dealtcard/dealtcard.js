import React from 'react';
import PropTypes from 'prop-types';

class DealtCard extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={`playing-card card${this.props.card.toLowerCase()} active card-rounded scaled-big`} />
    );
  }
}

export default DealtCard;