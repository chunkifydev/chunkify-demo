import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const uploads = sqliteTable('uploads', {
    id: text('id').primaryKey().notNull(),
    source_id: text('source_id'),
    status: text('status').notNull().default('waiting'),
    created_at: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    metadata: text('metadata', { mode: 'json' }),
});

export const videos = sqliteTable('videos', {
    id: text('id').primaryKey().notNull(),
    job_id: text('job_id'),
    status: text('status').notNull().default('waiting'),
    title: text('title'),
    created_at: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    files: text('files', { mode: 'json' }),
    thumbnail: text('thumbnail'),
    sprite: text('sprite'),
});
