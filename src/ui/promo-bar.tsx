import Link from 'next/link'
import { promoBarEntry } from '@/content/programming'

/**
 * THE PROMO BAR — one quiet line above the header, from the programming calendar.
 *
 * The live business announces its calendar loudly (a red clearance item in the nav); the
 * references announce theirs in a single small-caps line that scrolls away with the page.
 * This renders the highest-priority live programming entry and nothing else — never a
 * stack of banners, never a discount figure, and nothing at all when no verified entry is
 * in window. Static HTML; scrolls away because it is NOT inside the sticky header.
 */
export function PromoBar() {
  const entry = promoBarEntry()
  if (!entry) return null

  return (
    <aside className="promo-bar" aria-label="Announcement">
      <p className="promo-bar__line">
        <span>{entry.title}</span>
        <Link href={entry.href}>{entry.ctaLabel}</Link>
      </p>
    </aside>
  )
}
