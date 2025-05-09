'use client';
import { useState, useEffect } from 'react';
import { Upload } from 'chunkify';
import FileUpload from './FileUpload';
import StatusMessages from './StatusMessages';
import JobCard from './JobCard';
import { NotificationPayloadJobCompletedData } from 'chunkify';
interface Props {
    resetStore: () => Promise<void>;
    createUpload: (name: string) => Promise<Upload>;
    setUploadStore: (upload: Upload) => Promise<void>;
    getJobStore: () => Promise<NotificationPayloadJobCompletedData[]>;
}

export default function ChunkifyDemo({
    resetStore,
    createUpload,
    setUploadStore,
    getJobStore,
}: Props) {
    const [uploadedId, setUploadedId] = useState<string | null>(null);
    const [isUploadConfirmed, setIsUploadConfirmed] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [job, setJob] = useState<NotificationPayloadJobCompletedData | null>(
        null
    );

    // Get job from store when isFinished is true
    useEffect(() => {
        if (isFinished) {
            const fetchJob = async () => {
                const jobs = await getJobStore();
                const videoJob = jobs.find(
                    (job) => job.job.format.name === 'mp4/x264'
                );
                if (videoJob) {
                    setJob(videoJob);
                }
            };
            fetchJob();
        }
    }, [isFinished, getJobStore]);

    const handleReset = async () => {
        // Reset all states
        setUploadedId(null);
        setIsUploadConfirmed(false);
        setIsFinished(false);
        // Reset store using server action
        await resetStore();
    };

    // Reset store on page refresh
    useEffect(() => {
        handleReset();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <FileUpload
                createUpload={createUpload}
                uploadedId={uploadedId}
                setUploadedId={setUploadedId}
                setUploadStore={setUploadStore}
                reset={handleReset}
            />
            <StatusMessages
                uploadedId={uploadedId}
                isUploadConfirmed={isUploadConfirmed}
                isFinished={isFinished}
                setIsFinished={setIsFinished}
                setIsUploadConfirmed={setIsUploadConfirmed}
            />
            {isFinished && job && <JobCard job={job} />}
        </div>
    );
}
