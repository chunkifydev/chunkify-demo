import Image from 'next/image';
import { getJobStore } from './api/store';
import JobsIndex from './components/JobsIndex';
import FileUpload from './components/FileUpload';
export default function Home() {
    return (
        <div className="min-h-screen p-8 flex flex-col">
            <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
                <div className="grid grid-cols-3 items-center mb-8">
                    <div></div>
                    <div className="flex justify-center">
                        <img
                            src="https://chunkify.s3.us-east-1.amazonaws.com/logos/chunkify.png"
                            alt="Chunkify Logo"
                            width={300}
                            height={100}
                        />
                    </div>
                    <div className="flex justify-end">
                        <FileUpload />
                    </div>
                </div>

                <div className="flex items-center justify-center mt-16">
                    <JobsIndex getJobStore={getJobStore} />
                </div>
            </main>
            <footer className="mt-auto flex gap-[24px] flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
