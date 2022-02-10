import type { PlayerID } from 'boardgame.io';
import type { EOPGameState } from '../game/gameState';
import {
  DeckSuit,
  DECK_SUITS,
  GameMode,
  GAMEMODE_CORNUCOPIA,
  GAMEMODE_EOP,
  ModelType,
  MODEL_TYPE_DEFAULT,
  MODEL_TYPE_IMAGE,
  MODEL_TYPE_THREAT_DRAGON,
} from './constants';

export function getDealtCard(G: EOPGameState): string {
  if (G.dealt.length > 0 && G.dealtBy) {
    return G.dealt[Number.parseInt(G.dealtBy)];
  }
  return '';
}

export function isGameModeCornucopia(gameMode: GameMode): boolean {
  return gameMode === GAMEMODE_CORNUCOPIA;
}

export function getCardName(card: string, gameMode: GameMode): string {
  if (!card) {
    return '';
  }
  if (isGameModeCornucopia(gameMode)) {
    return getAbbreviationForCornucopia(card) + card.substr(1);
  } else {
    return getAbbreviationForEoP(card) + card.substr(1);
  }
}

export function resolvePlayerNames(
  players: PlayerID[],
  names: string[],
  current: PlayerID,
): string[] {
  const resolved = [];
  for (let i = 0; i < players.length; i++) {
    const c = Number.parseInt(players[i]);
    resolved.push(c === Number.parseInt(current) ? 'You' : names[c]);
  }
  return resolved;
}

export function resolvePlayerName(
  player: PlayerID,
  names: string[],
  current: PlayerID,
): string {
  return Number.parseInt(player) === Number.parseInt(current)
    ? 'You'
    : names[Number.parseInt(player)];
}

export function grammarJoin(arr: string[]): string | undefined {
  const last = arr.pop();

  if (arr.length <= 0) return last;

  return arr.join(', ') + ' and ' + last;
}

export function getPlayers(count: number): string[] {
  const players = [];
  for (let i = 0; i < count; i++) {
    players.push(i + '');
  }
  return players;
}

// FIXME: Improve typing of model / component
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function getComponentName(component: any): string {
  if (component === null) return '';

  const prefix = component.type.substr(3);

  if (component.type === 'tm.Flow') {
    return `${prefix}: ${component.labels[0].attrs.text.text}`;
  }

  return `${prefix}: ${component.attrs.text.text}`;
}

export function getValidMoves(
  cards: string[],
  suit: string,
  round: number,
  startingCard: string,
): string[] {
  let validMoves: string[] = [];

  if (suit === '' && round <= 1) {
    validMoves.push(startingCard);
  } else {
    if (suit !== '') validMoves = cards.filter((e) => e.startsWith(suit));
    if (validMoves.length <= 0) validMoves = cards;
  }

  return validMoves;
}

export function getTypeString(type: string, gameMode: GameMode): string {
  const map = {
    [GAMEMODE_CORNUCOPIA]: {
      A: 'Data Validation & Encoding',
      B: 'Cryptography',
      C: 'Session Management',
      D: 'Authorization',
      E: 'Authentication',
      T: 'Cornucopia',
    },
    [GAMEMODE_EOP]: {
      A: 'Denial of Service',
      B: 'Information Disclosure',
      C: 'Repudiation',
      D: 'Spoofing',
      E: 'Tampering',
      T: 'Elevation of privilege',
    },
  }[gameMode];

  if (map && type in map) {
    return map[type as DeckSuit];
  }
  return '';
}

export function getAbbreviationForEoP(card: string): string {
  const category = card.substr(0, 1);
  const map = {
    A: 'D',
    B: 'I',
    C: 'R',
    D: 'S',
    E: 'T',
    T: 'E',
  };
  if (category in map) {
    return map[category as keyof typeof map];
  }
  return '';
}

export function getAbbreviationForCornucopia(card: string): string {
  const category = card.substr(0, 1);
  const map = {
    A: 'Data',
    B: 'Crypt',
    C: 'Sessn',
    D: 'AuthZ',
    E: 'AuthN',
    T: 'Cornu',
  };
  if (category in map) {
    return map[category as keyof typeof map];
  }
  return '';
}

export function escapeMarkdownText(text: string): string {
  //replaces certain characters with an escaped version
  //doesn't escape * or _ to allow users to format the descriptions

  return text
    .replace(/[![\]()]/gm, '\\$&')
    .replace(/</gm, '&lt;')
    .replace(/>/gm, '&gt;');
}

export function getImageExtension(filename: string): string | undefined {
  const pattern = new RegExp(`\\.(?<extension>\\w+)$`);
  const matches = filename.match(pattern);
  if (matches && matches.groups && matches.groups.extension) {
    return matches.groups.extension;
  }
  return undefined;
}

export function asyncSetTimeout<U, F extends () => Promise<U>>(
  callback: F,
  delay: number,
): Promise<U> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      callback().then(resolve, reject);
    }, delay);
  });
}

export function logEvent(message: string): void {
  const now = new Date(Date.now()).toISOString();
  console.log(`${now} - ${message}`);
}

export function isDeckSuit(value: string): value is DeckSuit {
  return (DECK_SUITS as readonly string[]).includes(value);
}

export function isGameMode(value: string): value is GameMode {
  return value === GAMEMODE_EOP || value === GAMEMODE_CORNUCOPIA;
}

export function isModelType(value: string): value is ModelType {
  return (
    value === MODEL_TYPE_DEFAULT ||
    value === MODEL_TYPE_IMAGE ||
    value === MODEL_TYPE_THREAT_DRAGON
  );
}
