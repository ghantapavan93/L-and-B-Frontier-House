import type { Metadata } from 'next'
import { getSession } from '@/auth/session'
import { SiteFooter } from '@/ui/site-footer'
import { SiteHeader } from '@/ui/site-header'

/**
 * THE AUTHORISED PERMISSION CONTEXT.
 *
 * `private, no-store` and `noindex` are set as response headers in next.config.mjs; the
 * metadata below is the crawler-facing half of the same rule.
 *
 * `force-dynamic` guarantees no authorised response is ever statically generated or
 * revalidated into a shared cache — the highest-risk failure in this whole boundary is a
 * CDN serving one buyer's page to another.
 *
 * The guard itself lives in each page (see src/auth/guards.ts): a layout does not prevent
 * its child page from executing.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
}

export default async function TradeLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <>
      <SiteHeader session={session} />
      <main id="main" className="page-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
