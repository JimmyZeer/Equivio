/** @type {import('next').NextConfig} */
const nextConfig = {
    // Pin the workspace root so Turbopack doesn't get confused when the project
    // is checked out as a git worktree (a parent directory may contain another
    // package-lock.json, which Next would otherwise treat as the project root
    // and fail with "We couldn't find the Next.js package from .../src/app").
    turbopack: {
        root: import.meta.dirname,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    async redirects() {
        return [
            // /carnet was the original landing during the validation phase.
            // The product is now positioned at the homepage, so /carnet
            // permanently redirects to / while /carnet/merci stays valid.
            {
                source: '/carnet',
                destination: '/',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
