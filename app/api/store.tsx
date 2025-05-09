'use server';

import {
    Upload,
    NotificationPayloadJobCompletedData,
    File,
    Job,
} from 'chunkify';

// In-memory store for demo - single upload and two jobs
let uploadStore: Upload[] = [];
let jobStore: JobWithFiles[] = [];

export type JobWithFiles = Job & {
    files: File[];
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

export async function setUploadStore(upload: Upload): Promise<void> {
    uploadStore = [upload];
    console.log('Upload store:', uploadStore);
}

export async function addJobToStore(job: JobWithFiles): Promise<void> {
    if (jobStore.length >= 2) {
        jobStore.shift(); // Remove oldest job
    }
    jobStore.push(job);
}

export async function updateJobStore(updatedJob: JobWithFiles): Promise<void> {
    const jobIndex = jobStore.findIndex((job) => job.id === updatedJob.id);
    if (jobIndex !== -1) {
        jobStore[jobIndex] = updatedJob;
    }
}
