import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'chunkify';
import { JobCreateParams } from 'chunkify';
import { jobsStore } from '../store';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { source_id } = body;

    if (!source_id) {
        return NextResponse.json(
            { error: 'Missing source_id' },
            { status: 400 }
        );
    }

    // Use your library server-side
    const client = createClient(
        process.env.CHUNKIFY_TEAMK_TOKEN || '',
        process.env.CHUNKIFY_PROJECT_TOKEN || ''
    );

    const params: JobCreateParams = {
        source_id: source_id,
        format: {
            name: 'mp4/x264',
            config: {},
        },
    };
    try {
        console.log('Creating job with params:', params);
        const job = await client.job.create(params);
        console.log('Job created successfully:', job);

        jobsStore[job.id] = { job, files: [] };
        return NextResponse.json({ ok: true, job_id: job.id });
    } catch (error: any) {
        console.error('Job creation error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response,
        });
        return NextResponse.json(
            { error: 'Failed to create job', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return all jobs as an array
    console.log('Jobs Store:', jobsStore);
    return NextResponse.json({ jobs: Object.values(jobsStore) });
}
