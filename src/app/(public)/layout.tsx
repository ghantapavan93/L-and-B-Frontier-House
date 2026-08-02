import { SiteFooter } from '@/ui/site-footer'
import { SiteHeader } from '@/ui/site-header'

/**
 * THE PUBLIC PERMISSION CONTEXT.
 *
 * Indexable and shared-cacheable. Nothing rendered under this layout may receive restricted
 * data: every product read on a public route goes through `getPublicProduct` /
 * `listPublicProducts`, which return a type with no wholesale field.
 *
 * THE SESSION IS DELIBERATELY NOT READ HERE. A public response that varies by cookie is a
 * response a shared cache can serve to the wrong person.
 *
 * The experience state IS read, and it is the one thing public output varies on. That is
 * safe in a way a session is not: it carries no identity, only a presentation preference,
 * and the same three variants are served to everyone who picks them.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
