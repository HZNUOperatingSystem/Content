import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page'
import { source } from '@/lib/source'
import { useMDXComponents } from '@/components/mdx'
import { DocAuthors } from '@/components/doc-authors'
import {
  LabNoteFloatingButton,
  LabNoteProvider,
} from '@/components/page-lab-note'

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>
}

export default async function Page({ params }: DocsPageProps) {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) notFound()

  const Mdx = page.data.body
  const hasAuthors = Array.isArray(page.data.author)
    ? page.data.author.length > 0
    : Boolean(page.data.author)

  return (
    <LabNoteProvider key={page.path}>
      <DocsPage toc={page.data.toc} tableOfContent={{ style: 'clerk' }}>
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
        <p className="mb-2 text-lg text-fd-muted-foreground">
          {page.data.description}
        </p>
        <div className="mb-4 flex flex-row flex-wrap items-start gap-2 border-b border-fd-border pb-4">
          {/* <MarkdownCopyButton markdownUrl={getPageMarkdownUrl(page)}>
            复制全文
          </MarkdownCopyButton> */}
        </div>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
        </DocsBody>
        {hasAuthors ? (
          <section className="border-t border-fd-border pt-6 pb-4">
            <p className="mb-3 text-sm font-medium text-fd-muted-foreground">
              本文作者
            </p>
            <DocAuthors authors={page.data.author} />
          </section>
        ) : null}
      </DocsPage>
      <LabNoteFloatingButton />
    </LabNoteProvider>
  )
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) {
    return {
      title: '页面未找到',
    }
  }

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export function generateStaticParams() {
  return source.generateParams()
}
