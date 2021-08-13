import cors from '@koa/cors';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import request from 'superagent';
import { ElevationOfPrivilege } from '../game/eop';
import { API_PORT, INTERNAL_API_PORT } from '../utils/constants';
import { getTypeString, escapeMarkdownText, isGameModeCornucopia } from '../utils/utils';

const runPublicApi = (gameServer) => {
  const app = new Koa();
  const router = new Router();
  router.get('/players/:game/:id', async ctx => {
    const matchID = ctx.params.game;
    const game = await gameServer.db.fetch(matchID, { metadata: true });
    const secret = ctx.get('Authorization');

    if (!isSecretValid(ctx.params.id, secret, game.metadata)) {
        ctx.status = 403;
        return;
    }

    const r = await request.get(
      `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/${matchID}`
    );
    ctx.body = r.body;
  });

  router.post('/create', koaBody(), async (ctx) => {
    const r = await request
      .post(
        `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/create`
      )
      .send({
        numPlayers: ctx.request.body.players,
        setupData: {
          startSuit: ctx.request.body.startSuit,
          gameMode: ctx.request.body.gameMode
        },
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
          playerName: ctx.request.body.names[i],
        });

      credentials.push(j.body.playerCredentials);
    }

    if (typeof ctx.request.body.model !== 'undefined') {
      // save the model in the db, not in the setupData
      await gameServer.db.setModel(gameId, ctx.request.body.model);
    }

    ctx.body = {
      game: gameId,
      credentials,
    };
  });

  router.get('/model/:game/:id', async (ctx) => {
    const matchID = ctx.params.game;
    const game = await gameServer.db.fetch(matchID, { model: true, metadata: true });
    const secret = ctx.get('Authorization');

    // validate secret
    if (!isSecretValid(ctx.params.id, secret, game.metadata)) {
        ctx.status = 403;
        return;
    }

    ctx.body = game.model;
  });

  router.get('/download/:game/:id', async (ctx) => {
    const matchID = ctx.params.game;
    const game = await gameServer.db.fetch(matchID, { state: true, metadata: true, model: true });
    const secret = ctx.get('Authorization');

    // validate secret
    if (!isSecretValid(ctx.params.id, secret, game.metadata)) {
        ctx.status = 403;
        return;
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
                methodology: (isGameModeCornucopia(game.state.G.gameMode)) ? 'Data, Crypt, Sessn, AuthZ, AuthN, Cornu' : 'STRIDE',
                type: getTypeString(t.type),
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
  router.get('/download/text/:game/:id', async (ctx) => {
    //get some variables that might be useful
    const matchID = ctx.params.game;
    const game = await gameServer.db.fetch(matchID, {
      state: true,
      metadata: true,
      model: true,
    });
    
    const secret = ctx.get('Authorization');

    // validate secret
    if (!isSecretValid(ctx.params.id, secret, game.metadata)) {
        ctx.status = 403;
        return;
    }

    const threats = getThreats(game.state, game.metadata, game.model);

    const modelTitle = game.model
      ? game.model.summary.title.trim().replace(' ', '-')
      : 'untitled-model';
    const timestamp = new Date().toISOString().replace(':', '-');
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

function isSecretValid(id, secret, metadata) {
  return metadata && metadata.players && metadata.players[id].credentials === secret;
}

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