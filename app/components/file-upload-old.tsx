'use client';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { createUpload } from '@/app/actions/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { insertVideo } from '@/app/db/store';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChunkifyUploader } from 'chunkify-uploader/react';

export default function FileUpload() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState<string>('');

    //For metadata
    const [title, setTitle] = useState('');

    const onDrop = async (acceptedFiles: File[]) => {
        setProgress(0);
        setIsUploading(true);
        setError(null);
        setFileName(acceptedFiles[0].name); // Store the filename
        try {
            const file = acceptedFiles[0];
            // Create upload entry using server function
            const upload = await createUpload();

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

                xhr.send(file);
            });

            await insertVideo(upload.metadata?.demo_id, title);
            setOpen(false);
            router.push('/monitor');
        } catch (err) {
            setError('Upload failed: ' + err);
        } finally {
            setIsUploading(false);
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
            <DialogContent className="sm:max-w-[600px]">
                <div className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                        <h2 className="text-lg font-semibold">
                            Upload a video
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Upload a video to start transcoding it!
                        </p>
                    </div>
                    <div className="h-px bg-border -mx-6" />
                    {!isUploading && (
                        <>
                            <div className="grid w-fullmax-w-sm items-center gap-1.5">
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
                                className="p-6 rounded-lg text-center cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-sm text-muted-foreground">
                                        Drag and drop your video here
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="gap-2 cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Select video
                                    </Button>
                                </div>
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                        </>
                    )}
                    {isUploading && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">
                                    Uploading {fileName}
                                </p>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                                <p className="font-medium">
                                    {progress.toFixed(0)}%
                                </p>
                            </div>
                            <Progress
                                value={progress}
                                className="w-[70%]"
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
