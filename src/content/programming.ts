/**
 * PROGRAMMING — the merchandising calendar as content, not code.
 *
 * The live business runs its calendar in the navigation itself: New Arrivals, Specials,
 * Styles of the Week, Fall 2026 Collection, Clearance. Every one of those is a hardcoded
 * platform page a developer touched. This module is the same calendar as *entries*: a drop,
 * a sale, a lookbook, a market week or a promo line is a record with a window, and the
 * header, homepage and drop page render whatever is live — so next week's launch is a data
 * edit, never a redesign.
 *
 * Content-claim rules (CLAUDE.md §12, §13b) applied per entry:
 *   - Verified facts (market dates, the weekly drop cadence) ship as `live`.
 *   - Anything demonstrative but unverified ships as `draft` and renders nowhere. The model
 *     proves SALE/CAMPAIGN support without publishing an invented promotion.
 *   - No entry may carry a price, a discount figure, or a claim the catalogue cannot back.
 *
 * When a real CMS arrives (OQ-15), this file becomes an adapter read; the types are the
 * contract.
 */

export type ProgrammingKind = 'drop' | 'sale' | 'lookbook' | 'market' | 'campaign' | 'promo-bar'

export type ProgrammingStatus = 'draft' | 'live' | 'ended'

export type ProgrammingAudience = 'public' | 'wholesale'

export type ProgrammingEntry = {
  readonly id: string
  readonly kind: ProgrammingKind
  /** Short display title — nav-safe. */
  readonly title: string
  /** One editorial sentence. Optional; shown where the surface has room. */
  readonly statement?: string
  readonly status: ProgrammingStatus
  /** ISO dates. An entry with a window renders only inside it. */
  readonly startsOn?: string
  readonly endsOn?: string
  /** Where the entry sends people. Always a public route. */
  readonly href: string
  readonly ctaLabel: string
  readonly audience: ProgrammingAudience
  /** Lower renders first when surfaces show more than one. */
  readonly priority: number
  /** Named media slot (content/media/official-media.ts) once owner art exists. */
  readonly mediaSlot?: string
  /** True when every fact in the entry is verified brand truth. */
  readonly verified: boolean
}

export const PROGRAMMING: readonly ProgrammingEntry[] = [
  {
    id: 'dallas-market-aug-2026',
    kind: 'market',
    title: 'Dallas Market · August 18–21',
    statement:
      'Showroom #13656, Dallas Market Center. Come see the line hung, handled and in person.',
    status: 'live',
    startsOn: '2026-07-01',
    endsOn: '2026-08-21',
    href: '/wholesale',
    ctaLabel: 'Plan your visit',
    audience: 'public',
    priority: 1,
    mediaSlot: 'programming-market',
    verified: true,
  },
  {
    id: 'weekly-drop',
    kind: 'drop',
    title: 'This week’s drop',
    statement: 'New styles land weekly. Everything new in one sheet.',
    status: 'live',
    href: '/new-arrivals',
    ctaLabel: 'Open the drop',
    audience: 'public',
    priority: 2,
    mediaSlot: 'programming-drop',
    verified: true,
  },
  {
    id: 'campaign-film',
    kind: 'campaign',
    /*
      THE SEASON NAME IS GONE, AND THE RUNTIME STAYS.

      This shipped as "Fall Collection 2026". Checked against the source: the owner's file
      is `video_6a36d58ece9146.64769701.mp4` — a hash. No season name came with it, and no
      source in the corpus establishes that L&B names seasons at all. The title was ours,
      which makes it exactly the invented brand vocabulary §12 forbids.

      "Eighteen seconds" survives because it was MEASURED, not assumed: the file reports
      duration 18.0 at 1350×1200. And the film is described as the house's own because it
      arrived in the owner's drop — a statement about provenance, not about who held the
      camera, which we do not know.
    */
    title: 'The house on film',
    statement: 'Eighteen seconds of the line, on film.',
    status: 'live',
    href: '/new-arrivals',
    ctaLabel: 'See what just landed',
    audience: 'public',
    priority: 3,
    mediaSlot: 'campaign-fall-2026',
    verified: true,
  },
  {
    id: 'edit-working-west',
    kind: 'lookbook',
    title: 'The Working West',
    statement: 'Denim that expects a full day — the edit.',
    status: 'live',
    href: '/edit/working-west',
    ctaLabel: 'Open the edit',
    audience: 'public',
    priority: 4,
    verified: true,
  },
  /*
   * DRAFT — demonstrates the sale shape without publishing an invented promotion. No live
   * sale is verified, and §13b forbids shipping one. Flip to `live` with real dates and a
   * real scope when the owner runs one.
   */
  {
    id: 'sale-template',
    kind: 'sale',
    title: 'Season close',
    statement: 'Last chance on the outgoing season.',
    status: 'draft',
    href: '/new-arrivals',
    ctaLabel: 'Shop the sale',
    audience: 'public',
    priority: 5,
    verified: false,
  },
] as const

function inWindow(entry: ProgrammingEntry, onDate: string): boolean {
  if (entry.startsOn && onDate < entry.startsOn) return false
  if (entry.endsOn && onDate > entry.endsOn) return false
  return true
}

/**
 * Entries fit to render today: live, verified, inside their window.
 *
 * `onDate` defaults to the render date. Public pages are statically prerendered, so in
 * production this resolves at build time and a window edge takes effect on the next
 * revalidation — the operational note is in the progress report. Tests pass a fixed date.
 */
export function liveProgramming(
  kind?: ProgrammingKind,
  onDate: string = new Date().toISOString().slice(0, 10),
  /*
    AUDIENCE DEFAULTS TO PUBLIC, AND THAT DEFAULT IS THE POINT.

    This filter read status, verified, window and kind — but never `audience`, the field
    the type carries precisely to separate buyer programming from public programming. Every
    entry today is `public`, so nothing leaked; but `promoBarEntry()` feeds the promo bar
    that sits above the header on every public page, so the first `audience: 'wholesale'`
    entry anyone added — a buyer-only preorder cutoff, a market appointment window — would
    have published itself to the open web on the next build.

    Defaulting to `'public'` means a caller must ASK for wholesale programming and can only
    be doing so inside an authorised surface. The unsafe direction now requires an argument.
  */
  audience: ProgrammingAudience = 'public',
): readonly ProgrammingEntry[] {
  return PROGRAMMING.filter(
    (entry) =>
      entry.status === 'live' &&
      entry.verified &&
      entry.audience === audience &&
      inWindow(entry, onDate) &&
      (kind === undefined || entry.kind === kind),
  ).sort((a, b) => a.priority - b.priority)
}

/** The single line the promo bar carries, or null when nothing qualifies. */
export function promoBarEntry(onDate?: string): ProgrammingEntry | null {
  const [first] = liveProgramming(undefined, onDate)
  return first ?? null
}
