/** @type {import('next').NextConfig} */
const nextConfig = {
  // Letakkan konfigurasi gambar di sini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Opsi konfigurasi lain bisa ditambahkan di sini
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
