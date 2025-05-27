'use client';

import { Video } from '@/app/types';
import { useState, useEffect } from 'react';
import { allVideos } from '@/app/db/store';
import VideoTable from './VideoTable';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export default function Monitor() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

    const sortedVideos = [...videos].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

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
        <div className="container mx-auto px-4 py-12 flex flex-col gap-4 items-center">
            <div className="w-3/4">
                {' '}
                {/* Add this wrapper div with w-3/4 */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                    className="flex items-center gap-2 mb-4"
                >
                    <ArrowUpDown className="h-4 w-4" />
                    {sortOrder === 'asc' ? 'Oldest first' : 'Latest first'}
                </Button>
                <VideoTable videos={sortedVideos} />
            </div>
        </div>
    );
}
