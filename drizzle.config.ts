import type { Config } from 'drizzle-kit';
import path from 'path';

export default {
    schema: './app/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: path.join(process.cwd(), 'app', 'db', 'sqlite.db'),
    },
} satisfies Config;
