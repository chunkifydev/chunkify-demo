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
        <div className="w-full border rounded-lg">
            <Table>
                <TableHeader className="bg-muted rounded-lg">
                    <TableRow>
                        <TableHead className="w-[230px] rounded-tl-lg"></TableHead>
                        <TableHead className="w-[150px] text-center">
                            Status
                        </TableHead>
                        <TableHead className="w-[150px]">Created</TableHead>
                        <TableHead className="w-[50px] text-center rounded-tr-lg">
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
                            <TableRow
                                key={video.id}
                                className="h-16"
                            >
                                <TableCell className="truncate max-w-[220px] h-16">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center px-2 gap-4">
                                            <div
                                                className={`h-2 w-2 rounded-full ${
                                                    video.status === 'failed'
                                                        ? 'bg-destructive'
                                                        : video.status ===
                                                          'completed'
                                                        ? 'bg-primary'
                                                        : 'bg-warning animate-pulse'
                                                }`}
                                            />
                                            <div className="truncate font-semibold">
                                                {video.title}
                                            </div>
                                        </div>
                                        {video.status === 'processing' &&
                                            video.job_id && (
                                                <div className="px-2">
                                                    <JobProgress
                                                        job_id={video.job_id}
                                                        status={video.status}
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[150px] text-center">
                                    <div className="flex items-center justify-center gap-2 min-h-[32px]">
                                        <Badge
                                            variant={
                                                video.status === 'failed'
                                                    ? 'destructive'
                                                    : video.status ===
                                                      'completed'
                                                    ? 'success'
                                                    : 'pending'
                                            }
                                            className="flex items-center justify-center gap-2 flex-shrink-0 font-bold py-1 px-2"
                                        >
                                            {video.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                video.status.slice(1)}
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
