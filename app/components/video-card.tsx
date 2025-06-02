import { Video } from '../types';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '../utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { timeAgo } from '../utils';
export default function VideoCard({ job }: { job: Video }) {
    const router = useRouter();
    return (
        <Card
            className={`w-[420px] h-[275px] border-0 shadow-none ${
                job.status === 'completed'
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-80'
            }`}
            onClick={() => {
                if (job.status === 'completed') {
                    router.push(`/watch?videoId=${job.id}`);
                }
            }}
        >
            <CardContent className="relative">
                {job.thumbnail ? (
                    <>
                        <img
                            src={job.thumbnail}
                            alt={job.title || 'Video thumbnail'}
                            className={`w-full rounded-lg transition-all ${
                                job.status === 'completed'
                                    ? 'hover:ring-2 hover:ring-primary'
                                    : ''
                            }`}
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                            }}
                        />
                        {job.duration && (
                            <div className="absolute bottom-2 right-4 bg-black/30 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(job.duration)}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                        Thumbnail not available
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="font-bold truncate max-w-[200px]">
                    {job.title}
                </span>
                <span className="text-sm text-muted-foreground">
                    {timeAgo(job.created_at)}
                </span>
            </CardFooter>
        </Card>
    );
}
