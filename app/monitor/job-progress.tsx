'use client';

import { useEffect, useState } from 'react';
import { getJobInfo } from '../actions/actions';
import { JobInfo } from '../types';
import { Progress } from '@/components/ui/progress';

export default function JobProgress({
    job_id,
    status,
}: {
    job_id: string;
    status: string;
}) {
    const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);

    const fetchJobInfo = async () => {
        // Only show loading on first fetch
        try {
            const info = await getJobInfo(job_id);
            // Only update if the new progress is higher than current
            setJobInfo((prev) => {
                if (!prev || info.progress > (prev.progress || 0)) {
                    return info;
                }
                return prev;
            });
        } catch (error) {
            console.error('Failed to fetch job info:', error);
        }
    };

    useEffect(() => {
        // Only start polling if status is 'processing'
        if (status === 'processing') {
            fetchJobInfo();
            const interval = setInterval(fetchJobInfo, 3000);
            return () => clearInterval(interval);
        }
    }, [job_id, status]);

    // Only render progress if status is 'processing'
    if (status !== 'processing') return null;

    return (
        <div className="flex items-center gap-2">
            <Progress
                value={jobInfo?.progress}
                className="w-full"
            />
            <span className="text-sm">
                {Math.round(jobInfo?.progress || 0)}%
            </span>
        </div>
    );
}
