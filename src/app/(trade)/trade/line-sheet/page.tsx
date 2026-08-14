import type { Metadata } from 'next'
import Link from 'next/link'
import { requireSignedIn } from '@/auth/guards'
import { getBuyerProfile } from '@/data/buyer-repository'
import { listVisibleProducts } from '@/data/catalog-repository'
import { formatMoney } from '@/domain/money'
import { AVAILABILITY_LABELS, isAuthorisedProduct, primaryMedia } from '@/domain/product'
import type { AuthorisedProduct } from '@/domain/product'
import { SIZE_RANGE_LABELS } from '@/domain/size'
import { isAuthorisedBuyer } from '@/domain/session'
import { navigableCategories } from '@/domain/taxonomy'
import { BuyerStatusPanel } from '@/ui/buyer-status'
import { ProductMedia } from '@/ui/product-media'

export const metadata: Metadata = { title: 'Line sheet', robots: { index: false } }

/**
 * THE DIGITAL LINE SHEET — the wholesale teardown's centrepiece, built on our terms.
 *
 * The platform references model a line sheet as a living document: continuously current
 * product data a buyer can browse and order from, not a stale PDF attachment. Ours is a
 * PAGE — the same authorised session, the same repositories, the same types as every
 * other trade surface, so it can never drift from the catalogue it describes.
 *
 * The security posture is the whole design (finding W-2): a line-sheet FILE in public/
 * would leak past every route-level gate, so no file exists. The sheet renders inside the
 * authorised session only; the export path is the browser's own print-to-PDF, which
 * inherits the session and produces a document stamped for this buyer. The print
 * stylesheet strips chrome and sets the sheet in document black-on-white.
 *
 * Every value on this page comes from `AuthorisedProduct.wholesale` — the type that only
 * exists inside an approved session. There is no public variant of this route, nothing to
 * gate row-by-row, and nothing to forget.
 */
export default async function LineSheetPage() {
  const session = await requireSignedIn('/trade/line-sheet')
  const profile = await getBuyerProfile(session)

  if (!profile || !isAuthorisedBuyer(session)) {
    return (
      <div className="container section stack">
        <p className="eyebrow">Line sheet</p>
        <h1>The line, priced for your store</h1>
        {profile ? (
          <BuyerStatusPanel profile={profile} />
        ) : (
          <p className="lede">
            Sign in with an approved buyer account to open the sheet.{' '}
            <Link href="/sign-in" className="text-link">
              Buyer sign in
            </Link>
          </p>
        )}
      </div>
    )
  }

  const visible = await listVisibleProducts(session)
  const authorised = visible.filter(isAuthorisedProduct)
  const categories = navigableCategories()
  const preparedOn = new Date().toISOString().slice(0, 10)

  return (
    <div className="container section line-sheet">
      <header className="line-sheet__head">
        <div>
          <p className="eyebrow">Line sheet</p>
          <h1>The published line</h1>
          <p className="meta">
            Prepared for <strong>{profile.retailerName}</strong> · {preparedOn} · wholesale
            terms visible to your approved account only
          </p>
        </div>
        <p className="line-sheet__print meta">
          Use your browser&rsquo;s <strong>Print</strong> to save this sheet as a PDF — it
          prints clean, stamped for your store, and never exists as a shared file.
        </p>
      </header>

      {/* Verified commercial frame, once, at the top — where a buyer expects terms. */}
      <p className="line-sheet__terms meta">
        $50 minimum order · prepacks of 6 · sales tax ID on file · 100% fill rate · 2.64-day
        average processing
      </p>

      {categories.map((category) => {
        const rack = authorised.filter((p) => p.categorySlug === category.slug)
        if (rack.length === 0) return null
        return (
          <section key={category.slug} aria-labelledby={`sheet-${category.slug}`}>
            <h2 id={`sheet-${category.slug}`} className="line-sheet__category">
              {category.label}
            </h2>
            <table className="line-sheet__table">
              <thead>
                <tr>
                  <th scope="col">Photo</th>
                  <th scope="col">Style</th>
                  <th scope="col">Name &amp; spec</th>
                  <th scope="col">Colours</th>
                  <th scope="col">Sizes</th>
                  <th scope="col">Pack</th>
                  <th scope="col">WHLSL</th>
                  <th scope="col">Pack $</th>
                  <th scope="col">MSRP</th>
                  <th scope="col">MOQ</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rack.map((product) => (
                  <SheetRow key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </section>
        )
      })}

      <p className="meta line-sheet__foot">
        Every figure on this sheet is restricted to approved accounts. Availability is live at
        print time; confirm ship windows on the order itself.
      </p>
    </div>
  )
}

function SheetRow({ product }: { product: AuthorisedProduct }) {
  const media = primaryMedia(product)
  const { wholesale } = product
  const run = wholesale.prepack.breakdown
    .map((step) => `${step.size} ×${step.quantity}`)
    .join(' · ')

  return (
    <tr>
      <td className="line-sheet__photo">
        {media ? <ProductMedia media={media} sizes="72px" /> : null}
      </td>
      <td className="line-sheet__sku">{wholesale.sku}</td>
      <td>
        <Link href={`/trade/product/${product.slug}`} className="text-link">
          {product.displayName}
        </Link>
        <span className="line-sheet__spec">{product.specName}</span>
      </td>
      <td>{product.attributes.colour.map((c) => c.name).join(', ')}</td>
      <td>{product.sizeRanges.map((range) => SIZE_RANGE_LABELS[range.kind]).join(' · ')}</td>
      <td>
        {wholesale.prepack.totalUnits} ({run})
      </td>
      <td className="line-sheet__money">{formatMoney(wholesale.wholesalePrice)}</td>
      <td className="line-sheet__money">{formatMoney(wholesale.packPrice)}</td>
      <td className="line-sheet__money">{formatMoney(wholesale.msrp)}</td>
      <td>{wholesale.moq}</td>
      <td>{AVAILABILITY_LABELS[product.availability]}</td>
    </tr>
  )
}
