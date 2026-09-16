import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireApprovedBuyer } from '@/auth/guards'
import { getVisibleProduct } from '@/data/catalog-repository'
import { AVAILABILITY_LABELS } from '@/domain/product'
import { isAuthorisedProduct } from '@/domain/product'
import { DemonstrationNotice, FixtureNotice, StateBlock } from '@/ui/notices'
import { PdpGallery } from '@/ui/pdp/gallery'
import { SizeAndFitTable } from '@/ui/size-and-fit-table'
import { AddToOrder, PrepackTable, WholesalePricePanel } from '@/ui/wholesale'
import { isDemonstrationCategory } from '@/domain/taxonomy'

export const metadata: Metadata = { robots: { index: false, follow: false } }

type Params = { slug: string }

/**
 * AUTHORISED PRODUCT DETAIL.
 *
 * The guard runs before the read. The read passes the session into the authorisation seam,
 * which is the only function that can widen a product into its authorised shape.
 *
 * If it comes back public despite the guard — a lookup failure, a status change between the
 * guard and the read — the page says so rather than rendering an empty price. Fail closed,
 * visibly.
 */
export default async function TradeProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const session = await requireApprovedBuyer(`/trade/product/${slug}`)

  const product = await getVisibleProduct(slug, session)
  if (!product) notFound()

  if (!isAuthorisedProduct(product)) {
    return (
      <div className="container section">
        <StateBlock title="Pricing is not available right now">
          <p>
            We could not load your wholesale terms for this style. Your account is unchanged —
            try again in a moment, or contact your representative.
          </p>
          <Link href={`/product/${slug}`} className="button button--secondary">
            View the public product page
          </Link>
        </StateBlock>
      </div>
    )
  }

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/trade">Your account</Link> / {product.displayName}
        </p>
      </nav>

      <div className="pdp">
        {/*
          THE BUYER'S PAGE, MEASURED ON A PHONE: price at 2.07 screens, "Add to order" at
          3.5. The one control that pays for everything was the worst-placed control on
          the site — two frames stacked full-width ahead of the buying column, on the
          page where the public PDP had already been fixed. Same gallery as the public
          page now (thumbnail rail, snap strip, enlarge), and `pdp__head` so the phone
          lifts the name above the frames. The buying column follows the strip.
        */}
        {/*
          NAME FIRST, IN THE DOM AND ON THE SCREEN.

          The title block sits before the gallery in source order, so on a phone the page
          reads name → photograph → action with no CSS reordering. The previous pass lifted it
          with `order: -1`, which moved it visually and left a screen reader and the Tab key
          on the old order (WCAG 1.3.2, 2.4.3; caught in review). On desktop the grid places
          it at the top of the right column, above the sticky buying stack.
        */}
        <div className="pdp__head">
          <h1 className="pdp__title">{product.displayName}</h1>
          <p className="spec-name">{product.specName}</p>
          <div className="badge-row">
            <span className="badge">{AVAILABILITY_LABELS[product.availability]}</span>
          </div>
        </div>

        <PdpGallery
          frames={product.media.map((media, index) => ({
            id: `frame-${product.slug}-${index}`,
            image: media,
            label: index === 0 ? 'Front' : index === 1 ? 'Second view' : `View ${index + 1}`,
          }))}
        />

        <div className="stack">
          {isDemonstrationCategory(product.categorySlug) ? (
            <DemonstrationNotice compact />
          ) : null}

          <WholesalePricePanel product={product} />

          {/* The action directly under the price; the pack breakdown is the reference
              beneath it. The quantity field already says how many units a pack holds. */}
          <AddToOrder product={product} returnTo="/trade/order" />

          <PrepackTable prepack={product.wholesale.prepack} />

          {product.wholesale.stockBySize.length > 0 ? (
            <section aria-labelledby="stock-heading">
              <h2 className="eyebrow" id="stock-heading">
                Stock by size
              </h2>
              {/* Same shape as the pack run above it: sizes across, one row of numbers. */}
              <div className="table-scroll">
                <table className="prepack">
                  <caption>Units currently available by size</caption>
                  <thead>
                    <tr>
                      <th scope="col">Size</th>
                      {product.wholesale.stockBySize.map((row) => (
                        <th scope="col" key={row.size}>
                          {row.size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Units</th>
                      {product.wholesale.stockBySize.map((row) => (
                        <td key={row.size}>{row.units}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <Link href={`/product/${product.slug}`} className="meta">
            See the public page for this style
          </Link>

          <FixtureNotice />
        </div>
      </div>

      <section className="section" aria-labelledby="size-heading">
        <h2 id="size-heading">Size and fit</h2>
        <SizeAndFitTable ranges={product.sizeRanges} />
      </section>
    </div>
  )
}
