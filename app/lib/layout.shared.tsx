import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { siteName, githubUrl } from './shared'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: siteName,
  },
  githubUrl,
}
