import React from 'react';
import PropTypes from 'prop-types';
import Leaderboard from '../leaderboard/leaderboard';
import DealtCard from '../dealtcard/dealtcard';
import DownloadButton from '../downloadbutton/downloadbutton';
import './sidebar.css';
import { Button } from 'reactstrap';
import { getDealtCard } from '../../../utils/utils';
import Footer from '../footer/footer';
import { ModelType, SPECTATOR } from '../../../utils/constants';

class Sidebar extends React.Component {
  static get propTypes() {
    return {
      playerID: PropTypes.any,
      matchID: PropTypes.any.isRequired,
      G: PropTypes.any.isRequired,
      ctx: PropTypes.any.isRequired,
      isInThreatStage: PropTypes.bool,
      moves: PropTypes.any.isRequired,
      current: PropTypes.bool.isRequired,
      active: PropTypes.bool.isRequired,
      names: PropTypes.any.isRequired,
      secret: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      isInThreatStage: false,
    };
  }

  render() {
    let dealtCard = getDealtCard(this.props.G);
    const isLastToPass =
      this.props.G.passed.length === this.props.ctx.numPlayers - 1 &&
      !this.props.G.passed.includes(this.props.playerID) &&
      this.props.playerID !== SPECTATOR;

    return (
      <div className="side-bar">
        <div className="text-center">
          <Footer short />
        </div>
        {(this.props.G.modelType === ModelType.THREAT_DRAGON ||
          this.props.G.modelType === ModelType.DEFAULT) && (
          <DownloadButton
            matchID={this.props.matchID}
            playerID={this.props.playerID}
            secret={this.props.secret}
            block
            size="lg"
            color="success"
            apiEndpoint="download"
          >
            Download Model
          </DownloadButton>
        )}
        <DownloadButton
          matchID={this.props.matchID}
          playerID={this.props.playerID}
          secret={this.props.secret}
          block
          size="lg"
          color="warning"
          apiEndpoint="download/text"
        >
          Download Threats
        </DownloadButton>
        <hr />

        <Leaderboard
          gameMode={this.props.G.gameMode}
          passedUsers={this.props.G.passed}
          playerID={this.props.playerID}
          scores={this.props.G.scores}
          names={this.props.names}
          cards={this.props.G.dealt}
        />

        {isLastToPass && (
          <div className="warning">You are the last one to pass!</div>
        )}
        {this.props.isInThreatStage &&
          !this.props.G.passed.includes(this.props.playerID) &&
          this.props.active && (
            <Button
              color={isLastToPass ? 'warning' : 'secondary'}
              className="pass"
              size="lg"
              block
              onClick={() => {
                this.props.moves.pass();
              }}
            >
              Pass
            </Button>
          )}

        <DealtCard card={dealtCard} gameMode={this.props.G.gameMode} />
      </div>
    );
  }
}

export default Sidebar;
