import { Video } from '../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { timeAgo } from '../utils';

export default function Player({ video }: { video: Video }) {
    return (
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
    );
}
