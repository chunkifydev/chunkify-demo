import { NextRequest, NextResponse } from 'next/server';
import {
    getUploadStore,
    getJobStore,
    addJobToStore,
    updateUploadStore,
    VideoJob,
    ImageJob,
    updateJob,
} from '../store';
import {
    Upload,
    Job,
    NotificationPayloadJobCompletedData,
    JobCreateParams,
    FfmpegJpg,
    File,
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
                            const jobVideo = await createVideoJob(upload);
                            await updateJob(jobVideo.id, jobVideo.status);
                            const jobImage = await createImageJob(upload);
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
                    id: payload.job.metadata?.demo_id,
                    job_id: payload.job.id,
                    title: payload.job.metadata?.title,
                    created_at: payload.job.created_at,
                    status: payload.job.status,
                    files: payload.files,
                };
                // update the job files and status since it's finished
                await updateJob(
                    payload.job.metadata?.demo_id,
                    payload.job.status,
                    payload.files
                );
                // If this an image job, add thumbnail from it to the associated videoJob
                if (payload.job.format.name === 'jpg') {
                    console.log(
                        'Image job completed, adding thumbnail to video job'
                    );
                    await addThumbnail(
                        payload.job.metadata?.demo_id,
                        payload.files,
                        jobStore
                    );
                }
            }
            break;
        }
        case 'job.failed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id) {
                const jobWithFiles = {
                    ...payload.job,
                };
                await updateJob(
                    jobWithFiles.metadata?.demo_id,
                    jobWithFiles.status
                );
            }
            break;
        }
        // Add more cases as needed
        default:
            console.log('Unhandled event:', event);
    }

    return NextResponse.json({ ok: true });
}

async function createVideoJob(upload: Upload) {
    const params: JobCreateParams = {
        source_id: upload.source_id,
        format: {
            name: 'mp4/x264',
            config: {},
        },
        ...(upload.metadata && { metadata: upload.metadata }),
    };

    const job = await client.job.create(params);
    const VideoJob: VideoJob = {
        id: upload.metadata?.demo_id,
        job_id: job.id,
        status: job.status,
        title: job.metadata?.title,
        created_at: job.created_at,
        files: [],
    };

    return VideoJob;
}

async function createImageJob(upload: Upload) {
    const conf = {
        interval: 60,
    };
    const thumbnailsFor = upload.metadata?.demo_id;

    const params: JobCreateParams = {
        source_id: upload.source_id,
        format: {
            name: 'jpg',
            config: conf,
        },
        ...(upload.metadata && { metadata: upload.metadata }),
    };
    const job = await client.job.create(params);
    const ImageJob: ImageJob = {
        job_id: job.id,
        files: [],
        thumbnailsFor: thumbnailsFor,
    };
    return ImageJob;
}

async function addThumbnail(id: string, files: File[], jobStore: VideoJob[]) {
    const job = jobStore.find((job) => job.id === id);
    if (job && files.length > 0) {
        console.log('Video job found, adding thumbnail from image job');
        // Take a thunmbnail that is middle of the video roughly
        const thumbnailIndex = Math.floor(files.length / 2);
        //Update the job with the thumbnail
        job.thumbnail = files[thumbnailIndex].url;
    }
}
