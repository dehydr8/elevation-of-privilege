import React from 'react';
import PropTypes from 'prop-types';
import Leaderboard from '../leaderboard/leaderboard';
import DealtCard from '../dealtcard/dealtcard';
import './sidebar.css';
import { Button } from 'reactstrap';
import { getDealtCard, getDealtCardsForPlayers } from '../../../utils/utils'
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_PORT } from '../../../utils/constants';
import Footer from '../footer/footer';

class Sidebar extends React.Component {
  static propTypes = {
    playerID: PropTypes.any,
    gameID: PropTypes.any.isRequired,
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    current: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    names: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  render() {
    let dealtCard = getDealtCard(this.props.G);

    return (
        <div className="side-bar">
          <div className="text-center">
            <Footer short />
          </div>
          <Button block size="lg" color="success" href={`${this.apiBase}/download/${this.props.gameID}`}>
            <FontAwesomeIcon icon={faDownload} />
            {' '}
            Download Model
          </Button>
          <hr />
          <Leaderboard playerID={this.props.playerID} scores={this.props.G.scores} names={this.props.names} cards={getDealtCardsForPlayers(this.props.G.order, this.props.G.dealt)} />
          <hr />
          <Button color="secondary" size="lg" block disabled={
              this.props.ctx.phase !== "threats" ||
              this.props.G.passed.includes(this.props.playerID) ||
              !this.props.active
            } onClick={() => { this.props.moves.pass() }}>
              Pass
          </Button>
          <DealtCard card={dealtCard} />
        </div>
    );
  }
}

export default Sidebar;