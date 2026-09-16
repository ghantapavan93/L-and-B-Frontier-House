import { officialMediaForSlot } from '@/content/media/official-media'
import { EditorialMedia } from '@/ui/product-media'

/**
 * OPERATIONS — the four facts, as four cards.
 *
 * The facts are verified (docs/brand-research/00_BRAND_TRUTH.md) and stay live HTML: a
 * heading and a line per card, never written into an image. Each card carries one
 * owner-generated render placed under the names `operations-01-fill-rate` …
 * `04-showroom` (2026-09-16), mounted one to one and nowhere else. The showroom render
 * is a generic interior before a skyline; the real showroom is #13656 at the Dallas
 * Market Center, and the line under it says so — the picture illustrates, the text
 * claims. Every card shows the plate marker. Without a render a card is text on the
 * sunken surface; nothing is invented to fill the box.
 */
const CARDS = [
  {
    slot: 'operations-01-fill-rate',
    term: 'Fill rate',
    detail: '100% of orders filled complete.',
    alt: 'Generated render of bagged, folded garments in a grid with a conveyor through it',
  },
  {
    slot: 'operations-02-processing',
    term: 'Processing',
    detail: '2.64 days on average. Order by 5pm CST and we ship same or next business day.',
    alt: 'Generated render of a bagged garment passing through a lit scanner',
  },
  {
    slot: 'operations-03-minimum-prepacks',
    term: 'Minimum',
    detail: '$50 per order. Prepacks of 6.',
    alt: 'Generated render of six bagged, tagged garments beside an open carton',
  },
  {
    slot: 'operations-04-showroom',
    term: 'Showroom',
    detail: '#13656, Dallas Market Center. Markets August 18–21 and October 20–23, 2026.',
    alt: 'Generated render of a showroom interior with garment rails before a skyline',
  },
] as const

export function OperationsCards() {
  return (
    <section className="container section" aria-labelledby="ops-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Operations</p>
          <h2 id="ops-heading">How we ship</h2>
        </div>
      </div>

      <ul className="ops-cards">
        {CARDS.map((card) => {
          const plate = officialMediaForSlot(card.slot, card.alt)
          return (
            <li className="ops-card" key={card.slot}>
              {plate ? (
                <div className="ops-card__media" aria-hidden="true">
                  <EditorialMedia
                    media={plate}
                    sizes="(min-width: 62rem) 22vw, (min-width: 48rem) 45vw, 100vw"
                  />
                  <span className="plate-note plate-note--card">Generated artwork</span>
                </div>
              ) : null}
              <div className="ops-card__body">
                <h3 className="ops-card__term">{card.term}</h3>
                <p className="ops-card__detail">{card.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
