import { getDatabase } from '../config';
import { FlatFile } from 'boardgame.io/server';

it('returns correct FlatFile database', () => {
  process.env = {
    DATA_STORE: 'whatever',
  };
  const db = getDatabase();
  expect(db).toBeInstanceOf(FlatFile);
});
