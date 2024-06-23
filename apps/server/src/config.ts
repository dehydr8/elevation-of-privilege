import { ModelFlatFile } from './ModelFlatFile';
import { getDbFolder } from './filesystem';

export function getDatabase(): ModelFlatFile {
  return new ModelFlatFile({
    dir: getDbFolder(),
    logging: false,
  });
}
