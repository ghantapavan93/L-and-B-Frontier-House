import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MENS_DEMO_PRODUCTS } from '@/fixtures/mens-demo'
import type { DemoProduct } from '@/fixtures/mens-demo'
import { PdpGallery } from '@/ui/pdp/gallery'
import type { GalleryImage } from '@/ui/pdp/gallery'
import { PdpAnatomy, PdpStory, PdpWorn } from '@/ui/pdp/sections'

type Params = { slug: string }

/**
 * THE MEN'S PRODUCT PAGE — the demonstration, at full depth.
 *
 * Every card in the men's rack, on the homepage collection grid and in the quick views
 * now opens a real product page rather than an overlay. The architecture is the shared
 * one (`ui/pdp/*`): gallery with thumbnails and an enlarged view, buying panel, story,
 * anatomy, worn-in-context, related.
 *
 * The safeguards are what let a page this persuasive exist at all, and none of them may
 * be edited away while D-03 is open:
 *
 *   - NO PRICE, anywhere, in any form. There is no price field on a demo product, so
 *     there is nothing to render — the boundary is in the type, not in a template.
 *   - `noindex`, and absent from the sitemap. A demonstration is for the owner and the
 *     room, not for search.
 *   - Outside the catalogue: no repository, no search index, no facet, no trade route.
 *   - A fixture badge in the buying panel and the full statement at the foot.
 *   - Sizes render as a disabled fixture run, not a selectable stock promise.
 *
 * The trade panel is deliberately NOT wired here: wholesale price, MOQ, prepack and ship
 * window are restricted values that exist only for real catalogue products inside an
 * authorised session (`/trade/product/[slug]`). A demo product has no wholesale record,
 * so there is nothing to authorise and nothing to leak — and inventing one to make the
 * demonstration richer is exactly the false claim the whole surface is built to avoid.
 */
export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return MENS_DEMO_PRODUCTS.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const product = MENS_DEMO_PRODUCTS.find((p) => p.slug === slug)
  if (!product) return {}
  return {
    title: `${product.name} — demonstration`,
    description: `${product.description} A Frontier House demonstration: fixture data, reference photography, no prices.`,
    robots: { index: false },
  }
}

/** View names, in the order the gallery should read: front, then the rest. */
function galleryFrames(product: DemoProduct): GalleryImage[] {
  const names = ['Front', 'Worn', 'Detail', 'In context', 'Alternate']
  return product.media.map((image, index) => ({
    id: `frame-${product.slug}-${index}`,
    image,
    label: names[index] ?? `View ${index + 1}`,
  }))
}

export default async function MensProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = MENS_DEMO_PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  const related = MENS_DEMO_PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, 3)

  const anchor = `mens-${product.category.toLowerCase()}`
  const storyAside = product.anatomy?.[0]?.image ?? product.media[1]

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/">Home</Link> / <Link href="/mens">Men&rsquo;s</Link> /{' '}
          <Link href={`/mens#${anchor}`}>{product.category}</Link> / {product.name}
        </p>
      </nav>

      <div className="pdp">
        <PdpGallery frames={galleryFrames(product)} />

        <div className="stack pdp-panel">
          <div>
            <p className="eyebrow">{product.category} · demonstration</p>
            <h1 className="pdp__title">{product.name}</h1>
            <p className="lede">{product.description}</p>
          </div>

          {product.colours?.length ? (
            <div className="pdp-panel__row">
              <p className="pdp-panel__label">
                Colour <span className="pdp-panel__value">{product.colours[0]?.name}</span>
              </p>
              <ul className="swatches">
                {product.colours.map((colour) => (
                  <li key={colour.name}>
                    {/*
                      A swatch is a picture of a colour, not a control: one colourway
                      exists, so a button here would offer a choice that does not exist.
                      The name is text beside it, never colour alone.
                    */}
                    <span
                      className="swatch"
                      style={{ background: colour.swatch }}
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">{colour.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.sizes?.length ? (
            <div className="pdp-panel__row">
              <div className="pdp-panel__head">
                <p className="pdp-panel__label">Size</p>
                <Link href="/fit-passport" className="text-link">
                  Fit Passport
                </Link>
              </div>
              {/*
                Disabled on purpose. A selectable size implies a stock position, and this
                product has none — the run is a fixture. The control shows the SHAPE of
                the decision without pretending the decision can be made.
              */}
              <ul className="size-run" aria-label={`Fixture size run: ${product.sizesNote}`}>
                {product.sizes.map((size) => (
                  <li key={size}>
                    <span className="size-run__size">{size}</span>
                  </li>
                ))}
              </ul>
              <p className="meta">{product.sizesNote}. Not selectable — nothing is stocked.</p>
            </div>
          ) : null}

          <div className="pdp-panel__row">
            <p className="story__badge">Demonstration · fixture · no price exists</p>
            <div className="cluster">
              <Link href={`/mens#${anchor}`} className="button button--secondary">
                Back to {product.category.toLowerCase()}
              </Link>
              <Link href="/wholesale" className="text-link">
                How wholesale works
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PdpStory
        story={product.story}
        features={product.features}
        details={product.details}
        fit={product.fit}
        care={product.care}
        aside={storyAside}
        fixtureNote="Rows marked “seen” are visible in the photographs on this page. Everything else is fixture specification — replaced by the owner's real grading and construction data before anything ships."
      />

      <PdpAnatomy details={product.anatomy} />

      <PdpWorn frames={product.worn} />

      {related.length > 0 ? (
        <section className="section" aria-labelledby="pdp-related-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">More {product.category.toLowerCase()}</p>
              <h2 id="pdp-related-heading">Complete the look</h2>
            </div>
            <Link href={`/mens#${anchor}`} className="text-link">
              The whole rack
            </Link>
          </div>
          <ul className="related-grid">
            {related.map((other) => {
              const face = other.media[0]
              return (
                <li key={other.slug}>
                  <Link href={`/mens/${other.slug}`} className="related-grid__card">
                    {face ? (
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={face.asset.avifSrcSet}
                          sizes="(min-width: 62rem) 25vw, 50vw"
                        />
                        <source
                          type="image/webp"
                          srcSet={face.asset.webpSrcSet}
                          sizes="(min-width: 62rem) 25vw, 50vw"
                        />
                        <img
                          src={face.asset.poster}
                          alt={face.alt}
                          width={face.asset.intrinsicWidth}
                          height={face.asset.intrinsicHeight}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : null}
                    <span className="related-grid__name">{other.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <aside className="notice notice--fixture" aria-labelledby="pdp-demo-notice">
        <p className="notice__title" id="pdp-demo-notice">
          Demonstration only — fixture data, reference imagery
        </p>
        <p className="meta">
          This is not Lucky &amp; Blessed inventory. The name, specification, size run and
          availability are development fixtures; the photographs are reference images supplied
          for direction and are replaced by owned photography before anything ships (D-09). No
          price exists for this product in any form.
        </p>
      </aside>
    </div>
  )
}
