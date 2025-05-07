import { NextRequest, NextResponse } from 'next/server';
import { uploadsStore, jobsStore } from '../store';
import {
    Upload,
    Job,
    NotificationPayloadJobCompletedData,
    JobCreateParams,
    FfmpegJpg,
} from 'chunkify';
import { client } from '../../client';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const event = body.event; // e.g., "upload.completed", "job.completed", "job.failed"
    console.log('Webhook event received:', event);

    switch (event) {
        case 'upload.completed': {
            const upload = body.data?.upload as Upload | undefined;
            if (upload && upload.id) {
                uploadsStore[upload.id] = upload;
                console.log('Stored upload:', upload.id);
                if (upload.source_id) {
                    // Creating jobs from the source
                    console.log('Creating jobs from the source:', upload.id);
                    try {
                        const jobVideo = await createJob(
                            upload.source_id,
                            'video'
                        );
                        jobsStore[jobVideo.id] = { job: jobVideo, files: [] };
                        const jobImage = await createJob(
                            upload.source_id,
                            'image'
                        );
                        jobsStore[jobImage.id] = { job: jobImage, files: [] };
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
                jobsStore[payload.job.id] = payload;
                console.log('completed job:', payload);
                console.log('Stored job:', payload.job.id);
                console.log('Job Store:', jobsStore);
            }
            break;
        }
        case 'job.failed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id) {
                jobsStore[payload.job.id] = payload;
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

    return await client.job.create(params);
}
