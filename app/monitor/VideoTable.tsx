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
                        <TableHead>Title</TableHead>
                        <TableHead>Video ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell>{video.title}</TableCell>
                            <TableCell>{video.id}</TableCell>
                            <TableCell>
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
                            <TableCell>{timeAgo(video.created_at)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
