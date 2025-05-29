'use client';
import { useState } from 'react';
import VideoCard from './VideoCard';
import { useSort } from '../hooks/useSort';
import FileUpload from './FileUpload';
import { Button } from '@/components/ui/button';
import { useVideos } from '../hooks/useVideos';
import { ArrowUpDown } from 'lucide-react';
export default function VideosIndex({ searchQuery }: { searchQuery: string }) {
    const { videos, loading } = useVideos({
        filterStatus: ['completed'],
        searchQuery,
        pollInterval: 2000,
    });

    const { sortedVideos, sortOrder, toggleSort } = useSort(videos);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center mt-16">
                <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-gray-500">Loading videos...</p>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {videos.length > 0 ? (
                <>
                    <div className="w-full mb-4 flex justify-end"></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleSort}
                                className="flex items-center gap-2"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                {sortOrder === 'asc'
                                    ? 'Oldest first'
                                    : 'Latest first'}
                            </Button>
                        </div>
                        {sortedVideos.map((job) => (
                            <VideoCard
                                key={job.id}
                                job={job}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-4 items-center justify-center mt-16">
                    <p className="text">
                        No Video found in your library. Upload a video to get
                        started
                    </p>
                    <p className="text-xs">
                        For this demo to work you need to setup the
                        notifications proxy from the chunkify CLI. The url to
                        use is <code>http://localhost:3000/api/webhook</code>
                    </p>

                    <FileUpload />
                </div>
            )}
        </div>
    );
}
