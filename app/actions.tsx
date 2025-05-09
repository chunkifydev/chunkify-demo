'use server';

import { client } from './client';
import { UploadCreateParamsMetadata, JobCreateParams } from 'chunkify';

export async function createUpload(title: string) {
    const metadata: UploadCreateParamsMetadata = {
        title: title,
    };

    return await client.upload.create({ metadata: metadata });
}
