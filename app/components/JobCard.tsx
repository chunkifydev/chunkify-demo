import { NotificationPayloadJobCompletedData } from 'chunkify';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function JobCard({
    job,
}: {
    job: NotificationPayloadJobCompletedData;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transcoded Video</CardTitle>
                <CardDescription>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Format:</span>
                            <span>{job.job.format.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Started:</span>
                            <span>
                                {new Date(job.job.started_at).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Transcoder:</span>
                            <span>
                                {job.job.transcoder.type} (
                                {job.job.transcoder.quantity})
                            </span>
                        </div>
                    </div>
                </CardDescription>
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
        </Card>
    );
}
