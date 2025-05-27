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
    verifyNotificationSignature,
} from 'chunkify';

export async function POST(req: NextRequest) {
    // Get the signature from the header
    const headers = req.headers;
    const signature = headers.get('X-Chunkify-Signature');
    console.log('signature', signature);

    // Check if the signature is here
    if (!signature) {
        console.error('Missing X-Chunkify-Signature header');
        return NextResponse.json(
            { error: 'Missing X-Chunkify-Signature header' },
            { status: 401 }
        );
    }

    if (!process.env.CHUNKIFY_WEBHOOK_SECRET) {
        console.error('Missing CHUNKIFY_WEBHOOK_SECRET');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    // Get the raw body as text
    const rawBody = await req.text();

    // Verify the signature with the raw body
    const verified = verifyNotificationSignature(
        rawBody,
        signature,
        process.env.CHUNKIFY_WEBHOOK_SECRET
    );

    // If the signature is not verified, return a 401 error
    if (!verified) {
        console.error('Invalid X-Chunkify-Signature header');
        return NextResponse.json(
            { error: 'Invalid X-Chunkify-Signature header' },
            { status: 401 }
        );
    }

    // Parse the body of the request
    const body = JSON.parse(rawBody);

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
                                source_id: jobVideo.source_id,
                                status: jobVideo.status,
                                duration: payload.source.duration,
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
                            'Cannot create job. No source_id found for this upload'
                        );
                    }
                }
            }
            break;
        }
        case 'upload.failed': {
            const upload = body.data?.upload as Upload | undefined;
            if (upload && upload.metadata?.demo_id) {
                await updateVideo(upload.metadata?.demo_id, {
                    status: 'failed',
                });
            }
            break;
        }
        case 'job.completed': {
            const payload = body.data as NotificationPayloadJobCompletedData;

            if (payload && payload.job.id && payload.job.metadata?.demo_id) {
                // update the job files and status since it's finished
                await updateVideo(payload.job.metadata?.demo_id, {
                    status: 'completed',
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
                    status: 'failed',
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
