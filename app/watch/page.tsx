import { getVideoById } from '../db/store';
import Player from './Player';

export default async function WatchPage({
    searchParams,
}: {
    searchParams: Promise<{ videoId?: string }>;
}) {
    const { videoId } = await searchParams;

    if (!videoId) {
        return (
            <div className="flex-1 flex items-center justify-center mt-32">
                <p className="text-sm text-gray-500">No video ID provided</p>
            </div>
        );
    }

    const video = await getVideoById(videoId);

    if (!video) {
        return (
            <div className="flex-1 flex items-center justify-center mt-32">
                <p className="text-sm text-gray-500">
                    No video found with this id
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Player video={video} />
        </div>
    );
}
