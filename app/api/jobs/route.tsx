import { NextResponse } from 'next/server';

import { getJobStore } from '../store';

export async function GET() {
    // Return all jobs as an array
    const jobStore = await getJobStore();
    return NextResponse.json({ jobs: jobStore });
}
