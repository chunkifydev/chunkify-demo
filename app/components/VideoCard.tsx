import { VideoJob } from '../types';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function VideoCard({ job }: { job: VideoJob }) {
    const router = useRouter();
    return (
        <Card
            className={`w-[420px] h-[275px] ${
                job.status === 'finished'
                    ? 'cursor-pointer hover:shadow-lg transition-shadow'
                    : 'cursor-not-allowed opacity-80'
            }`}
            onClick={() => {
                if (job.status === 'finished') {
                    router.push(`/watch?videoId=${job.id}`);
                }
            }}
        >
            <CardContent>
                {job.thumbnail ? (
                    <img
                        src={job.thumbnail}
                        alt={job.title || 'Video thumbnail'}
                        className="w-full rounded-lg"
                        style={{
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                        Thumbnail not available
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="font-medium">{job.title}</span>
                <Badge
                    variant={
                        job.status === 'finished'
                            ? 'success'
                            : job.status === 'error'
                            ? 'destructive'
                            : 'pending'
                    }
                >
                    {job.status}
                </Badge>
            </CardFooter>
        </Card>
    );
}
