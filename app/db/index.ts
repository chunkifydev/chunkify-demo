import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Just create the connection once
const dbPath = path.join(process.cwd(), 'app', 'db', 'sqlite.db');
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
