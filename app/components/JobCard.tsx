import { JobWithFiles } from '../api/store';

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
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <video
                    controls
                    className="w-full rounded-lg"
                    src={job.files[0]?.url}
                >
                    Your browser does not support the video tag.
                </video>
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="font-medium">{job.metadata?.title}</span>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 rounded ${
                            job.status === 'finished'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'error'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                        {job.status}
                    </span>
                    <span className="text-gray-500">{job.format.name}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
