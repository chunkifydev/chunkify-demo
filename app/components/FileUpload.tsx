'use client';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { Upload } from 'chunkify';

interface Props {
    createUpload: (name: string) => Promise<Upload>;
    uploadedId: string | null;
    setUploadedId: (id: string) => void;
    setUploadStore: (upload: Upload) => Promise<void>;
    reset: () => Promise<void>;
}

export default function FileUpload({
    createUpload,
    uploadedId,
    setUploadedId,
    setUploadStore,
    reset,
}: Props) {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //For metadata
    const [name, setName] = useState('');

    const onDrop = async (acceptedFiles: File[]) => {
        await reset();
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
            await setUploadStore(upload);
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
                    <p>
                        Drag 'n' drop a file here, or click to select a file and
                        start transcoding
                    </p>
                )}
                {uploading && (
                    <div className="mt-4">
                        <p className="text-blue-500">
                            Uploading: {progress.toFixed(0)}%
                        </p>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {uploadedId && <p className="text-green-500">Upload sent!</p>}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter video name"
                    className="px-3 py-2 border rounded-md"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
        </div>
    );
}
