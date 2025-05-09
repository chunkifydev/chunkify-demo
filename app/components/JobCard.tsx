import { JobWithFiles } from '../api/store';
import { Badge } from '@/components/ui/badge';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function JobCard({ job }: { job: JobWithFiles }) {
    return (
        <Card className="w-[400px]">
            <CardContent>
                {job.files[0]?.url ? (
                    <video
                        controls
                        className="w-full rounded-lg"
                        src={job.files[0].url}
                        poster={job.thumbnail}
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                        Video not available yet
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="font-medium">{job.metadata?.title}</span>
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
