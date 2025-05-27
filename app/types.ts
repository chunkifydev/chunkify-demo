import { File } from 'chunkify';

export type VideoStatus = 'waiting' | 'processing' | 'completed' | 'error';

export type Video = {
    id: string;
    job_id: string | null;
    upload_id: string;
    source_id: string | null;
    title: string | null;
    status: VideoStatus;
    created_at: string;
    files: File[] | null;
    thumbnail: string | null;
    sprite: string | null;
    duration: number | null;
};

export type Images = {
    job_id: string;
    interval: number;
    files: File[];
    thumbnailsFor: string;
};

export type JobInfo = {
    status: string;
    progress?: number;
};
