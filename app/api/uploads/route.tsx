import { uploadsStore } from '../store';
import { NextResponse } from 'next/server';

export async function GET() {
    // Return all uploads as an array
    return NextResponse.json({ uploads: Object.values(uploadsStore) });
}
