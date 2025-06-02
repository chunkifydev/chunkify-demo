'use client';

import { useState, useMemo } from 'react';
import { Video } from '../types';

export function useSort(videos: Video[]) {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const sortedVideos = useMemo(() => {
        return [...videos].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [videos, sortOrder]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return {
        sortedVideos,
        sortOrder,
        toggleSort,
    };
}
