'use client';
import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { JobWithFiles } from '../api/store';
import FileUpload from './FileUpload';
import { Button } from '@/components/ui/button';

export default function JobsIndex({
    getJobStore,
}: {
    getJobStore: () => Promise<JobWithFiles[]>;
}) {
    const [jobs, setJobs] = useState<JobWithFiles[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            const jobs = await getJobStore();
            const videoJobs = jobs.filter(
                (job) => job.format.name === 'mp4/x264'
            );
            setJobs(videoJobs);
        };

        // Fetch immediately
        fetchJobs();

        // Then set up interval
        const interval = setInterval(fetchJobs, 1000);

        // Cleanup
        return () => clearInterval(interval);
    }, [getJobStore]);

    return (
        <div className="flex-1 flex items-center justify-center">
            {jobs.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4 items-center justify-center mt-16">
                    <p className="text">
                        No Video found in your library. Upload a video to get
                        started
                    </p>
                    <p className="text-xs">
                        For this demo to work you need to setup the
                        notifications proxy from the chunkify CLI. The url to
                        use is <code>http://localhost:3000/api/webhook</code>
                    </p>

                    <FileUpload />
                </div>
            )}
        </div>
    );
}
