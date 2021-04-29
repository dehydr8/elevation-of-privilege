import { Server } from 'boardgame.io/server';
import uuidv4 from 'uuid/v4';
import { ElevationOfPrivilege } from '../game/eop';
import { INTERNAL_API_PORT, SERVER_PORT } from '../utils/constants';
import { getDatabase } from './config';


const server = Server({
    games: [ElevationOfPrivilege],
    db: getDatabase(),
});

const runGameServer = () => {
    const serverHandle = server.run({
        port: SERVER_PORT,
        callback: () => {
            console.log(`Game server API (websocket) serving at: http://localhost:${SERVER_PORT}/`);
        },
        lobbyConfig: {
            apiPort: INTERNAL_API_PORT,
            uuid: uuidv4,
            apiCallback: () => {
            console.log(`Internal API serving at: http://localhost:${INTERNAL_API_PORT}/`);
            },
        }
    });

    return [server, serverHandle];
}

export default runGameServer;
