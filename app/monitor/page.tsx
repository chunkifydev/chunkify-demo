'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Video } from '@/app/types';
import { useState, useEffect } from 'react';
import { allVideos } from '@/app/db/store';
import { timeAgo } from '../utils';
import { Badge } from '@/components/ui/badge';

export default function Monitor() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            const jobs = await allVideos(['waiting', 'processing', 'error']);
            setVideos(jobs);
            setLoading(false);
        };

        // Fetch immediately
        fetchJobs();

        // Then set up interval
        const interval = setInterval(fetchJobs, 5000);

        // Cleanup
        return () => clearInterval(interval);
    }, []);

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

    if (videos.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center mt-32">
                <p className="text-sm text-gray-500">
                    No videos in error or processing right now
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Video ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell>{video.title}</TableCell>
                            <TableCell>{video.id}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        video.status === 'error'
                                            ? 'destructive'
                                            : 'pending'
                                    }
                                    className="w-28 flex items-center justify-center gap-2"
                                >
                                    {video.status}
                                    {video.status !== 'error' && (
                                        <div className="inline-block animate-spin h-3 w-3 border-2 border-current rounded-full border-t-transparent" />
                                    )}
                                </Badge>
                            </TableCell>
                            <TableCell>{timeAgo(video.created_at)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
