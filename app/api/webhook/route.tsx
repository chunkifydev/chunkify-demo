import { NextRequest, NextResponse } from 'next/server';
import {
    getUploadStore,
    getJobStore,
    setUploadStore,
    addJobToStore,
    resetStore,
    updateJobStore,
    JobWithFiles,
} from '../store';
import {
    Upload,
    Job,
    NotificationPayloadJobCompletedData,
    JobCreateParams,
    FfmpegJpg,
} from 'chunkify';
import { client } from '../../client';

export async function POST(req: NextRequest) {
    const uploadStore = await getUploadStore();
    const jobStore = await getJobStore();
    const body = await req.json();

    const event = body.event; // e.g., "upload.completed", "job.completed", "job.failed"
    console.log('Webhook event received:', event);

    switch (event) {
        case 'upload.completed': {
            const upload = body.data?.upload as Upload | undefined;
            console.log('Upload notification:', upload);
            console.log('Upload store:', uploadStore);
            if (upload && upload?.id === uploadStore[0]?.id) {
                setUploadStore(upload);
                console.log('Stored upload:', upload.id);
                if (upload.source_id) {
                    // Creating jobs from the source
                    console.log('Creating jobs from the source:', upload.id);
                    try {
                        const jobVideo = await createJob(
                            upload.source_id,
                            'video'
                        );
                        addJobToStore(jobVideo);
                        const jobImage = await createJob(
                            upload.source_id,
                            'image'
                        );
                        addJobToStore(jobImage);
                        console.log('Created jobs:', jobVideo, jobImage);
                    } catch (error) {
                        console.error('Error creating jobs:', error);
                    }
                } else {
                    console.log('No source_id found for upload:', upload.id);
                    throw new Error(
                        'Cannot create job.No source_id found for this upload'
                    );
                }
            }

            break;
        }
        case 'job.completed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id) {
                // Convert the payload to a JobWithFiles object
                const jobWithFiles = {
                    ...payload.job,
                    files: payload.files,
                };

                updateJobStore(jobWithFiles);
                console.log('completed job:', payload);
                console.log('Stored job:', payload.job.id);
                console.log('Job Store:', jobStore);
            }
            break;
        }
        case 'job.failed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id) {
                const jobWithFiles = {
                    ...payload.job,
                    files: payload.files,
                };
                updateJobStore(jobWithFiles);
                console.log('failed job:', payload);
                console.log('Stored job:', payload.job.id);
            }
            break;
        }
        // Add more cases as needed
        default:
            console.log('Unhandled event:', event);
    }

    return NextResponse.json({ ok: true });
}

async function createJob(sourceId: string, format: 'video' | 'image') {
    let conf = {};
    if (format === 'image') {
        conf = {
            interval: 60,
        };
    }
    const params: JobCreateParams = {
        source_id: sourceId,
        format: {
            name: format === 'video' ? 'mp4/x264' : 'jpg',
            config: conf,
        },
    };

    const job = await client.job.create(params);
    const jobWithFiles: JobWithFiles = {
        ...job,
        files: [],
    };

    return jobWithFiles;
}
