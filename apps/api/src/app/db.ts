import { Pool } from 'pg';
import * as path from 'path';
import * as marv from 'marv/api/promise';
import marvPgDriver from 'marv-pg-driver';

const databaseURL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/1t';
const credentials = {
  connectionString: databaseURL,
};
const migrationsDirectory = path.resolve('migrations');

export async function migrate() {
    /* Database migration */
    const migrations = await marv.scan(migrationsDirectory);
    await marv.migrate(migrations, marvPgDriver({ connection: credentials }));    
}

/* Create pool for database access */
export const db = new Pool(credentials);