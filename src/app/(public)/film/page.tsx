import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublicProducts } from '@/data/catalog-repository'
import { CampaignFilm } from '@/ui/campaign-film'
import { SplitCampaign } from '@/ui/house-strip'
import { MotionClipBand, ThisWeekBand } from '@/ui/this-week'

export const metadata: Metadata = {
  title: 'The house, on film',
  description:
    "Lucky & Blessed's own campaign film, the five newest garments as five frames, and the clips behind it — staged the way the reference does, on machinery that never takes the wheel.",
}

/**
 * THE FILM — the house's editorial surface, no longer the second screen of the homepage.
 *
 * The campaign stage and the clip band used to sit on the front page between the hero and
 * the first product; the spatial five-frame band and the two-frame campaign story sat
 * further down. Together they were four of the eighteen bands and 4,900 px of a page whose
 * only job is to reach a garment in one screen. Burberry puts one screen of film above
 * the fold and a shoppable rail under it (docs/research/teardown-burberry-gstar-vero.md
 * §1.2); the film-and-story surface is an editorial destination, and it is linked from the
 * front page rather than stacked on it.
 *
 * The order here is the reference's: film · shop rail · story · film. The five-frame band
 * is real product — every frame a working link — so this page, like the front page, never
 * makes anyone wait to shop.
 *
 * Nothing about the film changed by moving: the same poster-first markup, the same
 * click-to-play with a visible pause control, the same no-JS and Low Power Mode behaviour.
 */
export default async function FilmPage() {
  const newest = await listPublicProducts({ sort: 'newest' })
  return (
    <>
      <CampaignFilm heading="h1" />
      <ThisWeekBand products={newest} />
      <SplitCampaign />
      <MotionClipBand />
      <section className="container section--tight" aria-label="Where to next">
        <p className="meta">
          The garments in the film are the rack. <Link href="/new-arrivals">Open the drop</Link>
          {' · '}
          <Link href="/warehouse">Walk the Warehouse</Link>
        </p>
      </section>
    </>
  )
}
