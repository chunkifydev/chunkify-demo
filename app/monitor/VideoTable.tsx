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

export default function VideoTable({ videos }: { videos: Video[] }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Title</TableHead>
                        <TableHead className="w-[200px]">Video ID</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[150px]">Created</TableHead>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
