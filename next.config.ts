import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // CSP for basic security. Further refinement may be needed.
          // Note: Next.js handles some CSP aspects automatically, but custom rules are good.
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self';` +
                   `script-src 'self' 'unsafe-eval' 'unsafe-inline';` + // 'unsafe-eval' is often needed for Next.js development, 'unsafe-inline' for style-jsx
                   `style-src 'self' 'unsafe-inline';` +
                   `img-src 'self' data:;` +
                   `font-src 'self';` +
                   `object-src 'none';` +
                   `base-uri 'self';` +
                   `form-action 'self';` +
                   `frame-ancestors 'none';` +
                   `block-all-mixed-content;`
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
  /* config options here */
};

export default nextConfig;
