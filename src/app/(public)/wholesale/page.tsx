import type { Metadata } from 'next'
import Link from 'next/link'
import { officialMediaForSlot } from '@/content/media/official-media'
import { listPublicProducts } from '@/data/catalog-repository'
import { AVAILABILITY_LABELS, primaryMedia } from '@/domain/product'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'
import { EditorialMedia, ProductMedia } from '@/ui/product-media'

export const metadata: Metadata = {
  title: 'Wholesale',
  description:
    'Lucky & Blessed sells to approved retailers. Apply with your sales tax ID and see ' +
    'pricing, prepacks and minimums inside your account.',
}

/**
 * THE WHOLESALE SHOWROOM — V3 Frame 11's virtual rack and V3.1 12F-4's gated assortment,
 * inspected over MCP.
 *
 * Everything commercial that a competitor could use is ABSENT, not hidden: the rack shows
 * merchandise, names and availability, and gates pricing behind "Enter the showroom" —
 * exactly the 12F-4 pattern, which the audit identified as the only frame in the corpus
 * that designs the boundary correctly. The $50 minimum and prepack-of-6 structure are
 * verified public facts and stated plainly; per-unit cost is not.
 */
export default async function WholesalePage() {
  const banner = officialMediaForSlot('wholesale')
  const rack = (await listPublicProducts({ sort: 'newest' })).slice(0, 8)

  return (
    <>
      <section className="showroom-hero">
        {banner ? (
          <div className="showroom-hero__media" aria-hidden="true">
            <EditorialMedia media={banner} priority sizes="100vw" />
          </div>
        ) : null}
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--color-sandstone)' }}>
            For retailers
          </p>
          <h1>We are partners in your success.</h1>
          <p className="lede">
            Lucky &amp; Blessed is a manufacturer and designer. We sell to approved retailers,
            not directly to consumers — and we own the whole chain, which is why our fill rate
            is what it is.
          </p>
          <div className="cluster">
            <Link href="/wholesale/apply" className="button">
              Apply for an account
            </Link>
            <Link href="/sign-in" className="button button--secondary">
              Buyer sign in
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section--tight" aria-labelledby="journey-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 id="journey-heading">Four steps to your pricing</h2>
            </div>
          </div>
          <ol className="steps">
            <li>
              <span className="journey__index" aria-hidden="true">
                01
              </span>
              <h3>Apply</h3>
              <p className="meta">
                Tell us where you sell and give us your sales tax ID — a valid resale
                certificate for your state.
              </p>
            </li>
            <li>
              <span className="journey__index" aria-hidden="true">
                02
              </span>
              <h3>Approval</h3>
              <p className="meta">
                We review it {VERIFIED_APPROVAL_TIMING}. You hear from us either way.
              </p>
            </li>
            <li>
              <span className="journey__index" aria-hidden="true">
                03
              </span>
              <h3>Sign in</h3>
              <p className="meta">
                Your pricing appears — wholesale cost, suggested retail, pack breakdowns and
                minimums, inside your account.
              </p>
            </li>
            <li>
              <span className="journey__index" aria-hidden="true">
                04
              </span>
              <h3>Order and reorder</h3>
              <p className="meta">
                Build an order, send it, and repeat the same assortment in one action next
                season.
              </p>
            </li>
          </ol>
        </section>

        <section className="section" aria-labelledby="rack-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">The virtual rack</p>
              <h2 id="rack-heading">The line, on the rail</h2>
              <p className="meta">
                Names and availability are public. Pricing appears inside an approved account.
              </p>
            </div>
            <Link href="/sign-in" className="text-link">
              Enter the showroom
            </Link>
          </div>

          <div className="rack">
            <svg
              className="rack__rail"
              viewBox="0 0 1000 40"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <line x1="0" y1="10" x2="1000" y2="10" />
              {Array.from({ length: 8 }, (_, i) => (
                <circle key={i} cx={62 + i * 125} cy="22" r="6" />
              ))}
            </svg>
            <ul className="rack__row">
              {rack.map((product) => (
                <li key={product.id}>
                  <article className="product-card">
                    <Link href={`/product/${product.slug}`} className="product-card__link">
                      <ProductMedia
                        media={primaryMedia(product)}
                        sizes="(min-width: 62rem) 14vw, 44vw"
                      />
                      <h3 className="product-card__name">{product.displayName}</h3>
                    </Link>
                    <div className="badge-row">
                      <span className="badge">{AVAILABILITY_LABELS[product.availability]}</span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section--tight" aria-labelledby="proof-heading">
          <h2 id="proof-heading" className="visually-hidden">
            Operational proof
          </h2>
          <div className="proof-band">
            <div>
              <strong>100%</strong>
              <span>Order fill rate</span>
            </div>
            <div>
              <strong>2.64 days</strong>
              <span>Average processing</span>
            </div>
            <div>
              <strong>$50</strong>
              <span>Order minimum</span>
            </div>
            <div>
              <strong>Packs of 6</strong>
              <span>Prepack structure</span>
            </div>
          </div>
        </section>

        <section className="section--tight" aria-labelledby="terms-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">Terms</p>
              <h2 id="terms-heading">Ordering terms</h2>
            </div>
          </div>
          <div className="panel">
            <dl className="definition-list">
              <dt>Minimum order</dt>
              <dd>$50.</dd>

              <dt>Pack structure</dt>
              <dd>Prepacks of 6. Some styles are open sizing.</dd>

              <dt>Required</dt>
              <dd>A sales tax ID for your state.</dd>

              <dt>Approval time</dt>
              <dd>Typically less than one business day.</dd>

              <dt>Dispatch</dt>
              <dd>Order by 5pm CST and it ships same or next business day.</dd>
            </dl>
          </div>
        </section>

        <section className="section--tight" aria-labelledby="reorder-heading">
          <div className="editorial-split">
            <div>
              <p className="eyebrow">For returning buyers</p>
              <h2 id="reorder-heading">Reorder in one action</h2>
              <p className="lede">
                Every order you place is saved to your account. Repeat the same assortment, or
                open it and adjust pack counts before sending — your history is your line sheet.
              </p>
              <div className="cluster">
                <Link href="/sign-in" className="button button--secondary">
                  Sign in to your account
                </Link>
              </div>
            </div>
            <div className="panel">
              <p className="eyebrow">Showroom</p>
              <p>
                Permanent showroom <strong>#13656</strong>, Dallas Market Center.
                <br />
                Markets August 18–21 and October 20–23, 2026.
              </p>
              <p className="meta" style={{ marginBottom: 0 }}>
                Come see the line in person — we would love to meet you.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
