import type { NextConfig } from 'next';
import { join } from 'path';

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        outputFileTracingRoot: join(__dirname, '..'),
    },
} as NextConfig;

export default nextConfig;
