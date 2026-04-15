import { readFile } from 'node:fs/promises'
import type { Route } from './+types/content-markdown'
import { source } from '@/lib/source'

function getPageSlugsFromSplat(splat: string | undefined) {
  const segments = splat?.split('/').filter(Boolean) ?? []

  if (segments.at(-1) !== 'content.md') return null

  return segments.slice(0, -1)
}

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = getPageSlugsFromSplat(params['*'])
  if (!slugs) {
    throw new Response('Not found', { status: 404 })
  }

  const page = source.getPage(slugs)
  if (!page?.absolutePath) {
    throw new Response('Not found', { status: 404 })
  }

  const content = await readFile(page.absolutePath, 'utf8')

  return new Response(content, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}
