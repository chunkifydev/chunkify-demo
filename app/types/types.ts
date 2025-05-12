import { File } from 'chunkify';

export type VideoJob = {
    id: string;
    job_id: string | null;
    title: string | null;
    status: string;
    created_at: string;
    files: File[] | null;
    thumbnail?: string | null;
};

export type ImageJob = {
    job_id: string;
    files: File[];
    thumbnailsFor?: string;
};

export type VideoUpload = {
    id: string;
    source_id: string | null;
    status: string;
    created_at: string;
    metadata: Record<string, any>;
};
