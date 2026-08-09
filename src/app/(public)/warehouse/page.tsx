import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublicProducts } from '@/data/catalog-repository'
import { populatedEdits, productsInEdit } from '@/domain/edits'
import type { PublicProduct } from '@/domain/product'
import { primaryMedia } from '@/domain/product'
import { navigableCategories } from '@/domain/taxonomy'
import { AisleDepth } from '@/ui/motion/aisle-depth'
import { FixtureNotice } from '@/ui/notices'
import { ProductMedia } from '@/ui/product-media'

export const metadata: Metadata = {
  title: 'The Warehouse',
  description:
    'Walk the racks. Every garment in the published line, hung by edit, in one continuous aisle.',
}

/**
 * THE WAREHOUSE — the signature interaction, built on native scroll.
 *
 * The owner's brief: a giant horizontal world where garments appear like racks in depth,
 * hover brings one forward, the others fall backward. The constitution's brief: never
 * intercept the wheel (§9 — scroll-jacking measures ~5.6× more errors), and wide content
 * scrolls inside its own container, never the page.
 *
 * Both are satisfied by the same decision: the aisle is a REAL horizontal scroller.
 * Trackpads pan it natively, touch swipes it, the scrollbar is visible and honest,
 * keyboard focus walks it link by link and the browser scrolls each garment into view
 * itself. Depth is CSS perspective; the racks lean like garments on a rail; hover
 * straightens one and `:has()` recedes its rack-mates; entrances ride
 * `animation-timeline: view(inline)` — the horizontal twin of the vertical arrivals the
 * grid already runs.
 *
 * One motion island rides above all of that: `AisleDepth` reads native scroll progress
 * through a spring and publishes it as a CSS var the stylesheet spends on a dollying
 * perspective and counter-drifting signs (the motion-stack rule, CLAUDE.md §9). With
 * JavaScript off the island is inert markup and the aisle is complete.
 *
 * The racks are the EDITS — the campaign-safe merchandising groupings — plus a New Drop
 * rack from real arrival dates. Not the spec's DENIM/SHIRTS/JACKETS: those are garment
 * types the owner has not confirmed as navigation (the spec itself says "only use the
 * actual names/categories after the owner confirms"), where the edits are already
 * established, rule-stated, and tested to claim nothing.
 *
 * §11's exit: every garment IS the shop, and the aisle ends at the categories.
 */
export default async function WarehousePage() {
  const products = await listPublicProducts({ sort: 'newest' })

  const racks: { id: string; name: string; line: string; items: PublicProduct[] }[] = [
    {
      id: 'rack-new',
      name: 'New drop',
      line: 'Just landed, newest first.',
      items: products.filter((p) => p.newArrivalOn !== undefined).slice(0, 8),
    },
    ...populatedEdits(products).map((edit) => ({
      id: `rack-${edit.slug}`,
      name: edit.name,
      line: edit.line,
      items: productsInEdit(edit, products).slice(0, 8),
    })),
  ]

  return (
    <div className="warehouse">
      <div className="container section--tight">
        <nav aria-label="Breadcrumb">
          <p className="meta warehouse__crumb">
            <Link href="/">Home</Link> / The Warehouse
          </p>
        </nav>

        <p className="eyebrow warehouse__eyebrow">One aisle</p>
        <h1 className="warehouse__title">The Warehouse</h1>
        <p className="lede warehouse__lede">
          Every rack in the published line, hung in one aisle. Walk it sideways — hover a
          garment and it comes forward.
        </p>

        {/* Jump nav: real anchors, so the aisle is reachable without dragging anything.
            Fragment navigation scrolls the inner scroller natively. */}
        <nav aria-label="Racks" className="warehouse__jumps">
          {racks.map((rack) => (
            <a key={rack.id} href={`#${rack.id}`} className="warehouse__jump">
              {rack.name}
            </a>
          ))}
        </nav>
      </div>

      {/*
        The aisle is the AisleDepth island: the same native scroller, plus a sprung
        `--aisle-drift` var the CSS spends on a dollying perspective origin. Children are
        this server markup, unchanged; no JavaScript leaves the aisle complete.
      */}
      <AisleDepth>
        {racks.map((rack) => (
          <section
            key={rack.id}
            id={rack.id}
            className="warehouse__rack"
            aria-label={rack.name}
          >
            <header className="warehouse__sign">
              <h2 className="warehouse__sign-name">{rack.name}</h2>
              <p className="warehouse__sign-line">{rack.line}</p>
            </header>

            {rack.items.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="warehouse__item"
              >
                <ProductMedia media={primaryMedia(product)} sizes="18rem" />
                <span className="warehouse__item-name">{product.displayName}</span>
              </Link>
            ))}
          </section>
        ))}

        {/* The end of the aisle points at the shop proper — the one-action exit. */}
        <section
          className="warehouse__rack warehouse__rack--exit"
          aria-label="Shop by category"
        >
          <header className="warehouse__sign">
            <h2 className="warehouse__sign-name">The floor</h2>
            <p className="warehouse__sign-line">Everything, by category.</p>
          </header>
          <div className="warehouse__exit">
            {navigableCategories().map((category) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="button button--secondary"
              >
                {category.label}
              </Link>
            ))}
            <Link href="/new-arrivals" className="button button--secondary">
              New arrivals
            </Link>
          </div>
        </section>
      </AisleDepth>

      <div className="container section--tight">
        <p className="meta warehouse__hint" aria-hidden="true">
          Scroll sideways — or use the rack names above.
        </p>
        <FixtureNotice detail={false} />
      </div>
    </div>
  )
}
