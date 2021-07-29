import React from 'react';
import PropTypes from 'prop-types';
import Model from '../model/model';
import Deck from '../deck/deck';
import Sidebar from '../sidebar/sidebar';
import Threatbar from '../threatbar/threatbar';
import './board.css';
import request from 'superagent';
import Status from '../status/status';
import { getDealtCard } from '../../../utils/utils';
import { API_PORT } from '../../../utils/constants';

class Board extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    matchID: PropTypes.any.isRequired,
    moves: PropTypes.any,
    events: PropTypes.any,
    playerID: PropTypes.any,
  };

  constructor(props) {
    super(props);
    let names = [];
    for (let i=0; i<this.props.ctx.numPlayers; i++) {
      names.push("No Name");
    }
    this.state = {
      names,
      model: null,
    };
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  updateName(index, name) {
    this.setState({
      ...this.state,
      names: {
        ...this.state.names,
        [index]: name,
      }
    })
  }

  async updateNames() {
    const g = await request.get(`${this.apiBase}/players/${this.props.matchID}`)
    
    g.body.players.forEach(p => {
      if (typeof p.name !== 'undefined') {
        this.updateName(p.id, p.name);
      }
    });
  }

  async updateModel() {
    const r = await request
      .get(`${this.apiBase}/model/${this.props.matchID}`);

    const model = r.body;

    this.setState({
      ...this.state,
      model,
    })
  }

  componentDidMount() {
    this.updateNames();
    this.updateModel();
  }

  render() {
    const current = this.props.playerID === this.props.ctx.currentPlayer
    const isInThreatStage = this.props.ctx.activePlayers && this.props.ctx.activePlayers[this.props.playerID] === 'threats';
    const active = current || isInThreatStage;

    let dealtCard = getDealtCard(this.props.G);

    return (
      <div>
        <Model model={this.state.model} selectedDiagram={this.props.G.selectedDiagram} selectedComponent={this.props.G.selectedComponent} onSelectDiagram={this.props.moves.selectDiagram} onSelectComponent={this.props.moves.selectComponent} />
        <div className="player-wrap">
          <div className="playingCardsContainer">
            <div className="status-bar">
              <Status playerID={this.props.playerID} G={this.props.G} ctx={this.props.ctx} names={this.state.names} current={current} active={active} dealtCard={dealtCard} isInThreatStage={isInThreatStage} />
            </div>
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
            />
          </div>
        </div>
        <Sidebar playerID={this.props.playerID} matchID={this.props.matchID} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} isInThreatStage={isInThreatStage} current={current} active={active} names={this.state.names} />
        <Threatbar playerID={this.props.playerID} model={this.state.model} names={this.state.names} G={this.props.G} ctx={this.props.ctx} isInThreatStage={isInThreatStage} moves={this.props.moves} active={active} />
      </div>
    );
  }
}

export default Board;