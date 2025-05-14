'use client';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { createUpload } from '@/app/actions/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { insertUpload, insertVideo } from '@/app/db/store';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function FileUpload() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState<string>('');

    //For metadata
    const [title, setTitle] = useState('');

    const onDrop = async (acceptedFiles: File[]) => {
        setIsUploaded(false);
        setProgress(0);
        setIsUploading(true);
        setError(null);
        setFileName(acceptedFiles[0].name); // Store the filename
        try {
            const file = acceptedFiles[0];
            // Create upload entry using server function
            const upload = await createUpload(title);

            // Upload file to pre-signed URL using XMLHttpRequest for progress
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
                // Simulate delay before sending

                xhr.send(file);
            });

            await insertUpload(upload);
            await insertVideo(upload.metadata?.demo_id, title);
            setIsUploaded(true);
            setOpen(false);
            router.push('/monitor');
        } catch (err) {
            setError('Upload failed: ' + err);
        } finally {
            setIsUploading(false);
            setIsUploaded(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    {!isUploading && (
                        <>
                            <div className="grid w-1/2 max-w-sm items-center gap-1.5">
                                <Label htmlFor="title">Video Title</Label>
                                <Input
                                    type="title"
                                    id="title"
                                    placeholder="Enter video title"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div
                                {...getRootProps()}
                                className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the files here ...</p>
                                ) : (
                                    <p>
                                        Select a video file to start transcoding
                                    </p>
                                )}
                                {error && (
                                    <p className="text-red-500">{error}</p>
                                )}
                            </div>
                        </>
                    )}
                    {isUploading && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">
                                    Uploading {fileName}
                                </p>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500" />
                                <p className="text-green-500 font-medium">
                                    {progress.toFixed(0)}%
                                </p>
                            </div>
                            <Progress
                                value={progress}
                                className="w-[70%] [&>div]:bg-green-500"
                            />
                        </div>
                    )}
                    {isUploaded && (
                        <p className="text-green-500">Upload done!</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
