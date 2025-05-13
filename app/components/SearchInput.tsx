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
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('t', value);
        } else {
            params.delete('t');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center gap-2 w-1/3">
            <Input
                type="text"
                placeholder="Search"
                className="w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
                variant="outline"
                onClick={() => handleSearch(searchValue)}
            >
                <Search className="w-4 h-4" />
            </Button>
        </div>
    );
}
