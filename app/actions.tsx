'use server';

import { client } from './client';
import { UploadCreateParamsMetadata, JobCreateParams } from 'chunkify';

export async function createUpload(name: string) {
    const metadataToUpload: UploadCreateParamsMetadata = {
        name: name,
    };

    return await client.upload.create({ metadata: metadataToUpload });
}
