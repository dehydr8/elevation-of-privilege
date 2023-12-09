import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const DB_SUBFOLDER = `db`;
const DB_IMAGES_SUBFOLDER = `db-images`;

const ensureExists = (subfolder: string): string => {
  const fullPath = path.join(os.tmpdir(), subfolder);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }

  if (!fs.lstatSync(fullPath).isDirectory()) {
    throw new Error(
      `Conflict: Expected ${fullPath} to be a directory, but is a file.`,
    );
  }

  // Fail fast: if another user already created this subfolder (i.e. for information disclosure), this will fail and the application will not start
  fs.chmodSync(fullPath, 0o700);

  return fullPath;
};

export const getDbFolder = (): string => {
  return ensureExists(DB_SUBFOLDER);
};

export const getDbImagesFolder = (): string => {
  return ensureExists(DB_IMAGES_SUBFOLDER);
};
