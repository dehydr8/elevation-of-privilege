import type { PlayerID } from 'boardgame.io';
import type { GameState } from '../game/gameState';
import type { Card, Suit } from './cardDefinitions';
import { ModelType } from './constants';

export function getDealtCard(G: GameState): string {
  if (G.dealt.length > 0 && G.dealtBy) {
    return G.dealt[Number.parseInt(G.dealtBy)];
  }
  return '';
}

export function resolvePlayerNames(
  players: PlayerID[],
  names: string[],
  current: PlayerID | null,
): string[] {
  const resolved = [];
  for (let i = 0; i < players.length; i++) {
    const c = Number.parseInt(players[i]);
    resolved.push(
      current !== null && c === Number.parseInt(current) ? 'You' : names[c],
    );
  }
  return resolved;
}

export function resolvePlayerName(
  player: PlayerID,
  names: string[],
  current: PlayerID | null,
): string {
  return current !== null &&
    Number.parseInt(player) === Number.parseInt(current)
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
  allCardsInHand: Card[],
  currentSuit: Suit | undefined,
  round: number,
  startingCard: Card,
): Card[] {
  if (!currentSuit && round <= 1) {
    return [startingCard];
  }

  const cardsOfSuit = getCardsOfSuit(allCardsInHand, currentSuit);

  return cardsOfSuit.length > 0 ? cardsOfSuit : allCardsInHand;
}

function getCardsOfSuit(cards: Card[], suit: Suit | undefined): Card[] {
  if (!suit) {
    return [];
  }
  return cards.filter((e) => e.startsWith(suit));
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

export function isModelType(value: string): value is ModelType {
  return (
    value === ModelType.PRIVACY_ENHANCED ||
    value === ModelType.IMAGE ||
    value === ModelType.THREAT_DRAGON
  );
}
