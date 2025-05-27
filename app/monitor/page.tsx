'use client';

import { Video } from '@/app/types';
import { useState, useEffect } from 'react';
import { allVideos } from '@/app/db/store';
import VideoTable from './VideoTable';

export default function Monitor() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            const videos = await allVideos(undefined, 'desc');
            setVideos(videos);
            setLoading(false);
        };

        // Fetch immediately
        fetchJobs();

        // Then set up interval
        const interval = setInterval(fetchJobs, 3000);

        // Cleanup
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center mt-32">
                <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-gray-500">Loading...</p>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <VideoTable videos={videos} />
        </div>
    );
}
