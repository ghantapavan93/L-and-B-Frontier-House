import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicProduct, listPublicProducts } from '@/data/catalog-repository'
import { frontierEnabled } from '@/features/experience/frontier-flag'
import { AVAILABILITY_LABELS } from '@/domain/product'
import type { PublicProduct } from '@/domain/product'
import { findCategory } from '@/domain/taxonomy'
import { PdpGallery } from '@/ui/pdp/gallery'
import { FixtureNotice } from '@/ui/notices'
import { ProductCard } from '@/ui/product-card'
import { ProofStrip } from '@/ui/proof-strip'
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

  /*
     The product's own attributes are the ONLY anatomy source — no construction fact is
     invented. Each entry is something visibly true of the garment in its photograph.

     ONE DATASET, TWO SURFACES: every entry that has a matching facet carries its facet
     param, and renders as a real link into the filtered category. The PLP's controls and
     the PDP's anatomy now speak the same vocabulary by construction — the mechanism the
     denim references keep as two disconnected systems — and each garment fact doubles as
     a route to every other garment sharing it. `facet: undefined` (inseam) renders as
     plain text: one populated value is navigation to nowhere.
  */
  const anatomy: { term: string; detail: string; facet?: string }[] = [
    ...(product.attributes.fabric ?? []).map((f) => ({
      term: 'Fabric',
      detail: f,
      facet: 'fabric',
    })),
    ...(product.attributes.detail ?? []).map((d) => ({
      term: 'Detail',
      detail: d,
      facet: 'detail',
    })),
    ...(product.attributes.motif ?? []).map((m) => ({
      term: 'Motif',
      detail: m,
      facet: 'motif',
    })),
    ...(product.attributes.legOpening
      ? [{ term: 'Leg opening', detail: product.attributes.legOpening, facet: 'legOpening' }]
      : []),
    ...(product.attributes.silhouette
      ? [{ term: 'Silhouette', detail: product.attributes.silhouette, facet: 'silhouette' }]
      : []),
    ...(product.attributes.sleeve
      ? [{ term: 'Sleeve', detail: product.attributes.sleeve, facet: 'sleeve' }]
      : []),
    ...(product.attributes.wash
      ? [{ term: 'Wash', detail: product.attributes.wash, facet: 'wash' }]
      : []),
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
          {/*
            THE GALLERY THE DEMONSTRATION HAD, GIVEN TO THE PRODUCTS THAT PAY.

            This was a vertical stack of the catalogue's frames followed by two empty
            placeholder boxes — "Detail crop", "Back view" — reserved for photography
            that does not exist. Two frames of product and two 839 px boxes of nothing:
            the gallery measured 3,393 px, and a buyer scrolled past a screen and a half
            of labelled emptiness to reach the anatomy. Meanwhile /mens/[slug], the
            demonstration of a line the owner has not decided to sell, shipped a proper
            gallery: snap strip, named thumbnails, an enlarged view, no placeholders. The
            line that does not exist had the better product page. That is exactly the
            drift the constitution warns about, one reasonable band at a time.

            The placeholders are gone, and not softened. The reserved-box argument — the
            owner needs named boxes to paste into — is answered better by the shot list:
            a slot is a FILENAME now (docs/assets/LB_MENSWEAR_PHOTOGRAPHY_BRIEF.md §6),
            and a frame that arrives named appears here without touching this file. An
            empty frame on a public product page is a promise the catalogue has not kept.
          */}
          <PdpGallery
            frames={product.media.map((media, index) => ({
              id: `frame-${product.slug}-${index}`,
              image: media,
              label: index === 0 ? 'Front' : index === 1 ? 'Second view' : `View ${index + 1}`,
              /* The card's photograph morphs into the first frame on arrival. */
              ...(index === 0 ? { transitionName: `p-${product.slug}` } : {}),
            }))}
          />

          <div className="stack">
            <div>
              <h1 className="pdp__title">{product.displayName}</h1>
              <p className="spec-name">{product.specName}</p>
              <div className="badge-row">
                <span className="badge">{AVAILABILITY_LABELS[product.availability]}</span>
              </div>
            </div>

            <p className="lede">{product.description}</p>

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

            <ProofStrip />

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
                  {entry.facet ? (
                    <Link
                      className="text-link"
                      href={`/shop/${product.categorySlug}?${entry.facet}=${encodeURIComponent(entry.detail)}#products`}
                    >
                      {entry.detail}
                    </Link>
                  ) : (
                    entry.detail
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/*
          THE DETAILS, AS ACCORDIONS — Sézane's PDP mechanism, on native <details>.
          Zero JavaScript: summaries open without a script, the content is server HTML, and
          a crawler or Ctrl-F reads it closed or open. The first block ships open so the
          garment facts are at-a-glance; the h2 above keeps the outline contiguous for the
          h3s inside the size table.
        */}
        <section className="section" aria-labelledby="details-heading">
          <h2 id="details-heading">The details</h2>

          <details className="pdp-fold" open>
            <summary>What it is</summary>
            <div className="pdp-fold__body">
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
            </div>
          </details>

          <details className="pdp-fold">
            <summary>Size and fit</summary>
            <div className="pdp-fold__body">
              <p className="meta">
                Body measurements in inches. Published as text so it can be read, searched and
                announced — never as an image of a table.
              </p>
              <SizeAndFitTable ranges={product.sizeRanges} />
            </div>
          </details>

          <details className="pdp-fold">
            <summary>Shipping</summary>
            <div className="pdp-fold__body">
              {/* Verified operational facts only — the same figures the homepage states.
                  No returns copy: no verified returns policy exists in this repo, and an
                  invented one would be a production claim. */}
              <p>
                100% of orders filled complete, 2.64-day average processing. Order by 5pm CST
                and it ships the same or next business day.
              </p>
            </div>
          </details>
        </section>

        {/*
          NO "SEE IT MOVE" SECTION UNTIL SOMETHING MOVES.

          A section by that name stood here with one thing in it: a dashed 9:16 box reading
          "<garment> in motion — film slot". A heading that promises motion over a labelled
          rectangle is a worse product page than no section — it tells a buyer the house
          wanted to show them something and could not. D-11 asks whether any garment film
          exists; the answer today is no. When it does, it arrives as `kind: 'video'` in
          `product.media` and the gallery carries it as a frame, with a poster and a pause
          control, where a buyer inspecting the garment is already looking.
        */}

        {frontier && related.length > 0 ? (
          <section className="section" aria-labelledby="related-heading">
            <div className="section-head">
              <div>
                <p className="eyebrow">Not sure between them?</p>
                <h2 id="related-heading">Compare the line</h2>
                {/*
                  The comparison ANCHOR — the reference PDPs answer "is this the right
                  one" with a shoppable comparison row, not a spec table. The anchor line
                  states what the reader is already looking at in facet vocabulary, so the
                  cards beneath read as alternatives to a stated position, not as an
                  unrelated grid. Derived entirely from the record; renders only the
                  attributes that exist.
                */}
                <p className="meta">
                  You are looking at:{' '}
                  {[
                    product.attributes.wash ? `${product.attributes.wash} wash` : null,
                    product.attributes.legOpening,
                    product.attributes.silhouette,
                  ]
                    .filter(Boolean)
                    .join(' · ') || product.specName.toLowerCase()}
                  . The rest of the {category ? category.label.toLowerCase() : 'line'} differs
                  from here.
                </p>
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
