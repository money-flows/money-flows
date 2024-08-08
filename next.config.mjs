/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/settings",
        destination: "/settings/accounts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
