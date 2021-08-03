import React from 'react';
import PropTypes from 'prop-types';
import { getValidMoves, isGameModeCornucopia } from '../../../utils/utils';
import { render } from 'react-dom';


class Deck extends React.Component {
  static propTypes = {
    suit: PropTypes.any.isRequired,
    cards: PropTypes.any.isRequired,
    phase: PropTypes.string.isRequired,
    round: PropTypes.any.isRequired,
    current: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    onCardSelect: PropTypes.func.isRequired,
    startingCard: PropTypes.string.isRequired,
    gameMode: PropTypes.string.isRequired,
  };


  getRenderedDeck() {
    let left = this.props.cards;
    let suit = this.props.suit;
    let validMoves = [];

    if (this.props.current && this.props.active && this.props.phase === "play") {
      validMoves = getValidMoves(left, suit, this.props.round, this.props.startingCard);
    }

    let deck = left
      .map(e => (
        <li key={e} className={` playing-card ${(isGameModeCornucopia(this.props.gameMode)) ? `cornucopiacard ccard${e.toLowerCase()}` : `card${e.toLowerCase()}`} ${validMoves.includes(e) ? 'active' : ''} card-rounded scaled`} onClick={() => this.props.onCardSelect(e)} />
      ));

    return (
      <ul className="hand">
        {deck}
      </ul>
    );
  }

  render() {
    let deck = this.getRenderedDeck();
    return (
      <div className="playingCards">
        {deck}
      </div>
    );
  }
}

export default Deck;