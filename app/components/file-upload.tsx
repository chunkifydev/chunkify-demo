'use client';
import { useState } from 'react';
import { createUpload } from '@/app/actions/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { insertVideo } from '@/app/db/store';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { ChunkifyUploader, ChunkifyUploaderFileSelect, ChunkifyUploaderProgressBar, ChunkifyUploaderProgressText, ChunkifyUploaderError, ChunkifyUploaderSuccess, ChunkifyUploaderHeading } from 'chunkify-uploader/react';
import { Upload as ChunkifyUpload, createClient } from 'chunkify';
import styles from './file-upload.module.css';

export default function FileUpload() {
    const router = useRouter();

    const [isUploading, setIsUploading] = useState(false);
    const [open, setOpen] = useState(false);
    const [upload, setUpload] = useState<ChunkifyUpload | null>(null);

    //For metadata
    const [title, setTitle] = useState('');

    const handleEndpoint = async () => {
        
       const chunkifyUpload = await createUpload();
       setUpload(chunkifyUpload);
       return chunkifyUpload.upload_url;
      //  return "http://localhost:8787/apis/uploads"
    }

    const handleError = (event: any) => {
        console.error('Upload error', event.detail);
    }

    const handleSuccess = async () => {
        if (upload) {
            await insertVideo(upload.metadata?.demo_id, title);
        }
        setIsUploading(false);
        setOpen(false);
        router.push('/monitor');
    }

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
                <DialogHeader>
                    <DialogTitle>Upload a video</DialogTitle>
                    <DialogDescription>
                        Upload a video to start transcoding it!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-8">
                    <div className="h-px bg-border -mx-6" />
                    {!isUploading && (
                            <div className="grid w-fullmax-w-sm items-center gap-1.5">
                                <Label htmlFor="title">Video Title</Label>
                                <Input
                                    type="title"
                                    id="title"
                                    placeholder="Enter video title"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                    )}
                    <ChunkifyUploader 
                        className="
                            w-full 
                            h-[120px] 
                            text-center 
                            gap-[18px] 
                            rounded-xl 
                            mx-auto 
                            bg-white
                            [&[dragover]]:border-blue-500
                            [&[dragover]]:bg-blue-500
                            [--progress-height:8px]
                            [--progress-fill-color:#007bff]
                            [--progress-background:#e9ecef]
                            [--progress-border-radius:4px]
                        "
                        endpoint={handleEndpoint}
                        onUploadSuccess={handleSuccess}
                        onUploadError={handleError}
                        drop
                    >
                        <ChunkifyUploaderHeading >Drag and drop your file here</ChunkifyUploaderHeading>
                        <ChunkifyUploaderFileSelect className="self-center">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Upload className="h-4 w-4" />
                                Select a video
                            </Button>
                        </ChunkifyUploaderFileSelect>
                        <ChunkifyUploaderProgressText></ChunkifyUploaderProgressText>
                        <ChunkifyUploaderProgressBar></ChunkifyUploaderProgressBar>
                        <ChunkifyUploaderError className="text-red-500 text-sm">Upload error</ChunkifyUploaderError>
                    </ChunkifyUploader>
                </div>
            </DialogContent>
        </Dialog>
    );
}