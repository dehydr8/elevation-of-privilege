import type { Card } from './cardDefinitions';

export enum GameMode {
  EOP = 'Elevation of Privilege',
  CORNUCOPIA = 'OWASP Cornucopia',
  CUMULUS = 'Cumulus',
}

export const DEFAULT_GAME_MODE = GameMode.EOP;

export function getCardCssClass(gameMode: GameMode, c: Card): string {
  if (isGameModeCornucopia(gameMode)) {
    return `cornucopia-card cornucopia-card-img-${c.toLowerCase()}`;
  }

  if (isGameModeCumulus(gameMode)) {
    return `cumulus-card cumulus-card-img-${c.toLowerCase()}`;
  }

  return `eop-card eop-card-img-${c.toLowerCase()}`;
}
function isGameMode(value: GameMode): value is GameMode {
  return Object.values(GameMode).includes(value);
}
function isGameModeCornucopia(gameMode: GameMode): boolean {
  return isGameMode(gameMode) && gameMode === GameMode.CORNUCOPIA;
}
function isGameModeCumulus(gameMode: GameMode): boolean {
  return isGameMode(gameMode) && gameMode === GameMode.CUMULUS;
}
