import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import SearchInput from './search-input';
import Monitor from './monitor-button';
import FileUpload from './file-upload';

export default function NavBar() {
    return (
        <div className="container mx-auto p-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
                <Link href="/">
                    <img
                        src="https://chunkify.s3.us-east-1.amazonaws.com/logos/chunkify.png"
                        alt="Chunkify Logo"
                        width={180}
                        height={70}
                    />
                </Link>
                <ModeToggle />
            </div>
            <SearchInput />
            <div className="flex items-center gap-6">
                <Monitor />
                <FileUpload />
            </div>
        </div>
    );
}
