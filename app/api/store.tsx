'use server';

import { Upload, File, Job } from 'chunkify';

// In-memory store for demo - single upload and two jobs
let uploadStore: Upload[] = [];
let jobStore: JobWithFiles[] = [];

export type JobWithFiles = Job & {
    files: File[];
    thumbnail?: string;
};

// Getter functions
export async function getUploadStore(): Promise<Upload[]> {
    return uploadStore;
}

export async function getJobStore(): Promise<JobWithFiles[]> {
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

export async function addJobToStore(job: JobWithFiles): Promise<void> {
    jobStore.push(job);
    console.log('Job added to store:', job);
}

export async function newStoreJob(
    demoId: string,
    title?: string
): Promise<JobWithFiles> {
    return {
        id: '',
        status: 'waiting',
        progress: 0,
        billableTime: 0,
        source_id: '',
        storage: { id: '', path: '', region: '' },
        created_at: '',
        updated_at: '',
        started_at: '',
        transcoder: { type: '4vCPU', quantity: 0, speed: 0, status: [] },
        hls_manifest_id: '',
        metadata: {
            demo_id: demoId,
            title: title,
        },
        format: { name: 'mp4/x264', config: {} },
        files: [],
        thumbnail: '',
    };
}

export async function updateJobStore(
    updatedJob: JobWithFiles,
    demoId?: string
): Promise<void> {
    if (demoId) {
        const jobIndex = jobStore.findIndex(
            (job) => job.metadata.demo_id === demoId
        );
        if (jobIndex !== -1) {
            jobStore[jobIndex] = updatedJob;
        }
    } else {
        const jobIndex = jobStore.findIndex((job) => job.id === updatedJob.id);
        if (jobIndex !== -1) {
            jobStore[jobIndex] = updatedJob;
        }
    }
}

export async function generateDemoId(): Promise<string> {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
