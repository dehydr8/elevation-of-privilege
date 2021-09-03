import cors from '@koa/cors';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import send from 'koa-send';
import auth from 'basic-auth';
import request from 'superagent';
import { ElevationOfPrivilege } from '../game/eop';
import { API_PORT, DEFAULT_MODEL, INTERNAL_API_PORT, MODEL_TYPE_DEFAULT, MODEL_TYPE_IMAGE, MODEL_TYPE_THREAT_DRAGON } from '../utils/constants';
import { getTypeString, escapeMarkdownText, isGameModeCornucopia, getImageExtension } from '../utils/utils';
import { rename, unlink } from 'fs/promises';

const runPublicApi = (gameServer) => {
  const app = new Koa();
  
  const router = new Router({
    prefix: '/game'
  });


  // TODO: set limit to file size using koa-body
  router.post('/create', koaBody({multipart: true, formidable: {uploadDir: './db/images'}}), async (ctx, next) => {
    try{
      // Create game
      const r = await request
        .post(
          `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/create`
        )
        .send({
          numPlayers: ctx.request.body.players,
          setupData: {
            startSuit: ctx.request.body.startSuit,
            turnDuration: ctx.request.body.turnDuration,
            gameMode: ctx.request.body.gameMode,
            modelType: ctx.request.body.modelType,
          }
        });

      const gameId = r.body.matchID;
      const credentials = [];

      for (var i = 0; i < ctx.request.body.players; i++) {
        const j = await request
          .post(
            `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/${gameId}/join`
          )
          .send({
            playerID: i,
            playerName: ctx.request.body['names[]'][i],
          });
        credentials.push(j.body.playerCredentials);
      }

      //model stuff
      switch (ctx.request.body.modelType) {
        case MODEL_TYPE_THREAT_DRAGON:
          await gameServer.db.setModel(gameId, JSON.parse(ctx.request.body.model));
          break;
        
        case MODEL_TYPE_DEFAULT:
          await gameServer.db.setModel(gameId, DEFAULT_MODEL);
          break;
        
        case MODEL_TYPE_IMAGE:
          const extension = getImageExtension(ctx.request.files.model.name);
          if (!(/image\/[a-z]+$/i.test(ctx.request.files.model.type) && extension)) {
            throw Error("Filetype not supported");
          }
            
          await rename(ctx.request.files.model.path, `./db/images/${gameId}.${extension}`);
          //use model object to store info about image
          await gameServer.db.setModel(gameId, {extension});
          
          break;
          
        default:
          await gameServer.db.setModel(gameId, null);
          break;
      }

      ctx.body = {
        game: gameId,
        credentials,
      };
    } catch (err) {
      // Maybe this error could be more specific?
      console.error(err, err.stack);
      ctx.throw(500);
    }
  });

  //authorise
  router.use('/:matchID/', async (ctx, next) => {
    const credentials = auth(ctx);
    const game = await gameServer.db.fetch(ctx.params.matchID, { metadata: true });
    const metadata = game.metadata;
    if(credentials && credentials.name &&
      metadata && metadata.players && 
      credentials.pass === metadata.players[credentials.name].credentials
    ) {
      return await next();
    } else {
      ctx.throw(403);
    }
  });

  router.get('/:matchID/players', async ctx => {
    const matchID = ctx.params.matchID;

    const r = await request.get(
      `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/${matchID}`
    );
    ctx.body = r.body;
  });


  router.get('/:matchID/model', async (ctx) => {
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, { model: true });

    ctx.body = game.model;
  });

  router.get('/:matchID/image', async (ctx) => {
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, { model: true });

    //send image
    await send(ctx, `${matchID}.${game.model.extension}`, {root: './db/images'});
  });

  router.get('/:matchID/download', async (ctx) => {
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, { state: true, metadata: true, model: true });
    const isJsonModel = game.state.G.modelType == MODEL_TYPE_DEFAULT || game.state.G.modelType == MODEL_TYPE_THREAT_DRAGON;

    if (!isJsonModel) {
      // if in wrong modelType
      ctx.throw(409);
    } 
      
    // update the model with the identified threats
    Object.keys(game.state.G.identifiedThreats).forEach((diagramIdx) => {
      Object.keys(game.state.G.identifiedThreats[diagramIdx]).forEach(
        (componentIdx) => {
          let diagram = game.model.detail.diagrams[diagramIdx].diagramJson;
          let cell = null;
          for (let i = 0; i < diagram.cells.length; i++) {
            let c = diagram.cells[i];
            if (c.id === componentIdx) {
              cell = c;
              break;
            }
          }
          if (cell !== null) {
            let threats = [];
            if (Array.isArray(cell.threats)) {
              threats = cell.threats;
            }
            Object.keys(
              game.state.G.identifiedThreats[diagramIdx][componentIdx]
            ).forEach((threatIdx) => {
              let t =
                game.state.G.identifiedThreats[diagramIdx][componentIdx][threatIdx];
              threats.push({
                status: 'Open',
                severity: t.severity,
                id: t.id,
                methodology: (isGameModeCornucopia(game.state.G.gameMode)) ? 'Cornucopia' : 'STRIDE',
                type: getTypeString(t.type, game.state.G.gameMode),
                title: t.title,
                description: t.description,
                mitigation: t.mitigation,
                owner: game.metadata.players[t.owner].name,
                game: matchID,
              });
            });
            cell.threats = threats;
          }
        }
      );
    });

    const modelTitle = game.model.summary.title.replace(' ', '-');
    const timestamp = (new Date()).toISOString().replace(':', '-');
    const filename = `${modelTitle}-${timestamp}.json`;
    ctx.attachment(filename);
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
    ctx.body = game.model;
  });

  //produce a nice textfile with the threats in
  router.get('/:matchID/download/text', async (ctx) => {
    //get some variables that might be useful
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, {
      state: true,
      metadata: true,
      model: true,
    });

    const isJsonModel = game.state.G.modelType == MODEL_TYPE_DEFAULT || game.state.G.modelType == MODEL_TYPE_THREAT_DRAGON;
    const threats = getThreats(game.state, game.metadata, (isJsonModel) ? game.model : undefined);

    const modelTitle = (isJsonModel && game.model)
      ? game.model.summary.title.trim().replaceAll(' ', '-')
      : game.state.G.gameMode.trim().replaceAll(' ', '');
    const timestamp = new Date().toISOString().replaceAll(':', '-');
    const date = new Date().toLocaleString();
    const filename = `threats-${modelTitle}-${timestamp}.md`
    ctx.attachment(filename);
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');

    ctx.body = formatThreats(threats, date);
  });

  

  app.use(cors());
  app.use(router.routes()).use(router.allowedMethods());
  const appHandle = app.listen(API_PORT, () => {
    console.log(`Public API serving at: http://localhost:${API_PORT}/`);
  });

  return [app, appHandle];
};

function getThreats(gameState, metadata, model) {
  var threats = [];

  //add threats from G.identifiedThreats
  Object.keys(gameState.G.identifiedThreats).forEach((diagramId) => {
    Object.keys(gameState.G.identifiedThreats[diagramId]).forEach(
      (componentId) => {
        Object.keys(
          gameState.G.identifiedThreats[diagramId][componentId]
        ).forEach((threatId) => {
          const threat =
            gameState.G.identifiedThreats[diagramId][componentId][threatId];
          threats.push({
            ...threat,
            owner: metadata.players[threat.owner].name,
          });
        });
      }
    );
  });

  //add threats from model
  if (model) {
    model.detail.diagrams.forEach((diagram) => {
      diagram.diagramJson.cells.forEach((cell) => {
        if ('threats' in cell) {
          threats.push(...cell.threats);
        }
      });
    });
  }

  return threats;
}

function formatThreats(threats, date) {
  return `Threats ${date}
=======
${threats
  .map(
    (threat, index) => `
**${index + 1}. ${escapeMarkdownText(threat.title.trim())}**
${
  'owner' in threat
    ? `
  - *Author:*       ${escapeMarkdownText(threat.owner)}
`
    : ''
}
  - *Description:*  ${
    escapeMarkdownText(
      threat.description.replace(/(\r|\n)+/gm, ' ')
    ) /* Stops newlines breaking md formatting */
  }

${
  threat.mitigation !== `No mitigation provided.`
    ? `  - *Mitigation:*   ${escapeMarkdownText(
        threat.mitigation.replace(/(\r|\n)+/gm, ' ')
      )}

`
    : ''
}`
  )
  .join('')}`;
}

export default runPublicApi;
