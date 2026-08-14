import type { Metadata } from 'next'
import Link from 'next/link'
import {
  PLATE_CORRAL_WIDE,
  PLATE_MARKER,
  PLATE_RANCH_ROAD,
  PLATE_STOREFRONT,
  PLATE_TILES,
} from '@/content/media/frontier-plates'
import {
  MENS_DEMO_CAMPAIGN,
  MENS_DEMO_CATEGORIES,
  MENS_DEMO_FLOOR,
  MENS_DEMO_PRODUCTS,
} from '@/fixtures/mens-demo'
import type { DemoImage, DemoProduct } from '@/fixtures/mens-demo'

/**
 * MEN'S — the Frontier House demonstration surface.
 *
 * D-03 remains the owner's decision, and this page's job is to make that decision
 * tangible without turning into a capability claim. The rules that keep it honest:
 *
 *   - Everything renders from `fixtures/mens-demo`, which lives OUTSIDE the catalogue:
 *     no repository, no search, no facets, no sitemap entry, no product routes.
 *   - The page says what it is in the first line, and the fixture flag is unmissable.
 *   - No price appears in any form. Sizes are labelled fixture runs.
 *   - The photography is reference imagery the owner dropped in for direction; it is
 *     replaced by owned photography before anything ships (D-09), and the page says so.
 *   - Boots appear only inside campaign frames — footwear is not a demo category.
 *   - `noindex`: a demonstration is for the owner and the room, not for search engines.
 *
 * The mechanics are the same ones the live store runs — cards, hover swap where a second
 * frame exists, `:target` quick views with zero JavaScript — so the demonstration is of a
 * working shop, not a mockup.
 */
export const metadata: Metadata = {
  title: 'Men’s — the Frontier House demonstration',
  description:
    'A working demonstration of a future men’s line: fixture data, reference imagery, real mechanics. Not a published catalogue.',
  robots: { index: false },
}

function MensImage({
  image,
  sizes = '(min-width: 62rem) 25vw, 50vw',
  loading = 'lazy',
}: {
  image: DemoImage
  sizes?: string
  loading?: 'lazy' | 'eager'
}) {
  const { asset, alt } = image
  return (
    <picture>
      <source type="image/avif" srcSet={asset.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={asset.webpSrcSet} sizes={sizes} />
      <img
        src={asset.poster}
        alt={alt}
        width={asset.intrinsicWidth}
        height={asset.intrinsicHeight}
        style={{ aspectRatio: `${asset.intrinsicWidth} / ${asset.intrinsicHeight}` }}
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}

function DemoCard({ product }: { product: DemoProduct }) {
  const [face, swap] = product.media

  return (
    <article className="product-card">
      {/* The card opens the product's own page — the quick view below stays as the
          glance, exactly as it works on the real catalogue. */}
      <a href={`/mens/${product.slug}`} className="product-card__link">
        {face ? (
          swap ? (
            <span className="product-card__swap">
              <span className="product-card__media">
                <MensImage image={face} />
              </span>
              <span aria-hidden="true" className="product-card__alt">
                <span className="product-card__media">
                  <MensImage image={swap} />
                </span>
              </span>
            </span>
          ) : (
            <span className="product-card__media">
              <MensImage image={face} />
            </span>
          )
        ) : null}
        <h3 className="product-card__name">{product.name}</h3>
      </a>
      <p className="product-card__spec">
        {product.category} · {product.sizesNote}
      </p>
      <div className="badge-row">
        <span className="badge badge--quiet">Demo fixture</span>
      </div>
      <a className="product-card__quick" href={`#qvd-${product.slug}`}>
        Quick view<span className="visually-hidden"> — {product.name}</span>
      </a>
    </article>
  )
}

function DemoQuickView({ product }: { product: DemoProduct }) {
  const [face, ...rest] = product.media

  return (
    <article
      className="quick-view"
      id={`qvd-${product.slug}`}
      tabIndex={-1}
      aria-label={`${product.name} — quick view`}
    >
      <a
        className="quick-view__backdrop"
        href={`#pd-${product.slug}`}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="quick-view__panel">
        <div className="quick-view__media">
          {/*
            Eager, deliberately: a lazy image inside a display:none overlay only starts
            loading after :target reveals it, so a direct link to the hash opens onto a
            blank column. The URL is the same one the card face uses, so this costs one
            early fetch, not a duplicate.
          */}
          {face ? (
            <MensImage image={face} sizes="(min-width: 62rem) 24rem, 90vw" loading="eager" />
          ) : null}
          {rest.length > 0 ? (
            <div className="quick-view__thumbs">
              {rest.map((image) => (
                <MensImage key={image.asset.poster} image={image} sizes="8rem" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="quick-view__copy">
          <p className="eyebrow">{product.category} · demo fixture</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="meta">{product.sizesNote}. No price exists for a demo entry.</p>
          <div className="cluster">
            <a href={`/mens/${product.slug}`} className="button">
              View product
            </a>
            <a href={`#pd-${product.slug}`} className="button button--secondary">
              Close
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function MensPage() {
  const [gravel, bootPull] = MENS_DEMO_CAMPAIGN

  return (
    <>
      {/*
        THE TITLE CARD FIRST.

        The owner dropped generated campaign renders that carry the house name and the
        register in one frame, so the page now opens the way the plate was drawn to be
        seen: full width, before any chrome or copy. Art-directed — the wide corral frame
        on desktop, the portrait storefront frame on a phone — and marked as generated
        artwork ON the image, not in a footnote. The two fabrications baked into the
        source renders (an invented founding date, an invented trust claim) were cropped
        out at import and exist in no published file.
      */}
      <section
        className="plate-hero"
        aria-label="Frontier House campaign title card — generated artwork"
      >
        <picture>
          <source
            type="image/avif"
            media="(min-width: 48rem)"
            srcSet={PLATE_CORRAL_WIDE.asset.avifSrcSet}
            sizes="100vw"
          />
          <source
            type="image/webp"
            media="(min-width: 48rem)"
            srcSet={PLATE_CORRAL_WIDE.asset.webpSrcSet}
            sizes="100vw"
          />
          <source type="image/avif" srcSet={PLATE_STOREFRONT.asset.avifSrcSet} sizes="100vw" />
          <source type="image/webp" srcSet={PLATE_STOREFRONT.asset.webpSrcSet} sizes="100vw" />
          {/* One alt that is true for both art directions — the frame swaps, the meaning
              does not. Aspect ratios are reserved in CSS per breakpoint, so neither
              direction shifts layout while it loads. */}
          <img
            src={PLATE_CORRAL_WIDE.asset.poster}
            alt="Generated campaign artwork: Frontier House by Lucky & Blessed — old materials, new interface. A man in denim in golden-hour western light."
            width={PLATE_CORRAL_WIDE.asset.intrinsicWidth}
            height={PLATE_CORRAL_WIDE.asset.intrinsicHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <p className="plate-note">{PLATE_MARKER}</p>
      </section>

      <div className="container section stack">
        <nav aria-label="Breadcrumb">
          <p className="meta">
            <Link href="/">Home</Link> / Men&rsquo;s
          </p>
        </nav>

        <header className="mens-hero__copy">
          <p className="eyebrow">Frontier House · demonstration</p>
          <h1 id="mens-hero-heading">The men&rsquo;s direction, made tangible.</h1>
          <p className="lede">
            Lucky &amp; Blessed sells women&rsquo;s, girls&rsquo; and accessories today. A
            men&rsquo;s line is a decision the owner has not made — so this is a working
            demonstration of that business: real shop mechanics, on fixture data, reference
            photography and clearly-marked generated campaign artwork, with no price anywhere.
          </p>
          <p className="mens-hero__badge">Demonstration · fixture data · no prices</p>
        </header>

        {MENS_DEMO_CATEGORIES.map((category) => {
          const rack = MENS_DEMO_PRODUCTS.filter((p) => p.category === category)
          if (rack.length === 0) return null
          const headingId = `mens-${category.toLowerCase()}`
          return (
            <section key={category} aria-labelledby={headingId}>
              <div className="section-head">
                <div>
                  <p className="eyebrow">The rack</p>
                  <h2 id={headingId}>{category}</h2>
                </div>
              </div>
              <ul className="product-grid">
                {rack.map((product) => (
                  <li key={product.slug} id={`pd-${product.slug}`}>
                    <DemoCard product={product} />
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <section aria-labelledby="mens-film-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">See it move</p>
              <h2 id="mens-film-heading">The reference film</h2>
              <p className="meta">
                Dropped in with the photographs — plays on your click, never by itself.
                Reference footage only, replaced by owned film before anything ships (D-09).
              </p>
            </div>
          </div>
          {/*
          User-initiated playback: `preload="none"` so the 4.8 MB file costs nothing until
          asked for, native controls because a click-to-play product film is a player, and
          no autoplay — so WCAG 2.2.2 never engages. The poster is a frame of the film
          itself, captured at import.
        */}
          <figure className="mens-film">
            <video
              controls
              preload="none"
              playsInline
              poster="/media/mens-demo/reference-film-poster.webp"
              width={1920}
              height={1080}
            >
              <source src="/media/mens-demo/reference-film.mp4" type="video/mp4" />
              Your browser cannot play this film. It is reference footage of denim in motion.
            </video>
            <figcaption className="meta">
              Reference film · fixture — not Lucky &amp; Blessed footage
            </figcaption>
          </figure>
        </section>

        {gravel && bootPull ? (
          <section aria-labelledby="mens-campaign-heading">
            <div className="section-head">
              <div>
                <p className="eyebrow">Campaign frames</p>
                <h2 id="mens-campaign-heading">Context, not catalogue</h2>
                <p className="meta">
                  Reference frames and generated plates for the campaign register. Footwear
                  appears here only as styling — it is not a demo category and carries no
                  product entry.
                </p>
              </div>
            </div>
            <div className="editorial-split">
              <figure className="editorial-split__figure depth-far">
                <MensImage image={gravel} sizes="(min-width: 62rem) 55vw, 100vw" />
                <figcaption>Campaign reference imagery · pending licensing (D-09)</figcaption>
              </figure>
              <figure className="editorial-split__figure depth-far">
                <MensImage image={bootPull} sizes="(min-width: 62rem) 40vw, 100vw" />
                <figcaption>Campaign reference imagery · pending licensing (D-09)</figcaption>
              </figure>
            </div>

            {/*
            The generated plates, recomposed. The source collage baked a fake button and a
            "TRUSTED BY GENERATIONS" strip into its pixels; the import kept only the three
            clean tiles and the truck frame (its invented founding date cropped away), and
            this grid rebuilds the composition out of real markup instead of painted UI.
          */}
            <figure className="plate-collage">
              <div className="plate-collage__grid">
                <div className="plate-collage__lead">
                  <MensImage image={PLATE_RANCH_ROAD} sizes="(min-width: 62rem) 55vw, 100vw" />
                </div>
                <div className="plate-collage__stack">
                  {PLATE_TILES.map((tile) => (
                    <div key={tile.asset.poster}>
                      <MensImage image={tile} sizes="(min-width: 62rem) 36vw, 100vw" />
                    </div>
                  ))}
                </div>
              </div>
              <figcaption className="meta">
                {PLATE_MARKER} · the campaign register, drawn before it is shot
              </figcaption>
            </figure>
          </section>
        ) : null}

        {/*
        THE FLOOR — every remaining frame the owner sent, as a contact sheet.

        Twenty photographs that read as styling rather than product: worn looks, hems over
        boots, hardware, texture. They earn a place because this is how the trousers are
        actually worn, and because a men's house is judged on how much of it you can see.
        No names, no sizes, no prices — the heading says what the group is.
      */}
        <section aria-labelledby="mens-floor-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">The floor</p>
              <h2 id="mens-floor-heading">How it is worn</h2>
              <p className="meta">
                The rest of the reference drop — looks, hems, hardware and texture. Styling
                frames, not entries to buy; footwear is not a demo category.
              </p>
            </div>
          </div>
          <ul className="mens-floor">
            {MENS_DEMO_FLOOR.map((image) => (
              <li key={image.asset.poster}>
                <MensImage image={image} sizes="(min-width: 62rem) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="mens-next-heading">
          <h2 className="eyebrow" id="mens-next-heading">
            What this would take
          </h2>
          <p className="meta">
            Real SKUs, names, sizes, prepacks, wholesale terms and owned photography — none of
            which exists yet. The mechanics on this page are the ones the store already runs, so
            the day the owner decides, the rack fills rather than gets rebuilt.
          </p>
          <div className="cluster" style={{ marginTop: 'var(--space-4)' }}>
            <Link href="/wholesale" className="button button--secondary">
              How wholesale works
            </Link>
            <Link href="/shop/women" className="button button--secondary">
              The line that ships today
            </Link>
          </div>
        </section>

        {/* The full statement, in full, at the foot — the badge above carries it on arrival. */}
        <aside className="notice notice--fixture" aria-labelledby="mens-demo-notice">
          <p className="notice__title" id="mens-demo-notice">
            Demonstration only — fixture data, reference imagery
          </p>
          <p className="meta">
            Nothing here is Lucky &amp; Blessed inventory. Names, sizes and availability are
            development fixtures. The photographs are reference images supplied for direction —
            several are small thumbnails — and the campaign plates are generated artwork, drawn
            rather than photographed, marked as such where they appear. All of it is replaced by
            owned photography before anything ships (D-09). No price exists on this surface in
            any form.
          </p>
        </aside>

        {MENS_DEMO_PRODUCTS.map((product) => (
          <DemoQuickView key={product.slug} product={product} />
        ))}
      </div>
    </>
  )
}
