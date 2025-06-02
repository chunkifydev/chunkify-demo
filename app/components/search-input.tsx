'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('t') || '');

    const handleSearch = (value: string) => {
        const params = new URLSearchParams();
        if (value) {
            params.set('t', value);
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center gap-2 w-1/3">
            <Input
                type="text"
                placeholder="Search by title"
                className="w-7/8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
                variant="outline"
                onClick={() => handleSearch(searchValue)}
                className="w-1/8"
            >
                <Search className="w-4 h-4" />
            </Button>
        </div>
    );
}
