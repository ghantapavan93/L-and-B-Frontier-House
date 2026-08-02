import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireApprovedBuyer } from '@/auth/guards'
import { getVisibleProduct } from '@/data/catalog-repository'
import { AVAILABILITY_LABELS } from '@/domain/product'
import { isAuthorisedProduct } from '@/domain/product'
import { FixtureNotice, StateBlock } from '@/ui/notices'
import { ProductMedia } from '@/ui/product-media'
import { SizeAndFitTable } from '@/ui/size-and-fit-table'
import { AddToOrder, PrepackTable, WholesalePricePanel } from '@/ui/wholesale'

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
        <div className="pdp__gallery">
          {product.media.map((media, index) => (
            <div className="pdp__media" key={media.id}>
              <ProductMedia media={media} priority={index === 0} />
            </div>
          ))}
        </div>

        <div className="stack">
          <div>
            <h1 className="pdp__title">{product.displayName}</h1>
            <p className="spec-name">{product.specName}</p>
            <div className="badge-row">
              <span className="badge">{AVAILABILITY_LABELS[product.availability]}</span>
            </div>
          </div>

          <WholesalePricePanel product={product} />

          <PrepackTable prepack={product.wholesale.prepack} />

          <AddToOrder product={product} returnTo="/trade/order" />

          {product.wholesale.stockBySize.length > 0 ? (
            <section aria-labelledby="stock-heading">
              <h2 className="eyebrow" id="stock-heading">
                Stock by size
              </h2>
              <div className="table-scroll">
                <table>
                  <caption>Units currently available by size</caption>
                  <thead>
                    <tr>
                      <th scope="col">Size</th>
                      <th scope="col">Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.wholesale.stockBySize.map((row) => (
                      <tr key={row.size}>
                        <th scope="row">{row.size}</th>
                        <td>{row.units}</td>
                      </tr>
                    ))}
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
