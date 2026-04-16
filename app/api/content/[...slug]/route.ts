import { source } from '@/lib/source'

function getPageSlugs(segments: string[]) {
  if (segments.at(-1) !== 'content.md') return null
  return segments.slice(0, -1)
}

type ContentRouteProps = {
  params: Promise<{ slug: string[] }>
}

export async function GET(_request: Request, { params }: ContentRouteProps) {
  const { slug } = await params
  const pageSlugs = getPageSlugs(slug)

  if (!pageSlugs) {
    return new Response('Not found', { status: 404 })
  }

  const page = source.getPage(pageSlugs)
  if (!page) {
    return new Response('Not found', { status: 404 })
  }

  const content = await page.data.getText('raw')

  return new Response(content, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}
