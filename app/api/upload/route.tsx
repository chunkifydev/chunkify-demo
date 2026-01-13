import { NextResponse } from 'next/server';
import {
    createUpload,
} from '../../actions/actions';
import Chunkify from '@chunkify/chunkify';

export async function GET() {
    try {
        const upload = await createUpload();

        return NextResponse.json(upload);
    } catch (error) {
        if (error instanceof Chunkify.APIError) {
            console.error(error);
            return NextResponse.json({ error: error.message });
        }
        console.error(error);
        return NextResponse.json({ error: 'Failed to create upload' }, { status: 500 });
    }
}
