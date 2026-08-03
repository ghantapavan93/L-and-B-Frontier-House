import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicProduct, listPublicProducts } from '@/data/catalog-repository'
import { frontierEnabled } from '@/features/experience/frontier-flag'
import { AVAILABILITY_LABELS } from '@/domain/product'
import type { PublicProduct } from '@/domain/product'
import { findCategory } from '@/domain/taxonomy'
import { FixtureNotice } from '@/ui/notices'
import { ProductCard } from '@/ui/product-card'
import { ProductMedia } from '@/ui/product-media'
import { SizeAndFitTable } from '@/ui/size-and-fit-table'
import { WholesaleGate } from '@/ui/wholesale'

type Params = { slug: string }

/**
 * The catalogue is enumerable, so every product page is prerendered.
 *
 * `dynamicParams = false` matters for more than caching: an unknown slug becomes an
 * unmatched URL, which is the one 404 path Next server-renders into the initial HTML.
 * `notFound()` thrown from a rendered page streams its boundary as RSC payload instead,
 * leaving an empty body without JavaScript — measured, not assumed.
 *
 * The cost is that a newly published style needs the param list regenerated. With the real
 * commerce adapter that becomes a revalidation call on publish; it is recorded as an
 * operational note in the progress report.
 */
export const dynamicParams = false

export async function generateStaticParams(): Promise<Params[]> {
  const products = await listPublicProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getPublicProduct(slug)
  if (!product) return {}

  // Title and description carry no price. Restricted values never reach metadata.
  return {
    title: product.displayName,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
  }
}

/**
 * Product structured data WITHOUT `offers`.
 *
 * Omitted entirely rather than zeroed or obfuscated: emitting `offers` with a wholesale
 * figure would publish restricted pricing into the most aggressively crawled field on the
 * page. If the owner approves a public MSRP (docs/production/08 §1), it is added here and
 * nowhere else.
 */
function productJsonLd(product: PublicProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.displayName,
    alternateName: product.specName,
    description: product.description,
    material: product.attributes.fabric ?? undefined,
    color: product.attributes.colour.map((c) => c.name).join(', '),
    size: product.sizeRanges.flatMap((r) => r.sizes),
    brand: { '@type': 'Brand', name: 'Lucky & Blessed' },
  }
}

/**
 * PUBLIC PRODUCT DETAIL.
 *
 * Everything here is public by definition: it is read through `getPublicProduct`, which
 * returns a type with no wholesale field. There is nothing on this page to hide, so there
 * is nothing on this page to leak.
 *
 * The session is not read, so this page is identical for every visitor and safe to cache
 * anywhere. The wholesale gate always renders; an approved buyer following it lands on the
 * authorised route, which resolves their session there.
 */
export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = await getPublicProduct(slug)
  if (!product) notFound()

  const frontier = frontierEnabled()
  const category = findCategory(product.categorySlug)
  const opening = product.media[0]
  const hasPhotography = opening?.provenance === 'owner-supplied'
  const related = (await listPublicProducts({ categorySlug: product.categorySlug }))
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  /* The product's own attributes are the ONLY anatomy source — no construction fact is
     invented. Each entry is something visibly true of the garment in its photograph. */
  const anatomy: { term: string; detail: string }[] = [
    ...(product.attributes.fabric ?? []).map((f) => ({ term: 'Fabric', detail: f })),
    ...(product.attributes.detail ?? []).map((d) => ({ term: 'Detail', detail: d })),
    ...(product.attributes.motif ?? []).map((m) => ({ term: 'Motif', detail: m })),
    ...(product.attributes.silhouette
      ? [{ term: 'Silhouette', detail: product.attributes.silhouette }]
      : []),
    ...(product.attributes.wash ? [{ term: 'Wash', detail: product.attributes.wash }] : []),
    ...(product.attributes.inseam
      ? [{ term: 'Inseam', detail: product.attributes.inseam }]
      : []),
  ]
  const colours = product.attributes.colour.map((c) => c.name).join(', ')
  const fabrics = product.attributes.fabric?.join(', ')
  const details = product.attributes.detail?.join(', ')

  return (
    <>
      {frontier && hasPhotography && opening ? (
        <section className="pdp-arrival" aria-hidden="true">
          <div
            className="pdp-arrival__backdrop"
            aria-hidden="true"
            style={{ backgroundImage: `url(${opening.poster})` }}
          />
          <div className="pdp-arrival__inner">
            <p className="pdp-arrival__eyebrow">
              {category ? category.label : 'The line'} ·{' '}
              {AVAILABILITY_LABELS[product.availability]}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={opening.poster}
              alt={opening.alt}
              width={opening.intrinsicWidth ?? 360}
              height={opening.intrinsicHeight ?? 540}
              fetchPriority="high"
            />
            <p className="pdp-arrival__title" aria-hidden="true">
              {product.displayName}
            </p>
          </div>
        </section>
      ) : null}

      <div className="container section">
        <nav aria-label="Breadcrumb">
          <p className="meta">
            <Link href="/">Home</Link>
            {category ? (
              <>
                {' / '}
                <Link href={`/shop/${category.slug}`}>{category.label}</Link>
              </>
            ) : null}
            {' / '}
            {product.displayName}
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

            <p className="lede">{product.description}</p>

            <dl className="definition-list">
              {fabrics ? (
                <>
                  <dt>Fabric</dt>
                  <dd>{fabrics}</dd>
                </>
              ) : null}
              {details ? (
                <>
                  <dt>Detail</dt>
                  <dd>{details}</dd>
                </>
              ) : null}
              <dt>Colour</dt>
              <dd>{colours}</dd>
              {product.attributes.silhouette ? (
                <>
                  <dt>Silhouette</dt>
                  <dd>{product.attributes.silhouette}</dd>
                </>
              ) : null}
              {product.attributes.inseam ? (
                <>
                  <dt>Inseam</dt>
                  <dd>{product.attributes.inseam}</dd>
                </>
              ) : null}
              <dt>Sizes</dt>
              <dd>
                {product.sizeRanges
                  .filter((r) => r.availability !== 'unavailable')
                  .flatMap((r) => r.sizes)
                  .join(', ')}
              </dd>
            </dl>

            {product.preOrder ? (
              <section className="notice" aria-labelledby="preorder-heading">
                <p className="notice__title" id="preorder-heading">
                  Pre-order
                </p>
                <p className="meta">
                  Ships {product.preOrder.shipWindowStart} to {product.preOrder.shipWindowEnd}.{' '}
                  {product.preOrder.terms}
                </p>
              </section>
            ) : null}

            <WholesaleGate returnTo={`/trade/product/${product.slug}`} />

            <FixtureNotice />
          </div>
        </div>

        {frontier && anatomy.length > 0 ? (
          <section className="section anatomy" aria-labelledby="anatomy-heading">
            <div className="section-head">
              <div>
                <p className="eyebrow">Product anatomy</p>
                <h2 id="anatomy-heading">What you are looking at</h2>
                <p className="meta">
                  Every callout is visible in the photograph — nothing is claimed that cannot be
                  seen.
                </p>
              </div>
            </div>
            <ul className="anatomy__list">
              {anatomy.map((entry, index) => (
                <li className="anatomy__item" key={`${entry.term}-${index}`}>
                  <span className="anatomy__term">{entry.term}</span>
                  {entry.detail}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="section" aria-labelledby="size-heading">
          <h2 id="size-heading">Size and fit</h2>
          <p className="meta">
            Body measurements in inches. Published as text so it can be read, searched and
            announced — never as an image of a table.
          </p>
          <SizeAndFitTable ranges={product.sizeRanges} />
        </section>

        {frontier && related.length > 0 ? (
          <section className="section" aria-labelledby="related-heading">
            <div className="section-head">
              <div>
                <p className="eyebrow">More from the sheet</p>
                <h2 id="related-heading">Nearby frames</h2>
              </div>
              <Link href="/#sheet" className="text-link">
                Return to the contact sheet
              </Link>
            </div>
            <ul className="product-grid product-grid--supporting">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} sizes="(min-width: 62rem) 25vw, 50vw" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
        />
      </div>
    </>
  )
}
