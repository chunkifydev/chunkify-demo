'use server';

import { client } from './client';
import { UploadCreateParamsMetadata, JobCreateParams } from 'chunkify';
import { generateDemoId } from './api/store';

export async function createUpload(title: string) {
    const metadata: UploadCreateParamsMetadata = {
        demo_id: await generateDemoId(),
        title: title,
    };

    return await client.upload.create({ metadata: metadata });
}
