'use client'

import { usePathname } from 'next/navigation'
import type { Root } from 'fumadocs-core/page-tree'
import type { CSSProperties, ReactNode } from 'react'
import { getPageColor } from '@/lib/navigation'
import type { ColorScheme } from '@/lib/source'

type DocsThemeShellProps = {
  tree: Root
  children: ReactNode
}

function getThemeColorStyle(color: ColorScheme | undefined, name: string) {
  if (!color) return undefined

  return {
    [`${name}-light`]: color.light,
    [`${name}-dark`]: color.dark,
  } as CSSProperties
}

export function DocsThemeShell({ tree, children }: DocsThemeShellProps) {
  const pathname = usePathname()
  const pageColor = getPageColor(tree, pathname)

  return (
    <div
      className={pageColor ? 'docs-theme-color' : undefined}
      style={getThemeColorStyle(pageColor, '--docs-page-color')}
    >
      {children}
    </div>
  )
}
