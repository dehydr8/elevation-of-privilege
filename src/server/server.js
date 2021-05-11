import runGameServer from './gameServer';
import runPublicApi from './publicApi';

const [ gameServer, gameServerHandle ] = runGameServer();
const [ publicApiServer, publicApiServerHandle ] = runPublicApi(gameServer);

export {
  gameServer,
  gameServerHandle,
  publicApiServer,
  publicApiServerHandle
};
