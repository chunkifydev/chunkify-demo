import { NextRequest, NextResponse } from 'next/server';
import {
    getUploadStore,
    getJobStore,
    addJobToStore,
    updateUploadStore,
    JobWithFiles,
    updateJobStore,
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
            if (upload) {
                if (await updateUploadStore(upload)) {
                    console.log('Upload found in the store:', upload.id);
                    if (upload.source_id) {
                        // Creating jobs from the source
                        console.log(
                            'Creating jobs from the source:',
                            upload.id
                        );
                        try {
                            const jobVideo = await createJob(upload, 'video');
                            await updateJobStore(
                                jobVideo,
                                jobVideo.metadata?.demo_id
                            );
                            const jobImage = await createJob(upload, 'image');
                            await addJobToStore(jobImage);
                            console.log('Created jobs:', jobVideo, jobImage);
                        } catch (error) {
                            console.error('Error creating jobs:', error);
                        }
                    } else {
                        console.log(
                            'No source_id found for upload:',
                            upload.id
                        );
                        throw new Error(
                            'Cannot create job.No source_id found for this upload'
                        );
                    }
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

                await updateJobStore(jobWithFiles);
                // If image jobs add thumbnail from it to the associated videoJob
                if (jobWithFiles.format.name === 'jpg') {
                    console.log(
                        'Image job completed, adding thumbnail to video job'
                    );
                    await addThumbnailFrom(jobWithFiles, jobStore);
                }
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
                await updateJobStore(jobWithFiles);
            }
            break;
        }
        // Add more cases as needed
        default:
            console.log('Unhandled event:', event);
    }

    return NextResponse.json({ ok: true });
}

async function createJob(upload: Upload, format: 'video' | 'image') {
    let conf = {};
    if (format === 'image') {
        conf = {
            interval: 60,
        };
    }
    const params: JobCreateParams = {
        source_id: upload.source_id,
        format: {
            name: format === 'video' ? 'mp4/x264' : 'jpg',
            config: conf,
        },
        ...(upload.metadata && { metadata: upload.metadata }),
    };

    const job = await client.job.create(params);
    const jobWithFiles: JobWithFiles = {
        ...job,
        files: [],
    };

    return jobWithFiles;
}

async function addThumbnailFrom(
    jobCompleted: JobWithFiles,
    jobStore: JobWithFiles[]
) {
    const job = jobStore.find(
        (job) =>
            job.metadata?.demo_id === jobCompleted.metadata?.demo_id &&
            job.format.name !== 'jpg'
    );
    if (job && jobCompleted.files.length > 0) {
        console.log('Video job found, adding thumbnail from image job');
        // Take a thunmbnail that is middle of the video roughly
        const thumbnailIndex = Math.floor(jobCompleted.files.length / 2);
        job.thumbnail = jobCompleted.files[thumbnailIndex].url;
        await updateJobStore(job);
    }
}
