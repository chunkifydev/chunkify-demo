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
import JobInfoTooltip from './JobInfoTooltip';

export default function VideoTable({ videos }: { videos: Video[] }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Title</TableHead>
                        <TableHead className="w-[150px]">Video ID</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[150px]">Created</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell className="whitespace-nowrap truncate max-w-[300px]">
                                {video.title}
                            </TableCell>
                            <TableCell className="whitespace-nowrap truncate max-w-[200px]">
                                {video.id}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <Badge
                                    variant={
                                        video.status === 'error'
                                            ? 'destructive'
                                            : 'pending'
                                    }
                                    className="w-28 flex items-center justify-center gap-2"
                                >
                                    {video.status}
                                    {video.status !== 'error' && (
                                        <div className="inline-block animate-spin h-3 w-3 border-2 border-current rounded-full border-t-transparent" />
                                    )}
                                </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {timeAgo(video.created_at)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {(video.status === 'waiting' ||
                                    video.status === 'error') && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                                        onClick={() => {
                                            removeVideo(video.id);
                                        }}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                )}
                                {video.status === 'processing' &&
                                    video.job_id && (
                                        <JobInfoTooltip job_id={video.job_id} />
                                    )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
