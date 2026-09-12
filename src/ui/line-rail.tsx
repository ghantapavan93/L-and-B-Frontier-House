import Link from 'next/link'
import type { Category } from '@/domain/taxonomy'
import type { PublicProduct } from '@/domain/product'
import { ProductCard } from '@/ui/product-card'
import { ScrollRail } from '@/ui/scroll-rail'

/**
 * THE LINE — the second shop rail, with the segmented control inside it.
 *
 * Burberry's homepage carries two product rails in seven bands, and the second is not a
 * repeat of the first: a different grouping, its own Women | Men switch, eight prices in
 * 629 px (docs/research/teardown-burberry-gstar-vero.md §1.2). After three passes of
 * cutting, this page had one rail — nine garments against their sixteen. This is the
 * second, and it is deliberately DIFFERENT product: every garment here is one the sheet
 * above does not show, grouped by the shippable taxonomy, with the switch the reference
 * puts inside the rail rather than above the page.
 *
 * The switch is three radio inputs and three labels. No JavaScript, no ARIA tab pattern
 * to keep honest, no state to hydrate: `:checked` on the input shows the matching panel
 * through a sibling selector, which is the same machinery the marquee's pause control and
 * the contact sheet's `:target` stories already run on. Arrow keys move between panels
 * because that is what a radio group does; a label is a 44 px target because the input
 * sits over it. With CSS off every panel shows, which is the correct failure — nothing
 * here may ever hide a product behind a script.
 *
 * Panels are server-rendered in full. A category the sheet has already emptied is
 * omitted rather than shown empty — an empty tab is a promise the page cannot keep.
 */
export type LinePanel = {
  readonly category: Category
  /** Garments in this category that the first rail does not already carry. */
  readonly products: readonly PublicProduct[]
  /** Every public garment in the category, for the "see all" line. */
  readonly total: number
}

export function LineRail({ panels }: { panels: readonly LinePanel[] }) {
  const live = panels.filter((panel) => panel.products.length > 0)
  if (live.length === 0) return null

  return (
    <section className="container section line-rail" aria-labelledby="line-rail-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">The line</p>
          <h2 id="line-rail-heading">Beyond this week</h2>
        </div>
      </div>

      {/*
        Inputs first, as direct children, so the panel selector can reach them as
        siblings. The fieldset gives the group its accessible name; each input is
        visually hidden but keeps its full 44 px hit area over its label.
      */}
      <fieldset className="line-rail__switch">
        <legend className="visually-hidden">Show the line by category</legend>
        {live.map((panel, index) => (
          <span className="line-rail__option" key={panel.category.slug}>
            <input
              type="radio"
              name="line-rail"
              id={`line-${panel.category.slug}`}
              className="line-rail__state"
              defaultChecked={index === 0}
            />
            <label htmlFor={`line-${panel.category.slug}`}>{panel.category.label}</label>
          </span>
        ))}
      </fieldset>

      <div className="line-rail__panels">
        {live.map((panel) => (
          <div
            className="line-rail__panel"
            key={panel.category.slug}
            aria-label={`${panel.category.label} — ${panel.products.length} of ${panel.total}`}
          >
            {/*
              ONE ROW, SCROLLING — which is what "rail" means. Burberry fits eight garments
              in 629 px because the rail is a horizontal scroller, not a grid; laid out as a
              grid this band ran 1,829 px, three times the reference for the same product.
              Native overflow with snap, railed with arrows and a progress bar when JS is
              present, a plain scroller when it is not. The wheel is never touched.
            */}
            <ScrollRail>
              <ul className="line-rail__strip" data-rail-scroller="">
                {panel.products.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      sizes="(min-width: 62rem) 22vw, (min-width: 48rem) 33vw, 70vw"
                    />
                  </li>
                ))}
              </ul>
            </ScrollRail>
            <p className="line-rail__all">
              <Link href={`/shop/${panel.category.slug}`} className="text-link">
                All {panel.total} in {panel.category.label}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
