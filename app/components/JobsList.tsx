'use client';
import { useEffect, useState } from 'react';
import { NotificationPayloadJobCompletedData } from 'chunkify';

export default function JobsList() {
    const [jobs, setJobs] = useState<NotificationPayloadJobCompletedData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchUploads = async () => {
            try {
                const res = await fetch('/api/jobs');
                const data = await res.json();
                if (isMounted) {
                    setJobs([...data.jobs]);
                    setLoading(false);
                }
            } catch (e) {
                if (isMounted) setLoading(false);
            }
        };

        fetchUploads();
        const interval = setInterval(fetchUploads, 2000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="mt-8 w-full max-w-2xl mx-auto flex flex-col items-center">
            {loading ? (
                <div className="flex flex-col items-center gap-4 text-gray-500 py-8">
                    <svg
                        className="animate-spin h-16 w-16 text-blue-500"
                        viewBox="0 0 50 50"
                    >
                        <circle
                            className="opacity-25"
                            cx="25"
                            cy="25"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M25 5a20 20 0 0120 20h-5a15 15 0 00-15-15V5z"
                        />
                    </svg>
                    <span className="text-lg">Loading jobs...</span>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-gray-500 py-8 text-lg">
                    No Jobs created yet.
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Transcoding jobs</h2>
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full border border-gray-200 bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left border-b">
                                        Format
                                    </th>
                                    <th className="px-4 py-2 text-left border-b">
                                        status
                                    </th>
                                    <th className="px-4 py-2 text-center border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr
                                        key={job.job.id}
                                        className="border-b"
                                    >
                                        <td className="px-4 py-2">
                                            {job.job.format.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {job.job.status}
                                        </td>
                                        <td>
                                            {job.job.status === 'finished' &&
                                                job.files?.[0]?.url && (
                                                    <a
                                                        href={job.files[0].url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="View result"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            className="text-blue-600 hover:text-blue-800 inline"
                                                        >
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="3"
                                                            />
                                                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                                                        </svg>
                                                    </a>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
