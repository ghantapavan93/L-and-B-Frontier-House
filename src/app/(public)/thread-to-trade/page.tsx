import type { Metadata } from 'next'
import Link from 'next/link'
import { ThreadToTradeJourney } from '@/ui/thread-to-trade'

export const metadata: Metadata = {
  title: 'Thread to trade — one chain, end to end',
  description:
    'Textile, design, manufacturing, distribution and sales — the five stages Lucky & Blessed owns, in their own words, with the operational proof at each one.',
}

/**
 * THREAD TO TRADE — the five-stage journey, given its own ground.
 *
 * This is the longest single band the homepage ever carried: 3,450 px at 1440 wide, close
 * to four screens, sat two-thirds of the way down a page that was already twenty-five
 * screens long. It is also one of the best things the site says — the verified fact of
 * vertical integration, told as a chain rather than as a bullet — and it was being read by
 * almost nobody, because almost nobody scrolls to screen nineteen.
 *
 * A surface that stands alone is a surface people arrive at. The front page keeps the
 * five-column summary (`ThreadToTrade`), which says the fact in one band, and links here
 * for the journey. Same stages, same proofs, same routing thread, same sticky chapter
 * rail — it lost nothing by moving, and gained a URL.
 */
export default function ThreadToTradePage() {
  return (
    <>
      <ThreadToTradeJourney heading="h1" />
      <section className="container section--tight" aria-label="Where to next">
        <p className="meta">
          The chain ends at your door. <Link href="/wholesale">How to buy</Link>
          {' · '}
          <Link href="/calendar">Markets and drops</Link>
        </p>
      </section>
    </>
  )
}
