import withSerwistInit from "@serwist/next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  output: 'export',
};

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts", // add the path where you create sw.ts
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // to disable pwa in development
});

export default withSerwist(nextConfig);
