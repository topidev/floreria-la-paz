import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        // pathname: '/images/**', // opcional pero recomendado (más seguro)
      },
      // Si en el futuro usas otro CDN (ej. Cloudinary, Imgix), agrégalo aquí
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      // },
    ],
    qualities: [25, 75, 85]
  },
};

export default nextConfig;
