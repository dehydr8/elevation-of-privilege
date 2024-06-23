import { ElevationOfPrivilege, SPECTATOR, SERVER_PORT } from '@eop/shared';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import React from 'react';

import '@eop/cornucopia-cards/style.css';

import Board from '../components/board/board';

import '../styles/cards.css';
import '../styles/eop_cards.css';
import '../styles/cornucopia_cards.css';
import '../styles/cumulus_cards.css';
import '../styles/eomlsec_cards.css';

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
    </div>
  );
};

export default App;
