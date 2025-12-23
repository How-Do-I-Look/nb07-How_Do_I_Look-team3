/** @type {import('next').NextConfig} */
const { hostname } = require('os');
const path = require("path");

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@use "src/styles/utils.scss" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "sprint-be-project.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "http",
        hostname: "img.com"
      },
      {
        protocol: "https",
        hostname: "dummyimage.com"
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc"
      }
    ],
  },
};
