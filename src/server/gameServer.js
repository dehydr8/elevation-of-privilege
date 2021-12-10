import { Server } from 'boardgame.io/server';
import { v4 as uuidv4 } from 'uuid';
import { ElevationOfPrivilege } from '../game/eop';
import { INTERNAL_API_PORT, SERVER_PORT } from '../utils/constants';
import { getDatabase } from './config';

const server = Server({
  games: [ElevationOfPrivilege],
  db: getDatabase(),
  origins: [
    '*', //maybe make this more selective
  ],
  uuid: uuidv4,
});

const runGameServer = () => {
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
