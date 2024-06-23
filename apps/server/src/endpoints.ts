import { rename } from 'node:fs/promises';
import send from 'koa-send';
import request from 'superagent';
import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_MODEL,
  ElevationOfPrivilege,
  escapeMarkdownText,
  GameMode,
  GameState,
  getImageExtension,
  getSuitDisplayName,
  INTERNAL_API_PORT,
  isSuit,
  logEvent,
  ModelType,
  ThreatDragonModel,
  ThreatDragonThreat,
} from '@eop/shared';
import { getDbImagesFolder } from './filesystem';
import type { GameServer } from './gameServer';
import type { IMiddleware } from 'koa-router';
import type { Server, State } from 'boardgame.io';

export const createGame =
  (gameServer: GameServer): IMiddleware =>
  async (ctx) => {
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
            modelReference: ctx.request.body.modelReference,
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

        case ModelType.PRIVACY_ENHANCED: {
          await gameServer.db.setModel(gameId, DEFAULT_MODEL);
          break;
        }

        case ModelType.IMAGE: {
          if (
            !ctx.request.files ||
            !ctx.request.files.model ||
            Array.isArray(ctx.request.files.model)
          ) {
            throw Error('A single image needs to be provided');
          }

          if (!ctx.request.files.model.name) {
            throw Error('No name specified for the provided image');
          }

          if (!ctx.request.files.model.type) {
            throw Error('No mime type specified for the provided image');
          }

          const extension = getImageExtension(ctx.request.files.model.name);
          if (
            !(
              /image\/[a-z+]+$/i.test(ctx.request.files.model.type) && extension
            )
          ) {
            throw Error('Filetype not supported');
          }

          await rename(
            ctx.request.files.model.path,
            `${getDbImagesFolder()}/${gameId}.${extension}`,
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
      const logArguments = err instanceof Error ? [err, err.stack] : [err];
      console.error(...logArguments);
      ctx.throw(500);
    }
  };

// TODO: This returns more than just the players: It returns the requested match. We should probably adjust the name (and the path). See https://boardgame.io/documentation/#/api/Lobby?id=getting-a-specific-match-by-its-id
export const getPlayerNames = (): IMiddleware => async (ctx) => {
  const matchID = ctx.params.matchID;

  const r = await request.get(
    `http://localhost:${INTERNAL_API_PORT}/games/${ElevationOfPrivilege.name}/${matchID}`,
  );
  ctx.body = r.body;
};

export const getModel =
  (gameServer: GameServer): IMiddleware =>
  async (ctx) => {
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, { model: true });

    ctx.body = game.model;
  };

export const getImage =
  (gameServer: GameServer): IMiddleware =>
  async (ctx) => {
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, { model: true });

    if (!game.model || !('extension' in game.model)) {
      return ctx.throw(
        'Cannot request image if none is stored, maybe the wrong model type has been set?',
        400,
      );
    }

    //send image
    await send(ctx, `${matchID}.${game.model?.extension}`, {
      root: getDbImagesFolder(),
    });
  };

const getMethodologyName = (gameMode: GameMode) => {
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

export const downloadThreatDragonModel =
  (gameServer: GameServer): IMiddleware =>
  async (ctx) => {
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, {
      state: true,
      metadata: true,
      model: true,
    });

    const state: State<GameState> = game.state;

    const isJsonModel =
      state.G.modelType == ModelType.PRIVACY_ENHANCED ||
      state.G.modelType == ModelType.THREAT_DRAGON;

    const model = game.model;
    if (!model || 'extension' in model || !isJsonModel) {
      // if in wrong modelType
      return ctx.throw(
        'Cannot download model if none is set, maybe the wrong model type has been set?',
        400,
      );
    }

    // update the model with the identified threats
    state.G.identifiedThreats.forEach((threatsForComponent, diagramIdx) => {
      if (threatsForComponent === null) {
        return;
      }
      Object.keys(threatsForComponent).forEach((componentIdx) => {
        const diagram = model.detail.diagrams[diagramIdx].diagramJson;
        const cell = diagram.cells?.find((c) => c.id === componentIdx);

        if (cell !== undefined) {
          const threats: ThreatDragonThreat[] = cell.threats ?? [];
          Object.keys(threatsForComponent[componentIdx]).forEach(
            (threatIdx) => {
              const t = threatsForComponent[componentIdx][threatIdx];
              threats.push({
                description: t.description ?? '',
                mitigation: t.mitigation ?? '',
                modelType: getMethodologyName(state.G.gameMode),
                severity: t.severity ?? '',
                status: 'Open',
                title: t.title ?? '',
                type: getSuitDisplayName(state.G.gameMode, t.type),

                owner:
                  t.owner !== undefined
                    ? game.metadata.players[Number.parseInt(t.owner)]?.name
                    : undefined,
                id: t.id,
                game: matchID,
              });
            },
          );
          cell.threats = threats;
        }
      });
    });

    const modelTitle = model.summary.title.replace(' ', '-');
    const timestamp = new Date().toISOString().replace(':', '-');
    const filename = `${modelTitle}-${timestamp}.json`;

    logEvent(`Download model: ${matchID}`);
    ctx.attachment(filename);
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
    ctx.body = game.model;
  };

export const downloadThreatsMarkdownFile =
  (gameServer: GameServer): IMiddleware =>
  async (ctx) => {
    //get some variables that might be useful
    const matchID = ctx.params.matchID;
    const game = await gameServer.db.fetch(matchID, {
      state: true,
      metadata: true,
      model: true,
    });

    const isJsonModel =
      game.state.G.modelType == ModelType.PRIVACY_ENHANCED ||
      game.state.G.modelType == ModelType.THREAT_DRAGON;

    const model = game.model;
    const threats = getThreats(
      game.state,
      game.metadata,
      isJsonModel && model && !('extension' in model) ? model : null,
    );

    const modelTitle =
      isJsonModel && game.model && !('extension' in game.model)
        ? game.model
          ? game.model?.summary.title.trim().replaceAll(' ', '-')
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
    ctx.body = formatThreats(
      threats.map((threat) =>
        enrichThreatWithCategory(threat, game.state.G.gameMode),
      ),
      date,
    );
  };

type ThreatWithCategory = ThreatDragonThreat & { category?: string };

function enrichThreatWithCategory(
  threat: ThreatDragonThreat,
  gameMode: GameMode,
): ThreatWithCategory {
  if (threat.type) {
    return {
      ...threat,
      category: isSuit(threat.type)
        ? getSuitDisplayName(gameMode, threat.type)
        : threat.type,
    };
  }

  return threat;
}

function getThreats(
  gameState: State,
  metadata: Server.MatchData,
  model: ThreatDragonModel | null,
) {
  const threats: ThreatDragonThreat[] = [];

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
      diagram.diagramJson.cells?.forEach((cell) => {
        if (cell.threats !== undefined) {
          threats.push(...cell.threats);
        }
      });
    });
  }

  return threats;
}

function formatThreats(threats: ThreatWithCategory[], date: string) {
  return `Threats ${date}
=======

${threats.map(formatSingleThreat).join('\n')}
`;
}

function formatSingleThreat(threat: ThreatWithCategory, index: number) {
  const lines = [
    `${index + 1}. **${escapeMarkdownText(
      threat.title?.trim() ?? 'No title given',
    )}**`,
  ];

  if ('category' in threat && threat.category !== undefined) {
    lines.push(`    - *Category:* ${escapeMarkdownText(threat.category)}`);
  }

  if ('severity' in threat && threat.severity !== undefined) {
    lines.push(`    - *Severity:* ${escapeMarkdownText(threat.severity)}`);
  }

  if ('owner' in threat && threat.owner !== undefined) {
    lines.push(`    - *Author:* ${escapeMarkdownText(threat.owner)}`);
  }

  if ('description' in threat && threat.description !== undefined) {
    lines.push(
      `    - *Description:* ${escapeMarkdownText(
        threat.description?.replace(/(\r|\n)+/gm, ' '),
      )}`,
    );
  }

  if (
    'mitigation' in threat &&
    threat.mitigation !== undefined &&
    threat.mitigation !== `No mitigation provided.`
  ) {
    lines.push(
      `    - *Mitigation:* ${escapeMarkdownText(
        threat.mitigation?.replace(/(\r|\n)+/gm, ' '),
      )}`,
    );
  }

  return lines.join('\n');
}
