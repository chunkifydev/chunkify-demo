'use server';

import { db } from './index';
import { videos } from './schema';
import { Video } from '../types';
import { eq, inArray, sql } from 'drizzle-orm';
import { File } from 'chunkify';

export async function allVideos(statuses?: string[]): Promise<Video[]> {
    const query = db.select().from(videos);
    const result = statuses?.length
        ? await query.where(inArray(videos.status, statuses)).all()
        : await query.all();

    return result.map((video) => ({
        id: video.id,
        job_id: video.job_id ?? '',
        source_id: video.source_id ?? '',
        status: video.status ?? '',
        title: video.title ?? '',
        created_at: video.created_at ?? '',
        thumbnail: video.thumbnail ?? '',
        sprite: video.sprite ?? '',
        files: (video.files || []) as File[],
        upload_id: video.upload_id ?? '',
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
            created_at: new Date().toISOString(),
            thumbnail: null,
            sprite: null,
        } as typeof videos.$inferInsert)
        .run();

    console.log('Video added to database');
}

export async function updateVideo(
    id: string,
    updates: Partial<Video>
): Promise<boolean> {
    const result = await db
        .update(videos)
        .set(updates)
        .where(eq(videos.id, id))
        .run();

    return result.changes > 0;
}

export async function removeVideo(id: string): Promise<boolean> {
    // First delete the video
    const videoResult = await db.delete(videos).where(eq(videos.id, id)).run();

    return videoResult.changes > 0;
}

export async function addThumbnail(id: string, files: File[]) {
    if (files.length > 0) {
        console.log('Adding thumbnail from image job');

        // First, filter for valid image files
        const imageFiles = files.filter((file) => {
            const path = file.path?.toLowerCase() || '';
            return path.endsWith('.jpg') || path.endsWith('.jpeg');
        });

        if (imageFiles.length === 0) {
            console.log('No valid image files found for thumbnail');
            return;
        }

        // Take a thumbnail from the middle of the video
        const thumbnailIndex = Math.floor(imageFiles.length / 2);
        const selectedFile = imageFiles[thumbnailIndex];

        if (selectedFile?.url) {
            await updateVideo(id, {
                thumbnail: selectedFile.url,
            });
            console.log('Successfully added thumbnail');
        } else {
            console.log('Selected file has no URL');
        }
    }
}

export async function addSprite(id: string, files: File[]) {
    if (files.length > 0) {
        console.log('Adding sprite files');

        // Find the VTT file
        const vttFile = files.find((file) =>
            file.path?.toLowerCase().endsWith('.vtt')
        );

        if (vttFile?.url) {
            await updateVideo(id, {
                sprite: vttFile.url,
            });
        } else {
            console.log('No vtt file found for sprite');
        }
    }
}

export async function generateDemoId(): Promise<string> {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function getVideoById(id: string): Promise<Video | null> {
    const result = await db
        .select()
        .from(videos)
        .where(eq(videos.id, id))
        .limit(1)
        .all();

    if (result.length === 0) {
        return null;
    }

    const video = result[0];
    return {
        id: video.id,
        job_id: video.job_id ?? null,
        status: video.status,
        title: video.title ?? null,
        created_at: video.created_at,
        thumbnail: video.thumbnail ?? null,
        files: (video.files ?? null) as File[] | null,
        sprite: video.sprite ?? null,
        upload_id: video.upload_id ?? '',
        source_id: video.source_id ?? null,
    };
}
