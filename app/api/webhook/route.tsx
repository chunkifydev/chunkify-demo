import { NextRequest, NextResponse } from 'next/server';

import {
    addThumbnail,
    updateUpload,
    updateVideo,
    updateVideoStatus,
    updateVideoStatusAndFiles,
} from '../../db/store';
import { VideoJob, ImageJob } from '../../types/types';
import { createVideoJob, createImageJob } from '../../actions';
import {
    Upload,
    Job,
    NotificationPayloadJobCompletedData,
    NotificationPayloadUploadFailedData,
    JobCreateParams,
    FfmpegJpg,
    File,
} from 'chunkify';
import { client } from '../../client';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const event = body.event; // e.g., "upload.completed", "job.completed", "job.failed"
    console.log('Webhook event received:', event);

    switch (event) {
        case 'upload.completed': {
            const upload = body.data?.upload as Upload | undefined;
            console.log('Upload notification:', upload);
            if (upload) {
                if (await updateUpload(upload)) {
                    console.log('Upload found in the store:', upload.id);
                    if (upload.source_id) {
                        // Create jobs from the source
                        try {
                            const jobVideo = await createVideoJob(upload);
                            await updateVideo(jobVideo);
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
                //await removeFromUploadStore(upload);
            }
            break;
        }
        case 'upload.failed': {
            const upload = body.data?.upload as Upload | undefined;
            if (upload && upload.metadata?.demo_id) {
                await updateVideoStatus(upload.metadata?.demo_id, 'error');
            }
            if (upload) {
                //await removeFromUploadStore(upload);
            }
            break;
        }
        case 'job.completed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id && payload.job.metadata?.demo_id) {
                // update the job files and status since it's finished
                await updateVideoStatusAndFiles(
                    payload.job.metadata?.demo_id,
                    payload.job.status,
                    payload.files
                );
            }
            // If this an image job, add thumbnail from it to the associated videoJob
            if (payload.job.format.name === 'jpg') {
                console.log(
                    'Image job completed, adding thumbnail to video job'
                );
                await addThumbnail(
                    payload.job.metadata?.thumbnails_for,
                    payload.files
                );
            }
            break;
        }
        case 'job.failed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id) {
                await updateVideoStatus(
                    payload.job.metadata?.demo_id,
                    payload.job.status
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
