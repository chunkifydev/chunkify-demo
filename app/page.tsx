import VideosIndex from './components/VideosIndex';

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    console.log('Page rendering, searchParams:', searchParams);
    const params = await searchParams;
    const searchQuery = (params.t as string) || '';

    return (
        <div className="min-h-screen p-8 flex flex-col">
            <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
                <div className="flex items-center justify-center">
                    <VideosIndex searchQuery={searchQuery} />
                </div>
            </main>
        </div>
    );
}
