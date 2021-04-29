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
    gameID: PropTypes.any.isRequired,
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
    const g = await request
      .get(`${this.apiBase}/players/${this.props.gameID}`);

    g.body.players.forEach(p => {
      if (typeof p.name !== 'undefined') {
        this.updateName(p.id, p.name);
      }
    });
  }

  async updateModel() {
    const r = await request
      .get(`${this.apiBase}/model/${this.props.gameID}`);

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
    let active = false;
    let current = false;

    if (this.props.ctx.actionPlayers.includes(parseInt(this.props.playerID)) || this.props.ctx.actionPlayers.includes(this.props.playerID)) {
      active = true;
    }

    if (this.props.playerID === this.props.ctx.currentPlayer) {
      current = true;
    }

    let dealtCard = getDealtCard(this.props.G);

    return (
      <div>
        <Model model={this.state.model} selectedDiagram={this.props.G.selectedDiagram} selectedComponent={this.props.G.selectedComponent} onSelectDiagram={this.props.moves.selectDiagram} onSelectComponent={this.props.moves.selectComponent} />
        <div className="player-wrap">
          <div className="playingCardsContainer">
            <div className="status-bar">
              <Status playerID={this.props.playerID} G={this.props.G} ctx={this.props.ctx} names={this.state.names} current={current} active={active} dealtCard={dealtCard}  />
            </div>
            <Deck cards={this.props.G.players[this.props.playerID]} suit={this.props.G.suit} phase={this.props.ctx.phase} round={this.props.G.round} current={current} active={active} onCardSelect={(e) => this.props.moves.draw(e)} />
          </div>
        </div>
        <Sidebar playerID={this.props.playerID} gameID={this.props.gameID} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} phase={this.props.ctx.phase} current={current} active={active} names={this.state.names} />
        <Threatbar playerID={this.props.playerID} model={this.state.model} names={this.state.names} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} active={active} />
      </div>
    );
  }
}

export default Board;