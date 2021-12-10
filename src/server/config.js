import { ModelFlatFile } from './ModelFlatFile';

export function getDatabase() {
  return new ModelFlatFile({
    dir: 'db',
    logging: false,
  });
}
