import { rename } from 'fs/promises';
import send from 'koa-send';
import request from 'superagent';
import { v4 as uuidv4 } from 'uuid';
import { ElevationOfPrivilege } from '../game/eop';
import { getSuitDisplayName } from '../utils/cardDefinitions';
import { DEFAULT_MODEL, ModelType } from '../utils/constants';
import { GameMode } from '../utils/GameMode';
import { INTERNAL_API_PORT } from '../utils/serverConfig';
import {
  escapeMarkdownText,
  getImageExtension,
  logEvent,
} from '../utils/utils';

export const createGame = (gameServer) => async (ctx) => {
  const spectatorCredential = uuidv4();

  try {
    // Create game
    const r = await request
      .post(
        `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/create`,
      )
      .send({
        numPlayers: ctx.request.body.players,
        setupData: {
          startSuit: ctx.request.body.startSuit,
          turnDuration: ctx.request.body.turnDuration,
          gameMode: ctx.request.body.gameMode,
          modelType: ctx.request.body.modelType,
          spectatorCredential,
        },
      });

    const gameId = r.body.matchID;
    const credentials = [];

    for (let i = 0; i < ctx.request.body.players; i++) {
      const j = await request
        .post(
          `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/${gameId}/join`,
        )
        .send({
          playerID: i,
          playerName: ctx.request.body['names[]'][i],
        });
      credentials.push(j.body.playerCredentials);
    }

    //model stuff
    switch (ctx.request.body.modelType) {
      case ModelType.THREAT_DRAGON: {
        await gameServer.db.setModel(
          gameId,
          JSON.parse(ctx.request.body.model),
        );
        break;
      }

      case ModelType.DEFAULT: {
        await gameServer.db.setModel(gameId, DEFAULT_MODEL);
        break;
      }

      case ModelType.IMAGE: {
        const extension = getImageExtension(ctx.request.files.model.name);
        if (
          !(/image\/[a-z+]+$/i.test(ctx.request.files.model.type) && extension)
        ) {
          throw Error('Filetype not supported');
        }

        await rename(
          ctx.request.files.model.path,
          `./db-images/${gameId}.${extension}`,
        );
        //use model object to store info about image
        await gameServer.db.setModel(gameId, { extension });

        break;
      }

      default: {
        await gameServer.db.setModel(gameId, null);
        break;
      }
    }

    logEvent(`Game created: ${gameId}`);
    ctx.body = {
      game: gameId,
      credentials,
      spectatorCredential,
    };
  } catch (err) {
    // Maybe this error could be more specific?
    console.error(err, err.stack);
    ctx.throw(500);
  }
};

export const getPlayerNames = () => async (ctx) => {
  const matchID = ctx.params.matchID;

  const r = await request.get(
    `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/${matchID}`,
  );
  ctx.body = r.body;
};

export const getModel = (gameServer) => async (ctx) => {
  const matchID = ctx.params.matchID;
  const game = await gameServer.db.fetch(matchID, { model: true });

  ctx.body = game.model;
};

export const getImage = (gameServer) => async (ctx) => {
  const matchID = ctx.params.matchID;
  const game = await gameServer.db.fetch(matchID, { model: true });

  //send image
  await send(ctx, `${matchID}.${game.model.extension}`, {
    root: './db-images',
  });
};

const getMethodologyName = (gameMode) => {
  if (gameMode === GameMode.EOP) {
    return 'STRIDE';
  }
  if (gameMode === GameMode.CORNUCOPIA) {
    return 'Cornucopia';
  }

  if (gameMode === GameMode.CUMULUS) {
    return 'Cumulus';
  }

  return undefined;
};

export const downloadThreatDragonModel = (gameServer) => async (ctx) => {
  const matchID = ctx.params.matchID;
  const game = await gameServer.db.fetch(matchID, {
    state: true,
    metadata: true,
    model: true,
  });
  const isJsonModel =
    game.state.G.modelType == ModelType.DEFAULT ||
    game.state.G.modelType == ModelType.THREAT_DRAGON;

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
            game.state.G.identifiedThreats[diagramIdx][componentIdx],
          ).forEach((threatIdx) => {
            let t =
              game.state.G.identifiedThreats[diagramIdx][componentIdx][
                threatIdx
              ];
            threats.push({
              status: 'Open',
              severity: t.severity,
              id: t.id,
              methodology: getMethodologyName(game.state.G.gameMode),
              type: getSuitDisplayName(game.state.G.gameMode, t.type),
              title: t.title,
              description: t.description,
              mitigation: t.mitigation,
              owner: game.metadata.players[t.owner].name,
              game: matchID,
            });
          });
          cell.threats = threats;
        }
      },
    );
  });

  const modelTitle = game.model.summary.title.replace(' ', '-');
  const timestamp = new Date().toISOString().replace(':', '-');
  const filename = `${modelTitle}-${timestamp}.json`;

  logEvent(`Download model: ${matchID}`);
  ctx.attachment(filename);
  ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
  ctx.body = game.model;
};

export const downloadThreatsMarkdownFile = (gameServer) => async (ctx) => {
  //get some variables that might be useful
  const matchID = ctx.params.matchID;
  const game = await gameServer.db.fetch(matchID, {
    state: true,
    metadata: true,
    model: true,
  });

  const isJsonModel =
    game.state.G.modelType == ModelType.DEFAULT ||
    game.state.G.modelType == ModelType.THREAT_DRAGON;
  const threats = getThreats(
    game.state,
    game.metadata,
    isJsonModel ? game.model : undefined,
  );

  const modelTitle =
    isJsonModel && game.model
      ? game.model
        ? game.model.summary.title.trim().replaceAll(' ', '-')
        : ``
      : game.state.G.gameMode
      ? game.state.G.gameMode.trim().replaceAll(' ', '')
      : ``;
  const timestamp = new Date().toISOString().replaceAll(':', '-');
  const date = new Date().toLocaleString();
  const filename = `threats-${modelTitle}-${timestamp}.md`;

  logEvent(`Download threats: ${matchID}`);
  ctx.attachment(filename);
  ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
  ctx.body = formatThreats(threats, date);
};

function getThreats(gameState, metadata, model) {
  var threats = [];

  //add threats from G.identifiedThreats
  Object.keys(gameState.G.identifiedThreats).forEach((diagramId) => {
    Object.keys(gameState.G.identifiedThreats[diagramId]).forEach(
      (componentId) => {
        Object.keys(
          gameState.G.identifiedThreats[diagramId][componentId],
        ).forEach((threatId) => {
          const threat =
            gameState.G.identifiedThreats[diagramId][componentId][threatId];
          threats.push({
            ...threat,
            owner: metadata.players[threat.owner].name,
          });
        });
      },
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

${threats.map(formatSingleThreat).join('\n')}
`;
}

function formatSingleThreat(threat, index) {
  const lines = [
    `${index + 1}. **${escapeMarkdownText(threat.title.trim())}**`,
  ];

  if ('severity' in threat) {
    lines.push(`    - *Severity:* ${escapeMarkdownText(threat.severity)}`);
  }

  if ('owner' in threat) {
    lines.push(`    - *Author:* ${escapeMarkdownText(threat.owner)}`);
  }

  if ('description' in threat) {
    lines.push(
      `    - *Description:* ${escapeMarkdownText(
        threat.description.replace(/(\r|\n)+/gm, ' '),
      )}`,
    );
  }

  if (
    'mitigation' in threat &&
    threat.mitigation !== `No mitigation provided.`
  ) {
    lines.push(
      `    - *Mitigation:* ${escapeMarkdownText(
        threat.mitigation.replace(/(\r|\n)+/gm, ' '),
      )}`,
    );
  }

  return lines.join('\n');
}
