import { FlatFile } from 'boardgame.io/server';

/**
 * FlatFile data storage with support for saving a model.
 */
export class ModelFlatFile extends FlatFile {
  async fetch(matchID, opts) {
    var result = await super.fetch(matchID, opts);
    if (opts.model) {
      const key = this.getModelKey(matchID);
      result.model = await this.getItem(key);
    }
    return result;
  }
  async setModel(id, model) {
    const key = this.getModelKey(id);
    return await this.setItem(key, model);
  }
  getModelKey(matchID) {
    return `${matchID}:model`;
  }
}
