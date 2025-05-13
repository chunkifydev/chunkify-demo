import Image from 'next/image';
import VideosIndex from './components/VideosIndex';
import FileUpload from './components/FileUpload';

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const searchQuery = (params.t as string) || '';

    return (
        <div className="min-h-screen p-8 flex flex-col">
            <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
                <div className="flex items-center justify-center mt-16">
                    <VideosIndex searchQuery={searchQuery} />
                </div>
            </main>
        </div>
    );
}
