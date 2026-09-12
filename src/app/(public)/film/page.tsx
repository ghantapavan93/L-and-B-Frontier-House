import type { Metadata } from 'next'
import Link from 'next/link'
import { CampaignFilm } from '@/ui/campaign-film'
import { MotionClipBand } from '@/ui/this-week'

export const metadata: Metadata = {
  title: 'The house, on film',
  description:
    "Lucky & Blessed's own campaign film and the clips behind it — staged the way the reference does, on machinery that never takes the wheel.",
}

/**
 * THE FILM — its own page, no longer the second screen of the homepage.
 *
 * The campaign stage and the clip band used to sit on the front page between the hero and
 * the first product. That is where the homepage's length came from: a full-viewport film
 * directly under a full-viewport ignition, saying "the house" twice before a single garment
 * could be reached. Burberry puts one screen of film above the fold and a shoppable rail
 * immediately under it (docs/research/teardown-burberry-gstar-vero.md §1.2); the
 * film-and-clips surface is an editorial destination, and it is linked from the front page
 * rather than stacked on it.
 *
 * Nothing about the film changed by moving: the same poster-first markup, the same
 * click-to-play with a visible pause control, the same no-JS and Low Power Mode behaviour.
 * "Every surface must stand alone" (CLAUDE.md §6) — this one now does.
 */
export default function FilmPage() {
  return (
    <>
      <CampaignFilm heading="h1" />
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
