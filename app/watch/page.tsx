'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Video } from '../types';
import { getVideoById } from '../db/store';
import Player from './Player';

export default function WatchPage() {
    const videoId = useSearchParams().get('videoId');
    const [video, setVideo] = useState<Video | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            if (!videoId) return;
            const foundVideo = await getVideoById(videoId);
            if (foundVideo) {
                setVideo(foundVideo);
            }
        };
        fetchVideo();
    }, [videoId]);

    if (!videoId) {
        return <div>No video ID provided</div>;
    }

    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Player video={video} />
        </div>
    );
}
