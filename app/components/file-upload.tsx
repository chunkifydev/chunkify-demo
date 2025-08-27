'use client';
import { useState } from 'react';
import { createUpload } from '@/app/actions/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { insertVideo } from '@/app/db/store';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
//import { ChunkifyUploader, ChunkifyUploaderFileSelect, ChunkifyUploaderProgressBar, ChunkifyUploaderProgressText, ChunkifyUploaderError, ChunkifyUploaderSuccess, ChunkifyUploaderHeading } from 'chunkify-uploader/react';
import { Upload as ChunkifyUpload } from 'chunkify';
import styles from './file-upload.module.css';
import dynamic from 'next/dynamic';
const ChunkifyUploader = dynamic(() => import('chunkify-uploader/react').then(mod => ({ default: mod.ChunkifyUploader })), { ssr: false });
const ChunkifyUploaderFileSelect = dynamic(() => import('chunkify-uploader/react').then(mod => ({ default: mod.ChunkifyUploaderFileSelect })), { ssr: false });
const ChunkifyUploaderProgressBar = dynamic(() => import('chunkify-uploader/react').then(mod => ({ default: mod.ChunkifyUploaderProgressBar })), { ssr: false });
const ChunkifyUploaderProgressText = dynamic(() => import('chunkify-uploader/react').then(mod => ({ default: mod.ChunkifyUploaderProgressText })), { ssr: false });
const ChunkifyUploaderError = dynamic(() => import('chunkify-uploader/react').then(mod => ({ default: mod.ChunkifyUploaderError })), { ssr: false });
const ChunkifyUploaderHeading = dynamic(() => import('chunkify-uploader/react').then(mod => ({ default: mod.ChunkifyUploaderHeading })), { ssr: false });


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
                <div className="flex flex-col gap-8">
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
                        endpoint={handleEndpoint}
                        onUploadSuccess={handleSuccess}
                        onUploadError={handleError}
                        className={styles.uploader}
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
                        <ChunkifyUploaderError className="text-red-500 text-sm"></ChunkifyUploaderError>
                    </ChunkifyUploader>
                </div>
            </DialogContent>
        </Dialog>
    );
}