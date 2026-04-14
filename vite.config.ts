import { reactRouter as rr } from '@react-router/dev/vite'
import tw from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import mdx from 'fumadocs-mdx/vite'
import * as MdxConfig from './source.config'

export default defineConfig({
  plugins: [mdx(MdxConfig), tw(), rr()],
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    external: ['@takumi-rs/image-response'],
  },
})
