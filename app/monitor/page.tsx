'use client';

import { useState } from 'react';
import VideoTable from './video-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { useVideos } from '../hooks/use-videos';
import { useSort } from '../hooks/use-sort';
export default function Monitor() {
    const { videos, loading } = useVideos({
        pollInterval: 2000,
    });

    const { sortedVideos, sortOrder, toggleSort } = useSort(videos);

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
                    onClick={toggleSort}
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
