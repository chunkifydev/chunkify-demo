'use server';
import { client } from '../client';
import  Chunkify from '@chunkify/chunkify';
import { Video, Images } from '../types';
import { generateDemoId } from '../db/store';

export async function createUpload() {
    const metadata: Record<string, string> = {
        demo_id: await generateDemoId(),
    };

    return await client.uploads.create({ metadata: metadata });
}

export async function getJobInfo(job_id: string) {
    const job = await client.jobs.retrieve(job_id);
    return job;
}

export async function createVideoJob(upload: Chunkify.Upload) {
    const params: Chunkify.JobCreateParams = {
        source_id: upload.source_id ?? '',
        format: {
            id: 'mp4_h264',
        },
        ...(upload.metadata && { metadata: upload.metadata }),
    };

    const job = await client.jobs.create(params);
    const VideoJob: Video = {
        id: upload.metadata?.demo_id ?? '',
        job_id: job.id,
        status: 'processing',
        title: job.metadata?.title ?? null,
        created_at: job.created_at,
        files: [],
        thumbnail: null,
        sprite: null,
        duration: null,
        upload_id: upload.id,
        source_id: upload.source_id ?? null,
    };

    return VideoJob;
}

export async function createImageJob(upload: Chunkify.Upload, duration: number) {
    const conf = {
        interval: Math.max(
            1,
            Math.round(duration < 5 ? duration / 2 : duration / 10)
        ),
    };
    const thumbnailsFor = upload.metadata?.demo_id;

    const params: Chunkify.JobCreateParams = {
        source_id: upload?.source_id || '',
        format: {
            id: 'jpg',
            ...conf,
        },
        metadata: {
            thumbnails_for: thumbnailsFor ?? '',
        },
    };
    const job = await client.jobs.create(params);
    const ImageJob: Images = {
        job_id: job.id,
        interval: conf.interval,
        files: [],
        thumbnailsFor: thumbnailsFor ?? '',
    };
    return ImageJob;
}

export async function createSpriteJob(upload: Chunkify.Upload, duration: number) {
    const conf = {
        interval: duration < 10 ? 1 : 5, // 1 second for videos under 10s, 5 seconds for longer videos
        sprite: true,
    };
    const spriteFor = upload.metadata?.demo_id;

    const params: Chunkify.JobCreateParams = {
        source_id: upload?.source_id || '',
        format: {
            id: 'jpg',
            ...conf,
        },
        metadata: {
            sprite_for: spriteFor ?? '',
        },
    };
    const job = await client.jobs.create(params);
    const spriteJob: Images = {
        job_id: job.id,
        interval: conf.interval,
        files: [],
        thumbnailsFor: spriteFor ?? '',
    };
    return spriteJob;
}

