import { FlatFile } from 'boardgame.io/server';

export function getDatabase() {
    return new FlatFile({
      dir: 'db',
      logging: false,
    });
  // }
}