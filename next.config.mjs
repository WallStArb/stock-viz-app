import initializeBundleAnalyzer from '@next/bundle-analyzer';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig = {
    output: 'standalone',
    outputFileTracingIncludes: {
        "/*": ["./registry/**/*"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    experimental: {
        // Disable Turbopack configuration to use default settings
        // This can help resolve module resolution issues
    },
    // Configure webpack only when not using Turbopack
    webpack: (config, { dev, isServer }) => {
        // This webpack config will only be used when not running with Turbopack
        return config;
    },
};

export default withBundleAnalyzer(nextConfig); 