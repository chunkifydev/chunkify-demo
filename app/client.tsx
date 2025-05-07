import { createClient } from 'chunkify';

export const client = createClient(
    process.env.CHUNKIFY_TEAM_TOKEN || '',
    process.env.CHUNKIFY_PROJECT_TOKEN || ''
);
