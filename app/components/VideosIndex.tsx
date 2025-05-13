'use client';
import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { VideoJob } from '../types';
import { allVideos } from '../db/store';
import FileUpload from './FileUpload';

export default function VideosIndex({ searchQuery }: { searchQuery: string }) {
    const [videos, setVideos] = useState<VideoJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            const jobs = await allVideos();
            if (searchQuery) {
                console.log('searchQuery', searchQuery);
                const filteredVideos = jobs.filter((job) =>
                    job.title?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setVideos(filteredVideos);
            } else {
                setVideos(jobs);
            }
            setLoading(false);
        };

        // Fetch immediately
        fetchJobs();

        // Then set up interval
        const interval = setInterval(fetchJobs, 1000);

        // Cleanup
        return () => clearInterval(interval);
    }, [searchQuery]);

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
        <div className="flex-1 flex items-center justify-center">
            {videos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {videos.map((job) => (
                        <VideoCard
                            key={job.id}
                            job={job}
                        />
                    ))}
                </div>
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
