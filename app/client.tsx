import { createClient } from 'chunkify';

export const client = createClient({
    teamToken: process.env.CHUNKIFY_TEAM_TOKEN || '',
    projectToken: process.env.CHUNKIFY_PROJECT_TOKEN || '',
});
