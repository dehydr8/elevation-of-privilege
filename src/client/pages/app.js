import React from 'react';
import { Client } from 'boardgame.io/react';
import Board from '../components/board/board';
import { ElevationOfPrivilege } from '../../game/eop';
import { SERVER_PORT } from '../../utils/constants';

const url = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');

const EOP = Client({
  game: ElevationOfPrivilege,
  board: Board,
  debug: false,
  multiplayer: {
    server: (process.env.NODE_ENV === 'production') ? `${url}` : `${window.location.hostname}:${SERVER_PORT}`
  },
});

class App extends React.Component {
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
        <EOP gameID={this.state.game} credentials={this.state.secret} playerID={this.state.id + ''} />
      </div>
    );
  }
}

export default App;