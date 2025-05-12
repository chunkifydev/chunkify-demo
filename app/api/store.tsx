'use server';

import { Upload, File, Job } from 'chunkify';

// In-memory store for demo - single upload and two jobs
let uploadStore: Upload[] = [];
let jobStore: VideoJob[] = [];

export type VideoJob = {
    id: string;
    job_id: string;
    title: string;
    status: string;
    created_at: string;
    files: File[];
    thumbnail?: string;
};

export type ImageJob = {
    job_id: string;
    files: File[];
    thumbnailsFor?: string;
};

// Getter functions
export async function getUploadStore(): Promise<Upload[]> {
    return uploadStore;
}

export async function getJobStore(): Promise<VideoJob[]> {
    return jobStore;
}

// Helper functions to manage the store
export async function resetStore(): Promise<void> {
    console.log('Reset store called');
    uploadStore = [];
    jobStore = [];
}

// Update the upload store return true if update occurred
export async function updateUploadStore(
    updatedUpload: Upload
): Promise<boolean> {
    const uploadIndex = uploadStore.findIndex(
        (upload) => upload.id === updatedUpload.id
    );
    if (uploadIndex !== -1) {
        uploadStore[uploadIndex] = updatedUpload;
        console.log('Upload store:', uploadStore);
        return true; // Update occurred
    }
    return false; // No update occurred
}

export async function addToUploadStore(upload: Upload): Promise<void> {
    uploadStore.push(upload);
    console.log('Upload store:', uploadStore);
}

export async function addJobToStore(job: VideoJob): Promise<void> {
    jobStore.push(job);
    console.log('Job added to store:', job);
}

export async function newStoreJob(
    demoId: string,
    title?: string
): Promise<VideoJob> {
    return {
        id: demoId,
        job_id: '',
        title: title || '',
        status: 'waiting',
        created_at: '',
        files: [],
        thumbnail: '',
    };
}

export async function updateJob(
    id: string,
    status: string,
    files?: File[],
    thumbnail?: string
): Promise<void> {
    const jobIndex = jobStore.findIndex((job) => job.id === id);
    if (jobIndex !== -1) {
        jobStore[jobIndex] = {
            ...jobStore[jobIndex],
            status,
            files: files || [],
            thumbnail: thumbnail || '',
        };
    }
}

export async function generateDemoId(): Promise<string> {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
