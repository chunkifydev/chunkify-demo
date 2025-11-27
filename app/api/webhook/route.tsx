import { NextRequest, NextResponse } from 'next/server';
import Chunkify from 'chunkify';
import crypto from 'crypto';

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

import { client } from '../../client';


export async function POST(req: NextRequest) {

     // Get the raw body as text
     const rawBody = await req.text();

  
     // Convert Next.js Headers to Record<string, string>
     const headers: Record<string, string> = {};
     req.headers.forEach((value, key) => {
         headers[key.toLowerCase()] = value; // ← Force en minuscules
     });

    //
    const webhookId = headers['webhook-id'];
    const timestamp = headers['webhook-timestamp'];
    const signature = headers['webhook-signature'];
    const secret = client.webhookKey || '';

    if (webhookId && timestamp && signature && secret) {
        debugSignature(rawBody, webhookId, timestamp, signature, secret);
    }

    // Unwrap the webhook will also verify the signature using the secret key
     let body: Chunkify.UnwrapWebhookEvent;
     try {
        body = client.webhooks.unwrap(rawBody, { headers });
     } catch (error) {
        console.error('Error unwrapping webhook:', error);
        return NextResponse.json({ error: 'Failed to unwrap webhook' }, { status: 500 });
     }

    const event = body.event; // e.g., "upload.completed", "job.completed", "job.failed"
    console.log('Webhook event received:', event);

    switch (event) {
        case 'upload.completed': {
            const payload = body.data as Chunkify.UnwrapWebhookEvent.NotificationPayloadUploadCompleted

            console.log('Upload notification');
            if (payload) {
                if ( payload.upload.metadata?.demo_id && await getVideoById(payload.upload.metadata?.demo_id)) {
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
                            await updateVideo(
                                payload.upload.metadata?.demo_id,
                                {
                                    status: 'failed',
                                }
                            );
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
            const payload = body.data as Chunkify.UnwrapWebhookEvent.NotificationPayloadUploadFailed;
            if (payload && payload.upload.metadata?.demo_id) {
                await updateVideo(payload.upload.metadata.demo_id, {
                    status: 'failed',
                });
            }
            break;
        }
        case 'job.completed': {
            const payload = body.data as Chunkify.UnwrapWebhookEvent.NotificationPayloadJobCompleted;

            if (payload && payload.job.id && payload.job.metadata?.demo_id) {
                // update the job files and status since it's finished
                await updateVideo(payload.job.metadata?.demo_id, {
                    status: 'completed',
                    files: payload.files,
                });
            }
            // If this an image job, add thumbnail or sprite to the associated video
            if (payload.job.format.id === 'jpg') {
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
            const payload = body.data as Chunkify.UnwrapWebhookEvent.NotificationPayloadJobFailed;

            if (payload && payload.job.id && payload.job.metadata?.demo_id) {
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

function debugSignature(body: string, webhookId: string, timestampStr: string, receivedSig: string, secret: string) {
    // Décoder le secret (enlever whsec_ si présent)
    let secretKey = secret;
    if (secretKey.startsWith('whsec_')) {
        secretKey = secretKey.substring(6);
    }
    const secretBytes = Buffer.from(secretKey, 'base64');
    
    // Convertir le timestamp string en nombre (comme la lib le fait)
    const timestampNumber = Math.floor(parseInt(timestampStr, 10));
    
    // Construire le message exact comme la lib
    const message = `${webhookId}.${timestampNumber}.${body}`;
    
    // Calculer HMAC-SHA256 (comme la lib avec fast-sha256)
    const hmac = crypto.createHmac('sha256', secretBytes);
    hmac.update(message);
    const calculatedSig = `v1,${hmac.digest('base64')}`;
    
    console.log('=== SIGNATURE DEBUG ===');
    console.log('webhook-id:', webhookId);
    console.log('webhook-timestamp (string):', timestampStr);
    console.log('webhook-timestamp (number):', timestampNumber);
    console.log('Body length:', body.length);
    console.log('Message to sign (first 200):', message.substring(0, 200));
    console.log('Message length:', message.length);
    console.log('Secret (first 15):', secret.substring(0, 15));
    console.log('Calculated signature:', calculatedSig);
    console.log('Received signature:', receivedSig);
    console.log('Match:', calculatedSig === receivedSig);
    console.log('========================');
}
