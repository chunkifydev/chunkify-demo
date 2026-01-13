import { Chunkify } from '@chunkify/chunkify';

const projectToken = process.env['CHUNKIFY_TOKEN'];
const webhookSecret = process.env['CHUNKIFY_WEBHOOK_SECRET'];

// Validation des tokens
if (!projectToken) {
    throw new Error(
        'Missing authentication tokens. Please set CHUNKIFY_TOKEN in your .env.local file'
    );
}

if (!webhookSecret) {
    throw new Error(
        'Missing webhook secret. Please set CHUNKIFY_WEBHOOK_SECRET in your .env.local file'
    );
}

export const client = new Chunkify();

