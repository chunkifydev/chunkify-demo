import { NextRequest, NextResponse } from 'next/server';

import {
    addThumbnail,
    addSprite,
    updateVideo,
    getVideoById,
} from '../../db/store';
import {
    createVideoJob,
    createImageJob,
    createSpriteJob,
} from '../../actions/actions';
import {
    Upload,
    NotificationPayloadJobCompletedData,
    NotificationPayloadUploadCompletedData,
} from 'chunkify';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const event = body.event; // e.g., "upload.completed", "job.completed", "job.failed"
    console.log('Webhook event received:', event);

    switch (event) {
        case 'upload.completed': {
            const payload = body.data as NotificationPayloadUploadCompletedData;

            console.log('Upload notification');
            if (payload) {
                if (await getVideoById(payload.upload.metadata?.demo_id)) {
                    if (payload.upload.source_id) {
                        // Create jobs from the source
                        try {
                            const jobVideo = await createVideoJob(
                                payload.upload
                            );
                            await updateVideo(jobVideo.id, {
                                job_id: jobVideo.job_id,
                                status: jobVideo.status,
                            });
                            const jobImage = await createImageJob(
                                payload.upload,
                                payload.source.duration
                            );
                            const jobSprite = await createSpriteJob(
                                payload.upload,
                                payload.source.duration
                            );
                            console.log(
                                'Created jobs:',
                                jobVideo,
                                jobImage,
                                jobSprite
                            );
                        } catch (error) {
                            console.error('Error creating jobs:', error);
                        }
                    } else {
                        console.log(
                            'No source_id found for upload:',
                            payload.upload.id
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
                await updateVideo(upload.metadata?.demo_id, {
                    status: 'error',
                });
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
                await updateVideo(payload.job.metadata?.demo_id, {
                    status: payload.job.status,
                    files: payload.files,
                });
            }
            // If this an image job, add thumbnail or sprite to the associated video
            if (payload.job.format.name === 'jpg') {
                console.log(
                    'Image job completed, adding thumbnail to video job'
                );
                if (payload.job.metadata?.thumbnails_for) {
                    await addThumbnail(
                        payload.job.metadata.thumbnails_for,
                        payload.files
                    );
                }
                if (payload.job.metadata?.sprite_for) {
                    await addSprite(
                        payload.job.metadata.sprite_for,
                        payload.files
                    );
                }
            }
            break;
        }
        case 'job.failed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id) {
                await updateVideo(payload.job.metadata?.demo_id, {
                    status: payload.job.status,
                });
            }
            break;
        }
        // Add more cases as needed
        default:
            console.log('Unhandled event:', event);
    }

    return NextResponse.json({ ok: true });
}
