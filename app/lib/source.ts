import { loader, type PageTreeBuilderContext } from 'fumadocs-core/source'
import type { Folder, Root } from 'fumadocs-core/page-tree'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docs } from 'collections/server'
import { docsContentRoute, docsRoute } from './shared'

type ColorMeta = {
  color?: string
}

type ColoredNode = {
  color?: string
}

function getMetaColor(
  storage: PageTreeBuilderContext['storage'],
  metaPath: string | undefined,
) {
  if (!metaPath) return undefined

  const file = storage.read(metaPath)
  if (!file || file.format !== 'meta') return undefined

  return (file.data as ColorMeta).color
}

function setNodeColor<T extends Folder | Root>(node: T, color: string) {
  ;(node as T & ColoredNode).color = color
  return node
}

function docsColorPlugin() {
  return {
    name: 'docs:meta-color',
    transformPageTree: {
      folder(
        this: Pick<PageTreeBuilderContext, 'storage'>,
        node: Folder,
        _folderPath: string,
        metaPath?: string,
      ): Folder {
        const color = getMetaColor(this.storage, metaPath)
        if (!color) return node

        return setNodeColor(node, color)
      },
      root(this: Pick<PageTreeBuilderContext, 'storage'>, node: Root): Root {
        const color = getMetaColor(this.storage, node.$ref)
        if (!color) return node

        return setNodeColor(node, color)
      },
    },
  }
}

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  plugins: [lucideIconsPlugin(), docsColorPlugin()],
})

export function getPageMarkdownUrl(page: { slugs: string[] }) {
  const prefix = docsContentRoute === '/' ? '' : docsContentRoute
  return `${prefix}/${[...page.slugs, 'content.md'].join('/')}`
}
