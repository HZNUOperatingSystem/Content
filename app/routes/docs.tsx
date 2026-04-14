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
import { getDocsSection, getSectionColor } from '@/lib/navigation'

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0)
  const page = source.getPage(slugs)
  if (!page) throw new Response('Not found', { status: 404 })

  return {
    path: page.path,
    markdownUrl: getPageMarkdownUrl(page).url,
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
        <div className="flex flex-row items-center gap-2 border-b border-fd-border pb-4">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
        </div>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    )
  },
})

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree, markdownUrl } = useFumadocsLoader(loaderData)
  const section = getDocsSection(path)

  return (
    <div className={section}>
      <DocsLayout
        {...baseOptions()}
        tree={pageTree}
        tabs={{
          transform(option) {
            const optionSection = getDocsSection(
              option.url.replace(/^\/docs\/?/, ''),
            )
            const color = getSectionColor(optionSection)

            return {
              ...option,
              icon: option.icon ? (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as React.CSSProperties
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
    </div>
  )
}
