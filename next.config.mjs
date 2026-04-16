import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'hznu-os-1302639736.cos.accelerate.myqcloud.com',
      },
      {
        protocol: 'https',
        hostname: 'hznu-os-1302639736.cos.ap-shanghai.myqcloud.com',
      },
    ],
  },
}

const withMDX = createMDX({
  index: false,
})

export default withMDX(config)
