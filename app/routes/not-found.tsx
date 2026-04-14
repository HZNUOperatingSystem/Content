import type { Route } from './+types/not-found'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '@/lib/layout.shared'
import { Link } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Not Found' }]
}

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold text-fd-foreground">
          Page not found
        </h1>
        <p className="text-base leading-7 text-fd-muted-foreground">
          The page you requested does not exist or has been moved.
        </p>
        <div>
          <Link
            className="inline-flex items-center rounded-md border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            to="/docs"
          >
            Return to docs
          </Link>
        </div>
      </main>
    </HomeLayout>
  )
}
