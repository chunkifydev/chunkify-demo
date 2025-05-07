import { NextResponse } from 'next/server';

import { jobsStore } from '../store';

export async function GET() {
    // Return all jobs as an array
    return NextResponse.json({ jobs: Object.values(jobsStore) });
}
