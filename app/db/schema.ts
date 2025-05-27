import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const videos = sqliteTable('videos', {
    id: text('id').primaryKey().notNull(),
    job_id: text('job_id'),
    upload_id: text('upload_id'),
    source_id: text('source_id'),
    status: text('status').notNull().default('waiting'),
    title: text('title'),
    created_at: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    files: text('files', { mode: 'json' }),
    thumbnail: text('thumbnail'),
    sprite: text('sprite'),
    duration: integer('duration'),
    metadata: text('metadata', { mode: 'json' }),
});
