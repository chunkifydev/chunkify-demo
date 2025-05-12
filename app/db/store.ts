'use server';

import { db } from './index';
import { uploads, videos } from './schema';
import { VideoJob, VideoUpload } from '../types/types';
import { eq } from 'drizzle-orm';
import { File } from 'chunkify';

export async function insertUpload(upload: VideoUpload): Promise<void> {
    await db
        .insert(uploads)
        .values({
            id: upload.id,
            source_id: upload.source_id,
            status: upload.status,
            created_at: upload.created_at,
            metadata: upload.metadata,
        } as typeof uploads.$inferInsert)
        .run();

    console.log('Upload added to database');
}

export async function allUploads(): Promise<VideoUpload[]> {
    const result = await db.select().from(uploads).all();
    return result.map((upload) => ({
        id: upload.id,
        source_id: upload.source_id ?? '',
        status: upload.status ?? '',
        created_at: upload.created_at ?? '',
        metadata: JSON.parse(upload.metadata as string) as Record<string, any>,
    }));
}

export async function allVideos(): Promise<VideoJob[]> {
    const result = await db.select().from(videos).all();
    return result.map((video) => ({
        id: video.id,
        job_id: video.job_id ?? '',
        status: video.status ?? '',
        title: video.title ?? '',
        created_at: video.created_at ?? '',
        thumbnail: video.thumbnail ?? '',
        files: (video.files || []) as File[],
    }));
}

export async function insertVideo(id: string, title?: string): Promise<void> {
    await db
        .insert(videos)
        .values({
            id,
            job_id: null,
            status: 'waiting',
            title: title ?? null,
            files: [],
            thumbnail: null,
        } as typeof videos.$inferInsert)
        .run();

    console.log('Video added to database');
}

export async function updateUpload(upload: VideoUpload): Promise<boolean> {
    const result = await db
        .update(uploads)
        .set({
            source_id: upload.source_id ?? undefined,
            status: upload.status,
            created_at: upload.created_at ?? undefined,
            metadata: upload.metadata,
        })
        .where(eq(uploads.id, upload.id))
        .run();

    return result.changes > 0;
}

export async function updateVideo(job: VideoJob): Promise<void> {
    await db
        .update(videos)
        .set({
            job_id: job.job_id,
            status: job.status,
            title: job.title,
            created_at: job.created_at,
            files: job.files,
            thumbnail: job.thumbnail,
        })
        .where(eq(videos.id, job.id))
        .run();

    console.log('Video updated in database');
}

export async function updateVideoStatus(
    id: string,
    status: string
): Promise<boolean> {
    const result = await db
        .update(videos)
        .set({ status })
        .where(eq(videos.id, id))
        .run();

    return result.changes > 0;
}

export async function updateVideoStatusAndFiles(
    id: string,
    status: string,
    files: File[]
): Promise<boolean> {
    const result = await db
        .update(videos)
        .set({
            status,
            files,
        })
        .where(eq(videos.id, id))
        .run();

    return result.changes > 0;
}

export async function updateVideoThumbnail(
    id: string,
    thumbnail: string
): Promise<boolean> {
    const result = await db
        .update(videos)
        .set({ thumbnail })
        .where(eq(videos.id, id))
        .run();

    return result.changes > 0;
}

export async function addThumbnail(id: string, files: File[]) {
    if (files.length > 0) {
        console.log('Adding thumbnail from image job');
        // Take a thumbnail that is middle of the video roughly
        const thumbnailIndex = Math.floor(files.length / 2);
        const thumbnailUrl = files[thumbnailIndex].url;
        if (thumbnailUrl) {
            await updateVideoThumbnail(id, thumbnailUrl);
        }
    }
}

export async function generateDemoId(): Promise<string> {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
