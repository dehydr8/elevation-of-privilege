import { FlatFile } from 'boardgame.io/server';

class ModelFlatFile extends FlatFile {
  async fetch(matchID, opts) {
    var result = await super.fetch(matchID, opts);
    if(opts.model) {
      const key = ModelKey(matchID);
      result.model = (await this.getItem(key));
    }
    return result
  }
  async setModel(id, model) {
    const key = ModelKey(id);
    return await this.setItem(key, model);
  }
}

function ModelKey(matchID) {
  return `${matchID}:model`;
}

export function getDatabase() {
    return new ModelFlatFile({
      dir: 'db',
      logging: false,
    });
}