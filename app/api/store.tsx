import { Upload, NotificationPayloadJobCompletedData } from 'chunkify';

// In-memory store for demo
export const uploadsStore: Record<string, Upload> = {};
export const jobsStore: Record<string, NotificationPayloadJobCompletedData> =
    {};
