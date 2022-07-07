/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/departments",
        destination: "/search?filter=departments",
        permanent: true,
      },
      {
        source: "/courses",
        destination: "/search?filter=courses",
        permanent: true,
      },
      {
        source: "/geneds",
        destination: "/search?filter=geneds",
        permanent: true,
      },
      {
        source: "/professors",
        destination: "/search?filter=professors",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
