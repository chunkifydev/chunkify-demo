'use server';

import { Upload, NotificationPayloadJobCompletedData } from 'chunkify';

// In-memory store for demo - single upload and two jobs
let uploadStore: Upload | null = null;
let jobStore: NotificationPayloadJobCompletedData[] = [];

// Getter functions
export async function getUploadStore(): Promise<Upload | null> {
    return uploadStore;
}

export async function getJobStore(): Promise<
    NotificationPayloadJobCompletedData[]
> {
    return jobStore;
}

// Helper functions to manage the store
export async function resetStore(): Promise<void> {
    console.log('Reset store called');
    uploadStore = null;
    jobStore = [];
}

export async function setUploadStore(upload: Upload): Promise<void> {
    uploadStore = upload;
    console.log('Upload store:', uploadStore);
}

export async function addJobToStore(
    job: NotificationPayloadJobCompletedData
): Promise<void> {
    if (jobStore.length >= 2) {
        jobStore.shift(); // Remove oldest job
    }
    jobStore.push(job);
}

export async function updateJobStore(
    updatedJob: NotificationPayloadJobCompletedData
): Promise<void> {
    const jobIndex = jobStore.findIndex(
        (job) => job.job.id === updatedJob.job.id
    );
    if (jobIndex !== -1) {
        jobStore[jobIndex] = updatedJob;
    }
}
