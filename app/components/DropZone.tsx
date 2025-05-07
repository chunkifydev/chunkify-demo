'use client';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { Upload } from 'chunkify';

export default function DropZone({
    createUpload,
}: {
    createUpload: (name: string) => Promise<Upload>;
}) {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedId, setUploadedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    //For metadata
    const [name, setName] = useState('');

    // Check if upload is confirmed
    useEffect(() => {
        if (uploadedId) {
            const checkUpload = async () => {
                try {
                    const res = await fetch('/api/uploads');
                    const data = await res.json();
                    const uploads = data.uploads as Upload[];
                    // If we find our uploadId in the store, it means it's confirmed
                    if (uploads.some((upload) => upload.id === uploadedId)) {
                        setIsConfirmed(true);
                    }
                } catch (e) {
                    console.error('Error checking upload:', e);
                }
            };

            const interval = setInterval(checkUpload, 2000);
            return () => clearInterval(interval);
        }
    }, [uploadedId]);

    const onDrop = async (acceptedFiles: File[]) => {
        setUploadedId(null);
        setIsConfirmed(false);
        setUploading(true);
        setError(null);
        try {
            const file = acceptedFiles[0];
            // 1. Create upload entry using server function
            const upload = await createUpload(name);

            // 2. Upload file to pre-signed URL using XMLHttpRequest for progress
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete =
                            (event.loaded / event.total) * 100;
                        setProgress(percentComplete);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error('Upload failed'));
                    }
                };

                xhr.onerror = () => reject(new Error('Upload failed'));

                xhr.open('PUT', upload.upload_url);
                xhr.setRequestHeader(
                    'Content-Type',
                    'application/octet-stream'
                );
                xhr.send(file);
            });

            setUploadedId(upload.id);
        } catch (err) {
            setError('Upload failed: ' + err);
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div className="flex flex-col gap-4">
            <div
                {...getRootProps()}
                className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop a file here, or click to select</p>
                )}
                {uploading && (
                    <div className="mt-4">
                        <p className="text-blue-500">
                            Uploading: {progress.toFixed(0)}%
                        </p>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {uploadedId && (
                    <p className="text-green-500">Upload completed!</p>
                )}
            </div>
            <div>
                {uploadedId && !isConfirmed && (
                    <p>
                        <span className="animate-pulse">
                            Waiting for the confirmation from the server...
                        </span>
                    </p>
                )}
                {isConfirmed && (
                    <p>
                        <span className="animate-pulse">
                            Upload confirmed, source created, starting the
                            transcoding now
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}
