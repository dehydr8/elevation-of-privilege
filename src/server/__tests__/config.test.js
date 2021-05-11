import { getDatabase } from '../config';
import { FlatFile, Mongo } from 'boardgame.io/server';

it('returns correct Mongo database', () => {
  process.env = {
    DATA_STORE: "mongo",
  };
  const db = getDatabase();
  expect(db).toBeInstanceOf(Mongo);
});

it('returns correct FlatFile database', () => {
  process.env = {
    DATA_STORE: "whatever",
  };
  const db = getDatabase();
  expect(db).toBeInstanceOf(FlatFile);
});