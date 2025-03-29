/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frontend-interview.evidentinsights.com",
        port: "",
        pathname: "/album_covers/*",
      },
    ],
    minimumCacheTTL: 60 * 60, // next now caches images for 1 hour
  },
};

export default config;
