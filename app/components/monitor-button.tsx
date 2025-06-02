import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Binoculars } from 'lucide-react';

export default function Monitor() {
    return (
        <Link href="/monitor">
            <Button
                variant="outline"
                className="flex items-center gap-2"
            >
                <Binoculars className="h-4 w-4" />
                <span>Monitor</span>
            </Button>
        </Link>
    );
}
