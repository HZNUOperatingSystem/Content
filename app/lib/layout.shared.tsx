import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { siteName, githubUrl } from './shared'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="flex items-center gap-2 pl-0.5">
        <img
          src="/favicon.png"
          alt=""
          className="size-5 rounded-sm"
          width={20}
          height={20}
        />
        <span>{siteName}</span>
      </span>
    ),
  },
  githubUrl,
}
