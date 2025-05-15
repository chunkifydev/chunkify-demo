import { File } from 'chunkify';

export type Video = {
    id: string;
    job_id: string | null;
    upload_id: string;
    source_id: string | null;
    title: string | null;
    status: string;
    created_at: string;
    files: File[] | null;
    thumbnail: string | null;
    sprite: string | null;
};

export type Images = {
    job_id: string;
    interval: number;
    files: File[];
    thumbnailsFor: string;
};

// Add this type for job info
export type JobInfo = {
    status: string;
    progress?: number;
    // add other fields you need
};
