export enum GameMode {
  EOP = 'Elevation of Privilege',
  CORNUCOPIA = 'OWASP Cornucopia',
}

export enum ModelType {
  THREAT_DRAGON = 'Threat Dragon',
  DEFAULT = 'Default',
  IMAGE = 'Image',
}

export const DEFAULT_GAME_MODE = GameMode.EOP;
export function isGameMode(value: string): value is GameMode {
  return value in GameMode;
}

export const DEFAULT_START_SUIT = 'E';
export const CARD_LIMIT = 26;

export const MIN_NUMBER_PLAYERS = 2;
export const MAX_NUMBER_PLAYERS = 9;
export const DEFAULT_TURN_DURATION = 300;

//TODO: Move this into dedicated server config file
export const SERVER_PORT = Number.parseInt(process.env.SERVER_PORT ?? '8000');
export const API_PORT = Number.parseInt(process.env.API_PORT ?? '8001');
export const INTERNAL_API_PORT = Number.parseInt(
  process.env.INTERNAL_API_PORT ?? '8002',
);

export const DEFAULT_MODEL = {
  summary: {
    title: 'Threat Modelling',
  },
  detail: {
    contributors: [],
    diagrams: [
      {
        title: 'Threat Modelling',
        diagramType: 'STRIDE',
        id: 0,
        $$hashKey: 'object:14',
        diagramJson: {
          cells: [
            {
              type: 'tm.Actor',
              size: {
                width: 160,
                height: 80,
              },
              position: {
                x: 50,
                y: 50,
              },
              angle: 0,
              id: '90cdcc2d-21ab-443d-ae95-f97a798429e7',
              z: 1,
              hasOpenThreats: false,
              attrs: {
                '.element-shape': {
                  class: 'element-shape hasNoOpenThreats isInScope',
                },
                text: {
                  text: 'Application',
                },
                '.element-text': {
                  class: 'element-text hasNoOpenThreats isInScope',
                },
              },
            },
          ],
        },
        size: {
          height: 590,
          width: 790,
        },
      },
    ],
  },
};

export const SPECTATOR = `spectator`;
