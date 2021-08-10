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
    secret: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  apiEndpointUrl(apiEndpoint) {
    return `${this.apiBase}/${apiEndpoint}/${this.props.gameID}/${this.props.playerID}/${this.props.secret}`
  }

  render() {
    let dealtCard = getDealtCard(this.props.G);
    const isLastToPass = this.props.G.passed.length === this.props.ctx.numPlayers - 1 && !this.props.G.passed.includes(this.props.playerID)

    return (
      <div className="side-bar">
        <div className="text-center">
          <Footer short />
        </div>
        <Button block size="lg" color="success" href={this.apiEndpointUrl('download')}>
          <FontAwesomeIcon icon={faDownload} /> &nbsp; Download Model
        </Button>
        <Button block size="lg" color="warning" href={this.apiEndpointUrl('download/text')}>
          <FontAwesomeIcon icon={faDownload} /> &nbsp; Download Threats
        </Button>
        <hr />

        <Leaderboard gameMode={this.props.G.gameMode} passedUsers={this.props.G.passed} playerID={this.props.playerID} scores={this.props.G.scores} names={this.props.names} cards={getDealtCardsForPlayers(this.props.G.order, this.props.G.dealt)} />
        {isLastToPass && <div className="warning">You are the last one to pass!</div>}
        {(this.props.ctx.phase === "threats" &&
          !this.props.G.passed.includes(this.props.playerID) &&
          this.props.active) && <Button color={(isLastToPass) ? "warning" : "secondary"} className="pass" size="lg" block
            onClick={() => { this.props.moves.pass() }}>
            Pass
          </Button>}

        <DealtCard card={dealtCard} gameMode={this.props.G.gameMode} />

      </div>
    );
  }
}

export default Sidebar;