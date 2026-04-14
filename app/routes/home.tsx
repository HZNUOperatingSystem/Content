import type { Route } from './+types/home'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { Link } from 'react-router'
import { baseOptions } from '@/lib/layout.shared'
import { appName } from '@/lib/shared'

export function meta({}: Route.MetaArgs) {
  return [
    { title: appName },
    {
      name: 'description',
      content: 'Course notes and lab documentation for HZNU operating systems experiments.',
    },
  ]
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
            Documentation
          </p>
          <h1 className="text-3xl font-semibold text-fd-foreground sm:text-4xl">
            {appName}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-fd-muted-foreground">
            A clean documentation site for course notes, experiment guides, and
            lab handouts. The starter-only export endpoints and extra demo
            controls have been removed so the project stays focused on the
            content itself.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center rounded-md border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            to="/docs"
          >
            Browse Docs
          </Link>
          <Link
            className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            to="/docs/workflow"
          >
            Read the Workflow
          </Link>
        </div>
      </main>
    </HomeLayout>
  )
}
