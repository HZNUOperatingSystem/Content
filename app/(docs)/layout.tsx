import type { CSSProperties } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { DocsThemeShell } from '@/components/docs-theme-shell'
import { baseOptions } from '@/lib/layout.shared'
import { getNodeColor } from '@/lib/navigation'
import { source, type ColorScheme } from '@/lib/source'

function getThemeColorStyle(color: ColorScheme | undefined, name: string) {
  if (!color) return undefined

  return {
    [`${name}-light`]: color.light,
    [`${name}-dark`]: color.dark,
  } as CSSProperties
}

export default function DocsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pageTree = source.getPageTree()

  return (
    <DocsThemeShell tree={pageTree}>
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
                    } as CSSProperties)
                  }
                >
                  {option.icon}
                </div>
              ) : undefined,
            }
          },
        }}
      >
        {children}
      </DocsLayout>
    </DocsThemeShell>
  )
}
