import React from 'react';
import PropTypes from 'prop-types';
import Leaderboard from '../leaderboard/leaderboard';
import DealtCard from '../dealtcard/dealtcard';
import DownloadButton from '../downloadbutton/downloadbutton';
import './sidebar.css';
import { Button } from 'reactstrap';
import { getDealtCard } from '../../../utils/utils'
import { API_PORT } from '../../../utils/constants';
import Footer from '../footer/footer';

class Sidebar extends React.Component {
  static propTypes = {
    playerID: PropTypes.any,
    matchID: PropTypes.any.isRequired,
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    isInThreatStage: PropTypes.bool,
    moves: PropTypes.any.isRequired,
    current: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    names: PropTypes.any.isRequired,
    secret: PropTypes.string
  };

  static defaultProps = {
    isInThreatStage: false,
  };

  render() {
    let dealtCard = getDealtCard(this.props.G);
    const isLastToPass = this.props.G.passed.length === this.props.ctx.numPlayers - 1 && !this.props.G.passed.includes(this.props.playerID)

    return (
      <div className="side-bar">
        <div className="text-center">
          <Footer short />
        </div>
        <DownloadButton matchID={this.props.matchID} playerID={this.props.playerID} secret={this.props.secret} block size="lg" color="success" apiEndpoint="download" >Download Model</DownloadButton>
        <DownloadButton matchID={this.props.matchID} playerID={this.props.playerID} secret={this.props.secret} block size="lg" color="warning" apiEndpoint="download/text">Download Threats</DownloadButton>
        <hr />

        <Leaderboard gameMode={this.props.G.gameMode} passedUsers={this.props.G.passed} playerID={this.props.playerID} scores={this.props.G.scores} names={this.props.names} cards={this.props.G.dealt} />
        {isLastToPass && <div className="warning">You are the last one to pass!</div>}
        {(this.props.isInThreatStage &&
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