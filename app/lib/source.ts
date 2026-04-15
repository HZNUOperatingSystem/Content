import { loader, type PageTreeBuilderContext } from 'fumadocs-core/source'
import type { Folder, Root } from 'fumadocs-core/page-tree'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docs } from 'collections/server'
import { docsContentRoute, docsRoute } from './shared'

type ColorMeta = {
  color?: string | string[]
}

export type ColorScheme = {
  light: string
  dark: string
}

type ColoredNode = {
  color?: ColorScheme
}

function normalizeColorScheme(color: string | string[] | undefined) {
  if (!color) return undefined
  if (typeof color === 'string') return { light: color, dark: color }
  if (color.length === 0) return undefined

  return {
    light: color[0],
    dark: color.at(-1) ?? color[0],
  }
}

function getMetaColorScheme(
  storage: PageTreeBuilderContext['storage'],
  metaPath: string | undefined,
) {
  if (!metaPath) return undefined

  const file = storage.read(metaPath)
  if (!file || file.format !== 'meta') return undefined

  return normalizeColorScheme((file.data as ColorMeta).color)
}

function setNodeColor<T extends Folder | Root>(node: T, color: ColorScheme) {
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
        const color = getMetaColorScheme(this.storage, metaPath)
        if (!color) return node

        return setNodeColor(node, color)
      },
      root(this: Pick<PageTreeBuilderContext, 'storage'>, node: Root): Root {
        const color = getMetaColorScheme(this.storage, node.$ref)
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
  return `${docsContentRoute}/${[...page.slugs, 'content.md'].join('/')}`
}
