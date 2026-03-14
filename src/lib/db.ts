import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function readDb() {
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDb(data: object) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}
