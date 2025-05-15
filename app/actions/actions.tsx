'use server';

import { client } from '../client';
import {
    UploadCreateParamsMetadata,
    JobCreateParams,
    Upload,
    FfmpegJpg,
} from 'chunkify';
import { Video, Images } from '../types';

import { generateDemoId } from '../db/store';

export async function createUpload(title: string) {
    const metadata: UploadCreateParamsMetadata = {
        demo_id: await generateDemoId(),
        title: title,
    };

    return await client.upload.create({ metadata: metadata });
}

export async function createVideoJob(upload: Upload) {
    const params: JobCreateParams = {
        source_id: upload.source_id,
        format: {
            name: 'mp4/x264',
            config: {},
        },
        ...(upload.metadata && { metadata: upload.metadata }),
    };

    const job = await client.job.create(params);
    const VideoJob: Video = {
        id: upload.metadata?.demo_id,
        job_id: job.id,
        status: 'processing',
        title: job.metadata?.title,
        created_at: job.created_at,
        files: [],
        thumbnail: null,
        sprite: null,
    };

    return VideoJob;
}

export async function createImageJob(upload: Upload, duration: number) {
    console.log('Creating image job with duration:', duration);
    const conf = {
        interval: Math.max(
            1,
            Math.round(duration < 5 ? duration / 2 : duration / 10)
        ),
    };
    const thumbnailsFor = upload.metadata?.demo_id;

    const params: JobCreateParams = {
        source_id: upload?.source_id || '',
        format: {
            name: 'jpg',
            config: conf,
        },
        metadata: {
            thumbnails_for: thumbnailsFor,
        },
    };
    const job = await client.job.create(params);
    const ImageJob: Images = {
        job_id: job.id,
        interval: conf.interval,
        files: [],
        thumbnailsFor: thumbnailsFor,
    };
    return ImageJob;
}

export async function createSpriteJob(upload: Upload, duration: number) {
    console.log('Creating image job with duration:', duration);
    const conf: FfmpegJpg = {
        interval: duration < 10 ? 1 : 5, // 1 second for videos under 10s, 5 seconds for longer videos
        sprite: true,
    };
    const spriteFor = upload.metadata?.demo_id;

    const params: JobCreateParams = {
        source_id: upload?.source_id || '',
        format: {
            name: 'jpg',
            config: conf,
        },
        metadata: {
            sprite_for: spriteFor,
        },
    };
    const job = await client.job.create(params);
    const spriteJob: Images = {
        job_id: job.id,
        interval: conf.interval,
        files: [],
        thumbnailsFor: spriteFor,
    };
    return spriteJob;
}
