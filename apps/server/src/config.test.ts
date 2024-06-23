import { getDatabase } from './config';
import { FlatFile } from 'boardgame.io/server';

const env = process.env;

afterEach(() => {
  process.env = env;
});

it('returns correct FlatFile database', () => {
  process.env.DATA_STORE = 'whatever';
  const db = getDatabase();
  expect(db).toBeInstanceOf(FlatFile);
});
