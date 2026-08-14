import { officialMediaForSlot } from '@/content/media/official-media'
import { getFacets } from '@/data/catalog-repository'
import { DENIM_LEG_OPENINGS } from '@/features/discovery/denim-finder'
import { EditorialMedia } from '@/ui/product-media'

/**
 * THE FIT GATEWAY — denim's cuts as a homepage band.
 *
 * The strongest denim references put the fit families in a photographed tile row with one
 * URL per cut; our audit called the questionnaire-only approach "asking the visitor to do
 * work a tile row lets them point at". This is that band, built honest-side-up:
 *
 *   - Each tile is a real crawlable `<a>` to a real filtered category URL — the same URLs
 *     the PLP chip row uses, so the two surfaces can never disagree.
 *   - The count comes from the live facet tally, so a cut with nothing behind it never
 *     renders a dead door.
 *   - The one-line gloss under each cut describes THE CUT, not the product: garment-
 *     vocabulary campaign voice, no fabricated product facts.
 *   - IMAGERY IS OPT-IN BY SLOT. A tile looks for owner photography at `fit-<value>`
 *     (e.g. `fit-bootcut`) via the official-media manifest. Present → photographed tile;
 *     absent → typographic tile. No placeholder is ever mounted, so the media-integrity
 *     gate stays quiet and the owner can upgrade one tile at a time by supplying files —
 *     zero code changes.
 */

/** Campaign-voice glosses — statements about a cut's geometry, never about a product. */
const GLOSS: Record<string, string> = {
  straight: 'One line, hip to hem.',
  bootcut: 'Room at the hem for a heel.',
  flare: 'Fitted knee, open finish.',
  'wide-leg': 'Full through the leg, floor-bound.',
  trouser: 'Pressed, tailored, upright.',
  tapered: 'Narrowing to the ankle.',
}

export async function FitGateway() {
  const facets = await getFacets('women')
  const cuts = DENIM_LEG_OPENINGS.map((cut) => {
    const tally = facets.legOpening.find((entry) => entry.value === cut.value)
    return { ...cut, count: tally?.count ?? 0, media: officialMediaForSlot(`fit-${cut.value}`) }
  }).filter((cut) => cut.count > 0)

  if (cuts.length < 2) return null

  return (
    <section className="container section fit-gateway" aria-labelledby="fit-gateway-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Denim, by cut</p>
          <h2 id="fit-gateway-heading">Know your line</h2>
          <p className="meta">
            Four cuts, one house. Point at yours — or answer three questions and let the finder
            point for you.
          </p>
        </div>
        <a href="/find-your-denim" className="text-link">
          Find your denim
        </a>
      </div>

      <ul className="fit-gateway__grid">
        {cuts.map((cut) => (
          <li key={cut.value}>
            <a
              className="fit-gateway__tile"
              href={`/shop/women?legOpening=${cut.value}#products`}
            >
              {cut.media ? (
                <span className="fit-gateway__media" aria-hidden="true">
                  <EditorialMedia media={cut.media} sizes="(min-width: 62rem) 25vw, 50vw" />
                </span>
              ) : null}
              <span className="fit-gateway__body">
                <span className="fit-gateway__name">{cut.label}</span>
                <span className="fit-gateway__gloss">{GLOSS[cut.value] ?? ''}</span>
                <span className="fit-gateway__count">
                  {cut.count} {cut.count === 1 ? 'style' : 'styles'}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
