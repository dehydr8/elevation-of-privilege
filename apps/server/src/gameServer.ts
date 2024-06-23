import { Server } from 'boardgame.io/server';
import { v4 as uuidv4 } from 'uuid';

import { ElevationOfPrivilege } from '@eop/shared';
import { INTERNAL_API_PORT, SERVER_PORT } from '@eop/shared';
import { getDatabase } from './config';

import type { ModelFlatFile } from './ModelFlatFile';

export type GameServer = ReturnType<typeof Server> & { db: ModelFlatFile };

const server = Server({
  games: [ElevationOfPrivilege],
  db: getDatabase(),
  origins: [
    '*', //maybe make this more selective
  ],
  uuid: uuidv4,
}) as GameServer;

type GameServerHandle = ReturnType<GameServer['run']>;

const runGameServer = (): [
  server: GameServer,
  serverHandle: GameServerHandle,
] => {
  const serverHandle = server.run({
    port: SERVER_PORT,
    callback: () => {
      console.log(
        `Game server API (websocket) serving at: http://localhost:${SERVER_PORT}/`,
      );
    },
    lobbyConfig: {
      apiPort: INTERNAL_API_PORT,

      apiCallback: () => {
        console.log(
          `Internal API serving at: http://localhost:${INTERNAL_API_PORT}/`,
        );
      },
    },
  });

  return [server, serverHandle];
};

export default runGameServer;
