import { ModelFlatFile } from './ModelFlatFile';

export function getDatabase(): ModelFlatFile {
  return new ModelFlatFile({
    dir: 'db',
    logging: false,
  });
}
