'use client';

import { useState, useEffect } from 'react';
import { Video } from '../types';
import { allVideos } from '../db/store';

interface UseVideosOptions {
    filterStatus?: string[];
    searchQuery?: string;
    pollInterval?: number; // in milliseconds
}

export function useVideos({
    filterStatus,
    searchQuery,
    pollInterval = 2000,
}: UseVideosOptions = {}) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalVideosCount, setTotalVideosCount] = useState(0);

    useEffect(() => {
        const fetchVideos = async () => {
            const vids = await allVideos([]);
            // total count
            setTotalVideosCount(vids.length);

            let filteredVideos = vids;

            // Apply status filter if provided
            if (filterStatus?.length) {
                filteredVideos = vids.filter((vid) =>
                    filterStatus.some((status) => vid.status.includes(status))
                );
            }

            // Apply search filter if provided
            if (searchQuery) {
                filteredVideos = filteredVideos.filter((vid) =>
                    vid.title?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setVideos(filteredVideos);
            setLoading(false);
        };

        fetchVideos();

        // Set interval
        const interval = setInterval(fetchVideos, pollInterval);

        // Cleanup
        return () => clearInterval(interval);
    }, [searchQuery]);

    return { videos, loading, totalVideosCount };
}
