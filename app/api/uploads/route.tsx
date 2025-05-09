import { NextResponse } from 'next/server';
import { getUploadStore } from '../store';

export async function GET() {
    const upload = await getUploadStore();
    return NextResponse.json({ upload });
}
