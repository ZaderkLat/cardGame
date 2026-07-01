import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  allowedDevOrigins: ['192.168.40.53'],
};

export default withNextIntl(nextConfig);