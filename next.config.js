/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
     images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "emailer.thyrocare.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "b2capi.thyrocare.com",
                port: "",
                pathname: "/**",
            }
        ]
     }
};

export default config;
