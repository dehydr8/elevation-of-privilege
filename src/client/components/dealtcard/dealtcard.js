import React from 'react';
import PropTypes from 'prop-types';

class DealtCard extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
  };

  render() {
    const cardClass = this.props.card ? this.props.card.toLowerCase() : '-none';
    return (
      <div className={`playing-card card${cardClass} active card-rounded scaled-big`} />
    );
  }
}

export default DealtCard;