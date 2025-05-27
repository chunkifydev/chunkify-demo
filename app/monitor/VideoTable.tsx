import { Video } from '../types';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { timeAgo } from '../utils';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { removeVideo } from '../db/store';
import JobProgress from './JobProgress';
export default function VideoTable({ videos }: { videos: Video[] }) {
    return (
        <div className="w-3/4">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="w-[220px]">Title</TableHead>
                        <TableHead className="w-[150px] text-center">
                            Status
                        </TableHead>
                        <TableHead className="w-[150px]">Created</TableHead>
                        <TableHead className="w-[50px] text-center">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No videos processed or processing right now.
                            </TableCell>
                        </TableRow>
                    ) : (
                        videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="truncate max-w-[220px]">
                                    <div className="flex flex-col gap-2">
                                        <div className="truncate">
                                            {video.title}
                                        </div>
                                        {video.status === 'processing' &&
                                            video.job_id && (
                                                <JobProgress
                                                    job_id={video.job_id}
                                                    status={video.status}
                                                />
                                            )}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[150px] text-center">
                                    <div className="flex items-center justify-center gap-2 min-h-[32px]">
                                        <Badge
                                            variant={
                                                video.status === 'error'
                                                    ? 'destructive'
                                                    : video.status ===
                                                      'completed'
                                                    ? 'success'
                                                    : 'pending'
                                            }
                                            className="w-32 flex items-center justify-center gap-2 flex-shrink-0"
                                        >
                                            {video.status}
                                            {(video.status === 'waiting' ||
                                                video.status ===
                                                    'processing') && (
                                                <div className="inline-block animate-spin h-3 w-3 border-2 border-current rounded-full border-t-transparent" />
                                            )}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {timeAgo(video.created_at)}
                                </TableCell>
                                <TableCell className="w-[50px] text-center">
                                    {video.status !== 'processing' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-primary hover:text-destructive/90 cursor-pointer"
                                            onClick={() => {
                                                removeVideo(video.id);
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
