import React from 'react';
import PropTypes from 'prop-types';

import { Client } from 'boardgame.io/react';
import Board from '../components/board/board';
import { ElevationOfPrivilege } from '../../game/eop';
import { SERVER_PORT } from '../../utils/constants';
import { SocketIO } from 'boardgame.io/multiplayer';
import '../styles/cornucopia_cards.css';
import '../styles/cards.css';
import 'cornucopia-cards-modified/style.css';

const url =
  window.location.protocol +
  '//' +
  window.location.hostname +
  (window.location.port ? ':' + window.location.port : '');

const EOP = Client({
  game: ElevationOfPrivilege,
  board: Board,
  debug: false,
  multiplayer: SocketIO({
    server:
      process.env.NODE_ENV === 'production'
        ? `${url}`
        : `${window.location.hostname}:${SERVER_PORT}`,
  }),
});

class App extends React.Component {
  static get propTypes() {
    return {
      match: PropTypes.object,
    };
  }

  constructor(props) {
    super(props);
    const { params } = props.match;
    this.state = {
      game: params.game,
      id: params.id,
      secret: params.secret,
    };
  }

  render() {
    return (
      <div className="player-container">
        <EOP
          matchID={this.state.game}
          credentials={this.state.secret}
          playerID={this.state.id + ''}
        />
        <div className="cornucopiacard"></div>
      </div>
    );
  }
}

export default App;
