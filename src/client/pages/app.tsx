import '../styles/cornucopia_cards.css';
import '../styles/cards.css';
import 'cornucopia-cards-modified/style.css';

import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import React from 'react';

import { ElevationOfPrivilege } from '../../game/eop';
import { SERVER_PORT, SPECTATOR } from '../../utils/constants';
import Board from '../components/board/board';

import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';

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

interface MatchParams {
  game: string;
  id: string;
  secret: string;
}

type AppProps = RouteComponentProps<MatchParams>;

const App: FC<AppProps> = ({ match }) => {
  const { game, id, secret } = match.params;

  const playerId = id.toString();

  return (
    <div className="player-container">
      <EOP
        matchID={game}
        credentials={secret}
        playerID={playerId === SPECTATOR ? undefined : playerId}
      />
      <div className="cornucopiacard"></div>
    </div>
  );
};

export default App;
