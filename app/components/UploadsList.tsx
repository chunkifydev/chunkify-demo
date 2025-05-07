'use client';
import { useEffect, useState } from 'react';
import { Upload } from 'chunkify';

export default function UploadsList() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchUploads = async () => {
            try {
                const res = await fetch('/api/uploads');
                const data = await res.json();
                if (isMounted) {
                    setUploads(data.uploads);
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

    const handleCreateJob = async (sourceId: string) => {
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ source_id: sourceId }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Job created! Job ID: ${data.job_id}`);
            } else {
                alert(`Failed to create job: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            alert('Network error: ' + err);
        }
    };

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
                    <span className="text-lg">Loading uploads...</span>
                </div>
            ) : uploads.length === 0 ? (
                <div className="text-gray-500 py-8 text-lg">
                    No upload done yet.
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Uploaded sources</h2>
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full border border-gray-200 bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left border-b">
                                        Source ID
                                    </th>
                                    <th className="px-4 py-2 text-left border-b">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left border-b">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploads.map((upload) => (
                                    <tr
                                        key={upload.id}
                                        className="border-b"
                                    >
                                        <td className="px-4 py-2">
                                            {upload.source_id || upload.id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {upload.metadata?.name || (
                                                <span className="text-gray-400 italic">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {upload.source_id && (
                                                <button
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                    onClick={() =>
                                                        handleCreateJob(
                                                            upload.source_id as string
                                                        )
                                                    }
                                                >
                                                    Chunkify
                                                </button>
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
