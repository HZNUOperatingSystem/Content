import Link from 'next/link'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '@/lib/layout.shared'
import { docsRoute } from '@/lib/shared'

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold text-fd-foreground">
          页面未找到
        </h1>
        <p className="text-base leading-7 text-fd-muted-foreground">
          你访问的页面不存在，或者已经被移动。
        </p>
        <div>
          <Link
            className="inline-flex items-center rounded-md border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            href={docsRoute}
          >
            返回文档
          </Link>
        </div>
      </main>
    </HomeLayout>
  )
}
