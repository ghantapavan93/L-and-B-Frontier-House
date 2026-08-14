import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublicProducts } from '@/data/catalog-repository'
import { primaryMedia } from '@/domain/product'
import { DENIM_LEG_OPENINGS } from '@/features/discovery/denim-finder'
import { clearFitProfileAction, saveFitProfileAction } from '@/features/fit/actions'
import { readFitProfile, suggestSize } from '@/features/fit/profile'
import { ErrorNotice } from '@/ui/notices'
import { ProductMedia } from '@/ui/product-media'

export const metadata: Metadata = {
  title: 'Fit Passport',
  description:
    'Tell the House your fit once. Every style answers with its closest published size.',
  robots: { index: false },
}

/**
 * FIT PASSPORT — the House remembers your fit; the charts do the answering.
 *
 * Why this page is the ONLY place the profile renders: public product pages are
 * byte-identical for every visitor by contract (shared-cache safety), so a personal fit
 * hint can never be injected into them. The passport is its own dynamic room instead —
 * profile in an httpOnly cookie, suggestions computed server-side against the published
 * measurement charts, and every suggestion shows the chart figure it came from. No fit
 * model, no confidence claim, no purchase history.
 */
export default async function FitPassportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const error = typeof params['error'] === 'string' ? params['error'] : undefined
  const profile = await readFitProfile()
  const hasProfile = profile.waistIn !== undefined || profile.silhouette !== undefined

  const products = hasProfile ? await listPublicProducts({ sort: 'newest' }) : []
  const preferred =
    profile.silhouette !== undefined
      ? products.filter((p) => p.attributes.legOpening === profile.silhouette)
      : []
  const preferredIds = new Set(preferred.map((p) => p.id))
  const rest = products.filter((p) => !preferredIds.has(p.id))

  const withSuggestion = (list: readonly (typeof products)[number][]) =>
    profile.waistIn !== undefined
      ? list
          .map((product) => ({ product, suggestion: suggestSize(product, profile.waistIn!) }))
          .filter((entry) => entry.suggestion !== null)
      : list.map((product) => ({ product, suggestion: null }))

  const preferredRows = withSuggestion(preferred)
  const restRows = withSuggestion(rest).slice(0, 12)

  return (
    <div className="container section stack">
      <p className="eyebrow">Fit Passport</p>
      <h1>Tell the House once.</h1>
      <p className="lede">
        Your waist and your cut, remembered on this device. Every style then answers with its
        closest size — read straight off its published measurement chart, and shown with the
        figure it came from. No guesswork is dressed up as intelligence.
      </p>

      {error === 'empty' ? (
        <ErrorNotice>
          <p>Give the passport at least one thing to remember — a waist or a cut.</p>
        </ErrorNotice>
      ) : null}

      <form action={saveFitProfileAction} className="stack apply-form">
        <fieldset>
          <legend>Your fit</legend>
          <div className="field">
            <label htmlFor="waistIn">
              Waist, in inches <span className="field__optional">optional</span>
            </label>
            <input
              id="waistIn"
              name="waistIn"
              type="number"
              inputMode="decimal"
              min={20}
              max={60}
              step="0.5"
              defaultValue={profile.waistIn ?? ''}
              aria-describedby="waist-hint"
            />
            <span className="field__hint" id="waist-hint">
              Measured over the garment you actually wear. Stored on this device only — never on
              a public page, never in a URL.
            </span>
          </div>
          <fieldset className="field">
            <legend>
              How you wear your denim <span className="field__optional">optional</span>
            </legend>
            <div className="choice-row">
              {DENIM_LEG_OPENINGS.map((option) => (
                <label key={option.value} className="choice">
                  <input
                    type="radio"
                    name="legOpening"
                    value={option.value}
                    defaultChecked={profile.silhouette === option.value}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
        <div className="cluster">
          <button type="submit" className="button">
            {hasProfile ? 'Update the passport' : 'Open the passport'}
          </button>
          {hasProfile ? (
            <button
              type="submit"
              formAction={clearFitProfileAction}
              className="button button--quiet"
            >
              Forget my fit
            </button>
          ) : null}
        </div>
      </form>

      {hasProfile && preferredRows.length > 0 ? (
        <section aria-labelledby="fit-preferred-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">Cut to your line</p>
              <h2 id="fit-preferred-heading">
                {DENIM_LEG_OPENINGS.find((s) => s.value === profile.silhouette)?.label}
                {profile.waistIn !== undefined ? ', in your size' : ''}
              </h2>
            </div>
          </div>
          <FitList rows={preferredRows} />
        </section>
      ) : null}

      {hasProfile && restRows.length > 0 ? (
        <section aria-labelledby="fit-rest-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">The rest of the line</p>
              <h2 id="fit-rest-heading">Sized by the same charts</h2>
            </div>
          </div>
          <FitList rows={restRows} />
        </section>
      ) : null}

      {hasProfile && preferredRows.length === 0 && restRows.length === 0 ? (
        <div className="state-block">
          <h2>No chart can answer yet</h2>
          <p>
            Nothing published carries a measurement that matches. Try the finder instead — it
            filters by cut and wash without needing a number.
          </p>
          <Link href="/find-your-denim" className="button button--secondary">
            Find your denim
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function FitList({
  rows,
}: {
  rows: readonly {
    product: Awaited<ReturnType<typeof listPublicProducts>>[number]
    suggestion: ReturnType<typeof suggestSize>
  }[]
}) {
  return (
    <ul className="fit-results">
      {rows.map(({ product, suggestion }) => (
        <li key={product.id}>
          <a href={`/product/${product.slug}`} aria-label={product.displayName}>
            <ProductMedia media={primaryMedia(product)} sizes="5rem" />
          </a>
          <div className="stack" style={{ gap: 'var(--space-1)' }}>
            <a href={`/product/${product.slug}`} className="text-link">
              {product.displayName}
            </a>
            {suggestion ? (
              <span className="fit-suggestion">
                Closest size: {suggestion.size}
                <span className="visually-hidden">, </span>
                <span aria-hidden="true">·</span> chart waist {suggestion.chartWaistIn}
                &Prime;
              </span>
            ) : (
              <span className="meta">
                Published sizes:{' '}
                {product.sizeRanges
                  .filter((r) => r.availability !== 'unavailable')
                  .flatMap((r) => r.sizes)
                  .join(', ')}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
