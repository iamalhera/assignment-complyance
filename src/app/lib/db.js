import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');

async function ensureDbExists() {
  await fs.mkdir(DB_PATH, { recursive: true });
}

async function readDb(file) {
  await ensureDbExists();
  try {
    const data = await fs.readFile(path.join(DB_PATH, `${file}.json`), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeDb(file, data) {
  await ensureDbExists();
  await fs.writeFile(path.join(DB_PATH, `${file}.json`), JSON.stringify(data, null, 2));
}

export { readDb, writeDb };