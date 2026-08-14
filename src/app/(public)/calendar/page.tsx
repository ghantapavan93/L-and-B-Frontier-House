import type { Metadata } from 'next'
import Link from 'next/link'
import { publicProgramme } from '@/content/programming'

export const metadata: Metadata = {
  title: 'The calendar',
  description:
    'Markets, drops and campaigns from Lucky & Blessed — every date verified, nothing invented.',
}

/**
 * THE HOUSE CALENDAR — time as a page.
 *
 * The drops research found the category communicates newness as a badge and a sort order,
 * never as a plan — and that the wholesale platforms treat the calendar as core buyer
 * infrastructure. This page is the public half of that system: every verified market
 * window, standing drop and campaign, in one place a boutique owner can plan against.
 *
 * The integrity rules ARE the design:
 *   - Only `verified: true` entries render (the helper enforces it) — a date on this page
 *     is a date the business has published, never a projection.
 *   - No countdowns, no scarcity theatre. The category research showed the drop-native
 *     brands sell urgency and then document the race conditions it causes; a house with a
 *     verified 100% fill rate sells the opposite. Dates state themselves.
 *   - Entries without windows are the standing programme, labelled exactly that.
 *
 * The buyer-facing half (preorder cutoffs, delivery windows per drop) exists in the data
 * model but renders nowhere until the owner supplies real dates — absent, not invented.
 */

function windowLabel(startsOn?: string, endsOn?: string): string | null {
  if (!startsOn && !endsOn) return null
  const format = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })
  if (startsOn && endsOn) return `${format(startsOn)} — ${format(endsOn)}`
  if (endsOn) return `Through ${format(endsOn)}`
  return `From ${format(startsOn as string)}`
}

export default function CalendarPage() {
  const programme = publicProgramme()
  const dated = programme.filter((entry) => entry.startsOn || entry.endsOn)
  const standing = programme.filter((entry) => !entry.startsOn && !entry.endsOn)

  return (
    <div className="container section stack">
      <header>
        <p className="eyebrow">The calendar</p>
        <h1>What the house has planned</h1>
        <p className="lede">
          Markets, drops and campaigns — every date on this page is published by the business,
          and nothing here counts down at you.
        </p>
      </header>

      {dated.length > 0 ? (
        <section aria-labelledby="calendar-dated">
          <h2 id="calendar-dated" className="visually-hidden">
            Dated programme
          </h2>
          <ol className="calendar">
            {dated.map((entry) => (
              <li key={entry.id} className="calendar__entry">
                <p className="calendar__kind">{entry.kind}</p>
                <div className="calendar__body">
                  <h3 className="calendar__title">{entry.title}</h3>
                  {entry.statement ? (
                    <p className="calendar__statement">{entry.statement}</p>
                  ) : null}
                  <p className="calendar__window">
                    {windowLabel(entry.startsOn, entry.endsOn)}
                  </p>
                </div>
                <Link className="button button--secondary calendar__cta" href={entry.href}>
                  {entry.ctaLabel}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {standing.length > 0 ? (
        <section aria-labelledby="calendar-standing">
          <div className="section-head">
            <div>
              <p className="eyebrow">Always on</p>
              <h2 id="calendar-standing">The standing programme</h2>
            </div>
          </div>
          <ol className="calendar calendar--standing">
            {standing.map((entry) => (
              <li key={entry.id} className="calendar__entry">
                <p className="calendar__kind">{entry.kind}</p>
                <div className="calendar__body">
                  <h3 className="calendar__title">{entry.title}</h3>
                  {entry.statement ? (
                    <p className="calendar__statement">{entry.statement}</p>
                  ) : null}
                </div>
                <Link className="button button--secondary calendar__cta" href={entry.href}>
                  {entry.ctaLabel}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <aside className="panel">
        <h2 className="eyebrow">For buyers</h2>
        <p className="meta">
          Preorder close dates and delivery windows per drop belong to your account view the day
          the business publishes them — they are never estimated here. Approved already?{' '}
          <Link href="/trade" className="text-link">
            Your account
          </Link>
          {' · '}
          <Link href="/wholesale/apply" className="text-link">
            Apply for access
          </Link>
        </p>
      </aside>
    </div>
  )
}
