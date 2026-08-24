
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";

const withNextIntl = createNextIntlPlugin();
// Define the Content Security Policy (CSP)
// External services like Supabase or Google Fonts must be declared here.
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: "/:path*",
        headers: [

          ...(isProd
            ? [
              {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains; preload",
              },
            ]
            : []),
          {
            // Prevent your site from being embedded in iFrames on other domains (Anti-Clickjacking)
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Prevent browsers from MIME-sniffing the response type
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Control how much referrer information is included with requests
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Enforce HTTPS connections for 1 year
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            // Disable browser features that your application does not use
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  allowedDevOrigins: ["192.168.40.53"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vleumeaasgaewkiswxgb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

};

export default withNextIntl(nextConfig);

