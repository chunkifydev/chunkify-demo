'use client';
import { useEffect, useState } from 'react';
import { Upload } from 'chunkify';
import { JobWithFiles } from '../api/store';
interface Props {
    uploadedId: string | null;
    isUploadConfirmed: boolean;
    isFinished: boolean;
    setIsFinished: (isFinished: boolean) => void;
    setIsUploadConfirmed: (isUploadConfirmed: boolean) => void;
    getJobStore: () => Promise<JobWithFiles[]>;
    getUploadStore: () => Promise<Upload[]>;
}

export default function StatusMessages({
    uploadedId,
    isUploadConfirmed,
    isFinished,
    setIsFinished,
    setIsUploadConfirmed,
    getJobStore,
    getUploadStore,
}: Props) {
    const [jobs, setJobs] = useState<JobWithFiles[]>([]);
    const [upload, setUpload] = useState<Upload[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchJobs = async () => {
            try {
                const jobs = await getJobStore();
                if (isMounted) {
                    setJobs([...jobs]);
                    // Check if all jobs are finished or error
                    if (
                        jobs.length === 2 &&
                        jobs.every(
                            (job: JobWithFiles) =>
                                job.status === 'finished' ||
                                job.status === 'error'
                        )
                    ) {
                        setIsFinished(true);
                    }
                }
            } catch (e) {}
        };

        const fetchUpload = async () => {
            try {
                const upload = await getUploadStore();
                // If we have an upload in the store, it means it's confirmed
                if (upload.length > 0 && upload[0]?.status === 'completed') {
                    setIsUploadConfirmed(true);
                }
            } catch (e) {}
        };

        fetchUpload();
        fetchJobs();
        const uploadInterval = setInterval(fetchUpload, 1000);
        const jobInterval = setInterval(fetchJobs, 2000);

        return () => {
            isMounted = false;
            clearInterval(uploadInterval);
            clearInterval(jobInterval);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {uploadedId && (
                <div>
                    <p>
                        <span
                            className={
                                !isUploadConfirmed ? 'animate-pulse' : ''
                            }
                        >
                            Waiting for the upload confirmation from chunkify...
                        </span>
                    </p>
                    <p className="mt-2">
                        {isUploadConfirmed && (
                            <span>
                                Upload confirmed
                                <svg
                                    className="inline-block w-5 h-5 text-green-500 ml-2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                    />
                                </svg>
                            </span>
                        )}
                    </p>
                </div>
            )}
            {jobs.length === 2 && (
                <div>
                    <p>
                        <span>
                            Jobs created
                            <svg
                                className="inline-block w-5 h-5 text-green-500 ml-2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                />
                            </svg>
                        </span>
                    </p>
                    <p className="mt-2">
                        <span className={!isFinished ? 'animate-pulse' : ''}>
                            Transcoding in progress...
                        </span>
                        {jobs.some((job) => job.status === 'error') && (
                            <span className="text-red-500 ml-2">
                                Error: One or more jobs failed to process
                            </span>
                        )}
                    </p>
                </div>
            )}
            {isFinished && (
                <p className="mt-2">
                    <span>
                        All done!
                        <svg
                            className="inline-block w-5 h-5 text-green-500 ml-2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            />
                        </svg>
                    </span>
                </p>
            )}
        </div>
    );
}
