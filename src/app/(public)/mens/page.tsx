import type { Metadata } from 'next'
import Link from 'next/link'
import { navigableCategories } from '@/domain/taxonomy'

/**
 * MENSWEAR — a designed, gated, unpopulated surface.
 *
 * This route exists because the question is real: `FOR HIM` appears in five places across
 * the design corpus, buyers ask about coordinated men's product, and someone searching for
 * it deserves to land somewhere truthful rather than on a 404 or, far worse, on a rack of
 * garments that do not exist.
 *
 * What it must never become is a capability claim. Menswear is not part of the line
 * (CLAUDE.md §11, D-03) and the corpus's men's pieces — the $850 boot, the "Men's
 * Collection" row — are fiction inherited from V1's storyboard and never re-examined. So
 * this page carries:
 *
 *   no product, no price, no size, no pack, no photograph of a garment,
 *   no launch date, no countdown, no "coming soon",
 *   and no email capture.
 *
 * That last omission is the deliberate one. A notify-me field is a promise with a form
 * attached: it tells a visitor the thing is coming and banks their address against it. D-03
 * is unresolved and may well resolve as "never" — the verified replacement for that slot is
 * Girls, which already exists. Collecting interest in a product line the business has not
 * decided to make is the kind of small, reasonable-looking commitment that becomes an
 * obligation nobody chose.
 *
 * The page states the position and sends the visitor to what is real. When D-03 resolves in
 * favour of menswear, this becomes the flagship; if it resolves the other way, this file is
 * deleted and no customer was ever told otherwise.
 */
export const metadata: Metadata = {
  title: "Men's",
  description:
    'Lucky & Blessed makes western apparel for women, girls and accessories. A men’s line is not published.',
  alternates: { canonical: '/mens' },
}

export default function MensPage() {
  return (
    <div className="container section stack">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/">Home</Link> / Men&rsquo;s
        </p>
      </nav>

      <p className="eyebrow">The line</p>
      <h1>We do not make a men&rsquo;s line.</h1>
      <p className="lede">
        Lucky &amp; Blessed designs and manufactures western apparel for women and girls, plus
        accessories. There is no men&rsquo;s collection, and we would rather tell you that here
        than let you find out at the end of a search.
      </p>

      <section className="notice" aria-labelledby="honest-heading">
        <p className="notice__title" id="honest-heading">
          Why this page exists at all
        </p>
        <p className="meta">
          Men&rsquo;s appears in our own design references, and buyers ask about coordinated
          product. Rather than show a rack that is not real, this page says plainly what the
          line is. If that changes, this is where it will be — with product on it, not a
          promise.
        </p>
      </section>

      <section aria-labelledby="real-heading" className="stack">
        <h2 id="real-heading">What we do make</h2>
        <ul className="cluster" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navigableCategories().map((category) => (
            <li key={category.slug}>
              <Link href={`/shop/${category.slug}`} className="button button--secondary">
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="meta">
          Every one of these is a published category with real styles, real size ranges and real
          pack structures.
        </p>
      </section>

      <section aria-labelledby="buyer-heading" className="stack">
        <h2 id="buyer-heading">If you are a retailer</h2>
        <p>
          We sell to approved retailers. Terms are a $50 minimum, prepacks of 6 and a sales tax
          ID, with approval typically in less than one business day.
        </p>
        <div className="cluster">
          <Link href="/wholesale" className="button">
            How wholesale works
          </Link>
          <Link href="/wholesale/apply" className="button button--secondary">
            Apply for an account
          </Link>
        </div>
      </section>
    </div>
  )
}
