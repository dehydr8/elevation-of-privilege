import { FlatFile, Mongo } from 'boardgame.io/server';

export function getDatabase() {
  if (process.env.DATA_STORE === 'mongo') {
    return new Mongo({
      url: process.env.MONGO_URI,
      dbname: process.env.MONGO_DATABASE,
    });
  } else {
    return new FlatFile({
      dir: 'db',
      logging: false,
    });
  }
}