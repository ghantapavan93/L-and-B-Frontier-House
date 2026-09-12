import type { Metadata } from 'next'
import Link from 'next/link'
import { MaterialWall } from '@/ui/material-wall'

export const metadata: Metadata = {
  title: 'Legible at close range',
  description:
    'The weave, the topstitch, the hardware — Lucky & Blessed photographed close enough to read. Material honesty at high resolution, which is what premium means here.',
}

/**
 * THE MATERIAL WALL — the North Star's own sentence, given its own page.
 *
 * "Premium here means material honesty at high resolution" (CLAUDE.md §5). This band is
 * the place the site proves it: six photographs at a distance where the weave is legible.
 * On the homepage it was 1,834 px sat between the fit gateway and the second product
 * band, and it was doing the front page's job badly — a front page has one job, which is
 * to get someone to a garment in one screen — while being read by whoever scrolled that
 * far. It stands alone now, linked from the front page and from the product page's own
 * material rows, where the claim is actually being weighed.
 */
export default function MaterialPage() {
  return (
    <>
      <MaterialWall heading="h1" />
      <section className="container section--tight" aria-label="Where to next">
        <p className="meta">
          Read it on the garment. <Link href="/new-arrivals">Open the drop</Link>
          {' · '}
          <Link href="/thread-to-trade">Where the cloth comes from</Link>
        </p>
      </section>
    </>
  )
}
