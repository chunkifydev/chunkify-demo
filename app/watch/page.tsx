'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VideoJob } from '../types';
import { getVideoById } from '../db/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function WatchPage() {
    const videoId = useSearchParams().get('videoId');
    const [video, setVideo] = useState<VideoJob | null>(null);

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
            <Card className="w-full max-w-5xl mx-auto border-0 shadow-none">
                <CardContent className="p-0">
                    {video.files && video.files[0]?.url ? (
                        <video
                            controls
                            className="w-full rounded-lg"
                            src={video.files[0].url}
                            poster={video.thumbnail ?? undefined}
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                aspectRatio: '16/9',
                                objectFit: 'contain',
                            }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                            Video not available
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold">
                            {video.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {timeAgo(video.created_at)}
                        </span>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            if (video.files?.[0]?.url) {
                                window.open(video.files[0].url, '_blank');
                            }
                        }}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function timeAgo(date: string) {
    const now = new Date();
    const created = new Date(date);
    const diffInSeconds = Math.floor(
        (now.getTime() - created.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}
