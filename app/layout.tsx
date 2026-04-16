import type { Metadata } from 'next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { i18nUI } from '@/lib/i18n'
import { siteName, siteDesc } from '@/lib/shared'
import './app.css'
import 'katex/dist/katex.css'

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDesc,
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider i18n={i18nUI.provider('zh-CN')}>{children}</RootProvider>
      </body>
    </html>
  )
}
