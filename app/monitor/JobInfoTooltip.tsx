'use client';

import { useEffect, useState } from 'react';
import { getJobInfo } from '../actions/actions';
import { JobInfo } from '../types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function JobInfoTooltip({ job_id }: { job_id: string }) {
    const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchJobInfo = async () => {
        // Only show loading on first fetch
        if (!hasLoaded) {
            setIsLoading(true);
        }

        try {
            const info = await getJobInfo(job_id);
            setJobInfo(info);
            setHasLoaded(true);
        } catch (error) {
            console.error('Failed to fetch job info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onMouseEnter={fetchJobInfo}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Loading...</span>
                        </div>
                    ) : jobInfo ? (
                        <div className="flex flex-col gap-1">
                            <span>Status: {jobInfo.status}</span>
                            {jobInfo.progress !== undefined && (
                                <span>Progress: {jobInfo.progress}%</span>
                            )}
                        </div>
                    ) : (
                        <span>Failed to load info</span>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
