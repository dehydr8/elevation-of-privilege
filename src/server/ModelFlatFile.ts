import { FlatFile } from 'boardgame.io/server';

import type { Object } from 'ts-toolbelt';
import type {
  FetchFields,
  FetchOpts,
} from 'boardgame.io/dist/types/src/server/db/base';

interface ModelFetchOpts extends FetchOpts {
  model?: boolean;
}

interface ModelFetchFields extends FetchFields {
  model: Record<string, unknown>; // TODO: improve
}

type ModelFetchResult<O extends ModelFetchOpts> = Object.Pick<
  ModelFetchFields,
  Object.SelectKeys<O, true>
>;

/**
 * FlatFile data storage with support for saving a model.
 */
export class ModelFlatFile extends FlatFile {
  async fetch<O extends ModelFetchOpts>(
    matchID: string,
    opts: O,
  ): Promise<ModelFetchResult<O>> {
    const result = await super.fetch(matchID, opts);
    if (opts.model) {
      const key = this.getModelKey(matchID);
      return {
        ...result,
        // @ts-expect-error getItem is private, ask boardgame.io to make it protected
        model: await this.getItem(key),
      } as unknown as ModelFetchResult<O>;
    }
    return result as unknown as ModelFetchResult<O>;
  }

  async setModel(id: string, model: Record<string, unknown>): Promise<void> {
    const key = this.getModelKey(id);
    // @ts-expect-error setItem is private, ask boardgame.io to make it protected
    return await this.setItem(key, model);
  }

  getModelKey(matchID: string): string {
    return `${matchID}:model`;
  }
}
