import type { Route } from './+types/docs'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import {
  DocsBody,
  DocsPage,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/docs/page'
import { getPageMarkdownUrl, source } from '@/lib/source'
import browserCollections from 'collections/browser'
import { baseOptions } from '@/lib/layout.shared'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { useMDXComponents } from '@/components/mdx'
import { getNodeColor, getPageColor } from '@/lib/navigation'
import { DocAuthors } from '@/components/doc-authors'
import {
  LabNoteFloatingButton,
  LabNoteProvider,
} from '@/components/page-lab-note'
import type { ColorScheme } from '@/lib/source'

export async function loader({ params }: Route.LoaderArgs) {
  let slugs: string[] = []

  const splat = params['*']
  if (splat && typeof splat === 'string') {
    slugs = splat.split('/').filter(Boolean)
  }
  const page = source.getPage(slugs)
  if (!page) throw new Response('Not found', { status: 404 })

  return {
    path: page.path,
    url: page.url,
    markdownUrl: getPageMarkdownUrl(page),
    pageTree: await source.serializePageTree(source.getPageTree()),
  }
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: Mdx },
    { markdownUrl }: { markdownUrl: string },
  ) {
    return (
      <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <h1 className="text-[1.75em] font-semibold">{frontmatter.title}</h1>
        <p className="text-lg text-fd-muted-foreground mb-2">
          {frontmatter.description}
        </p>
        <div className="flex flex-row flex-wrap items-center gap-2 border-b border-fd-border pb-4 mb-4">
          <MarkdownCopyButton markdownUrl={markdownUrl}>
            复制全文
          </MarkdownCopyButton>
          <DocAuthors authors={frontmatter.author} />
        </div>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    )
  },
})

function getThemeColorStyle(color: ColorScheme | undefined, name: string) {
  if (!color) return undefined

  return {
    [`${name}-light`]: color.light,
    [`${name}-dark`]: color.dark,
  } as React.CSSProperties
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree, url, markdownUrl } = useFumadocsLoader(loaderData)
  const pageColor = getPageColor(pageTree, url)

  return (
    <LabNoteProvider key={path}>
      <div
        className={pageColor ? 'docs-theme-color' : undefined}
        style={getThemeColorStyle(pageColor, '--docs-page-color')}
      >
        <DocsLayout
          {...baseOptions}
          tree={pageTree}
          tabs={{
            transform(option, node) {
              const color = getNodeColor(node)

              return {
                ...option,
                icon: option.icon ? (
                  <div
                    className="docs-tab-color [&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                    style={
                      getThemeColorStyle(color, '--tab-color') ??
                      ({
                        '--tab-color-light': 'var(--color-fd-foreground)',
                        '--tab-color-dark': 'var(--color-fd-foreground)',
                      } as React.CSSProperties)
                    }
                  >
                    {option.icon}
                  </div>
                ) : undefined,
              }
            },
          }}
        >
          {clientLoader.useContent(path, { markdownUrl })}
        </DocsLayout>
        <LabNoteFloatingButton />
      </div>
    </LabNoteProvider>
  )
}
