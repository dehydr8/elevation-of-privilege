import React from 'react';
import PropTypes from 'prop-types';
import Model from '../model/model';
import Deck from '../deck/deck';
import Sidebar from '../sidebar/sidebar';
import Threatbar from '../threatbar/threatbar';
import ImageModel from '../imagemodel/imagemodel';
import Timer from '../timer/timer';
import './board.css';
import request from 'superagent';
import Status from '../status/status';
import { getDealtCard } from '../../../utils/utils';
import { ModelType, SPECTATOR } from '../../../utils/constants';
import LicenseAttribution from '../license/licenseAttribution';
import { API_PORT } from '../../../utils/serverConfig';
import PrivacyEnhancedModel from '../privacyEnhancedModel/privacyEnhancedModel';
import Imprint from '../footer/imprint';
import Privacy from '../footer/privacy';

class Board extends React.Component {
  static get propTypes() {
    return {
      G: PropTypes.any.isRequired,
      ctx: PropTypes.any.isRequired,
      matchID: PropTypes.any.isRequired,
      moves: PropTypes.any,
      events: PropTypes.any,
      playerID: PropTypes.any,
      credentials: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    let names = [];
    for (let i = 0; i < this.props.ctx.numPlayers; i++) {
      names.push('No Name');
    }
    this.state = {
      names,
      model: null,
    };
    this.apiBase =
      process.env.NODE_ENV === 'production'
        ? '/api'
        : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  updateName(index, name) {
    this.setState({
      ...this.state,
      names: {
        ...this.state.names,
        [index]: name,
      },
    });
  }

  async apiGetRequest(endpoint) {
    // Using superagent makes auth easier but for consistency using fetch may be better
    try {
      return await request
        .get(`${this.apiBase}/game/${this.props.matchID}/${endpoint}`)
        .auth(this.props.playerID ?? SPECTATOR, this.props.credentials);
    } catch (err) {
      console.error(err);
    }
  }

  async updateNames() {
    const g = await this.apiGetRequest('players');
    g?.body.players.forEach((p) => {
      if (typeof p.name !== 'undefined') {
        this.updateName(p.id, p.name);
      }
    });
  }

  async updateModel() {
    const r = await this.apiGetRequest('model');

    const model = r?.body;

    this.setState({
      ...this.state,
      model,
    });
  }

  componentDidMount() {
    this.updateNames();
    if (this.props.G.modelType !== ModelType.IMAGE) {
      this.updateModel();
    }
  }

  render() {
    const current = this.props.playerID === this.props.ctx.currentPlayer;
    const isInThreatStage =
      this.props.ctx.activePlayers &&
      this.props.ctx.activePlayers[this.props.playerID] === 'threats'
        ? true
        : false;
    
    const isSpectator = !this.props.playerID;
    const isFirstPlayerInThreatStage = this.props.ctx.activePlayers?.[0] === 'threats';
    
    const shouldShowTimer = isInThreatStage || (isSpectator && isFirstPlayerInThreatStage);
    const active = current || isInThreatStage;

    let dealtCard = getDealtCard(this.props.G);

    return (
      <div>
        {this.props.G.modelType === ModelType.IMAGE && (
          <ImageModel
            playerID={this.props.playerID ?? SPECTATOR}
            credentials={this.props.credentials}
            matchID={this.props.matchID}
          />
        )}
        {this.props.G.modelType === ModelType.THREAT_DRAGON && (
          <Model
            model={this.state.model}
            selectedDiagram={this.props.G.selectedDiagram}
            selectedComponent={this.props.G.selectedComponent}
            onSelectDiagram={this.props.moves.selectDiagram}
            onSelectComponent={this.props.moves.selectComponent}
          />
        )}
        {this.props.G.modelType === ModelType.PRIVACY_ENHANCED && (
          <PrivacyEnhancedModel modelReference={this.props.G.modelReference} />
        )}
        <div className="player-wrap">
          <div className="playingCardsContainer">
            <div className="status-bar">
              <Status
                G={this.props.G}
                ctx={this.props.ctx}
                gameMode={this.props.G.gameMode}
                playerID={this.props.playerID}
                names={this.state.names}
                current={current}
                active={active}
                dealtCard={dealtCard}
                isInThreatStage={isInThreatStage}
              />
            </div>
            {this.props.playerID && (
              <Deck
                cards={this.props.G.players[this.props.playerID]}
                suit={this.props.G.suit}
                /* phase replaced with isInThreatStage. active players is null when not */
                isInThreatStage={isInThreatStage}
                round={this.props.G.round}
                current={current}
                active={active}
                onCardSelect={(e) => this.props.moves.draw(e)}
                startingCard={this.props.G.startingCard} // <===  This is still missing   i.e. undeifned
                gameMode={this.props.G.gameMode}
              />
            )}
          </div>
          <div className='board-footer'>
            <Imprint />
            <Privacy />
          </div>
          <LicenseAttribution gameMode={this.props.G.gameMode} />
        </div>
        <Sidebar
          G={this.props.G}
          ctx={this.props.ctx}
          playerID={this.props.playerID ?? SPECTATOR}
          matchID={this.props.matchID}
          moves={this.props.moves}
          isInThreatStage={isInThreatStage}
          current={current}
          active={active}
          names={this.state.names}
          secret={this.props.credentials}
        />
        <Timer
          active={shouldShowTimer}
          targetTime={this.props.G.turnFinishTargetTime}
          duration={parseInt(this.props.G.turnDuration)}
          key={isInThreatStage}
        />
        <Threatbar
          G={this.props.G}
          ctx={this.props.ctx}
          playerID={this.props.playerID}
          model={this.state.model}
          names={this.state.names}
          moves={this.props.moves}
          active={active}
          isInThreatStage={isInThreatStage}
        />
      </div>
    );
  }
}

export default Board;
