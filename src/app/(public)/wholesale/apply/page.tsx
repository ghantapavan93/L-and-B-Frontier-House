import type { Metadata } from 'next'
import Link from 'next/link'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'
import { navigableCategories } from '@/domain/taxonomy'
import { applyStepAction, submitApplicationAction } from '@/features/apply/actions'
import { readApplyDraft } from '@/features/apply/draft'
import { ErrorNotice, FixtureNotice } from '@/ui/notices'

export const metadata: Metadata = {
  title: 'Apply for a wholesale account',
  description: 'Apply to buy Lucky & Blessed wholesale. A sales tax ID is required.',
  robots: { index: false },
}

/**
 * TRADE ACCESS — the application as four small steps instead of one long page.
 *
 * The live business asks roughly twenty-five fields on a single screen (measured
 * 2026-08-07). The field TRUTH is kept — store, credentials, buying profile — and the
 * SHAPE is fixed: one subject per step, visible progress, review before submit. State
 * lives in an httpOnly draft cookie written by each step's server action, so the flow
 * works identically with JavaScript disabled and no personal value ever enters a URL.
 *
 * Step 3 is deliberately optional throughout: it helps the business serve the buyer, and
 * the live site's own segmentation (Western · Boho · Contemporary · Conservative) is the
 * source of its options — but approval never hinges on it.
 *
 * The sales tax ID is transmitted to the server and stored on the buyer record; its value
 * is never rendered back in full, never logged, and never leaves the server.
 */

const STEPS = [
  { n: 1, label: 'Your store' },
  { n: 2, label: 'Credentials' },
  { n: 3, label: 'Buying profile' },
  { n: 4, label: 'Review' },
] as const

const STYLE_PROFILES = ['Western', 'Boho', 'Contemporary', 'Conservative', 'Other'] as const

const REFERRAL_SOURCES = [
  'Dallas Market',
  'Atlanta Market',
  'FashionGo',
  'LA Showroom',
  'Search',
  'Social',
  'A rep or another store',
  'Other',
] as const

function Progress({ current }: { current: number }) {
  return (
    <ol className="apply-progress" aria-label="Application steps">
      {STEPS.map((step) => (
        <li
          key={step.n}
          {...(step.n === current ? { 'aria-current': 'step' as const } : {})}
          className={step.n < current ? 'apply-progress__done' : undefined}
        >
          <span className="apply-progress__n">{String(step.n).padStart(2, '0')}</span>
          {step.label}
        </li>
      ))}
    </ol>
  )
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const error = typeof params['error'] === 'string' ? params['error'] : undefined
  const rawStep = typeof params['step'] === 'string' ? Number.parseInt(params['step'], 10) : 1
  const step = Number.isInteger(rawStep) && rawStep >= 1 && rawStep <= 4 ? rawStep : 1
  const draft = await readApplyDraft()
  const categories = navigableCategories()

  return (
    <div className="container section apply">
      <p className="eyebrow">Trade access</p>
      <h1>For the stores that sell the West</h1>
      <p className="lede">
        Hey y&rsquo;all. Four short steps, and we approve accounts {VERIFIED_APPROVAL_TIMING}.
      </p>

      <Progress current={step} />

      {error === 'missing' ? (
        <ErrorNotice>
          <p>A required field on this step is empty. Complete it and continue.</p>
        </ErrorNotice>
      ) : null}
      {error === 'terms' ? (
        <ErrorNotice>
          <p>Please confirm the wholesale terms before submitting.</p>
        </ErrorNotice>
      ) : null}

      {step === 1 ? (
        <>
          {/* What the applicant is applying FOR — before any field asks for anything. */}
          <section className="panel apply-unlocks" aria-labelledby="unlocks-heading">
            <h2 className="eyebrow" id="unlocks-heading">
              An account unlocks
            </h2>
            <ul className="apply-unlocks__list">
              <li>Your wholesale pricing and pack breakdowns on every style</li>
              <li>Ordering online — $50 minimum, prepacks of 6 unless stated</li>
              <li>Reorder any past order in one action</li>
              <li>The assortment builder: a rack planned to your budget</li>
            </ul>
          </section>

          <form action={applyStepAction} className="stack apply-form">
            <input type="hidden" name="step" value="1" />
            <fieldset>
              <legend>Your store</legend>
              <div className="field">
                <label htmlFor="retailerName">Store name</label>
                <input
                  id="retailerName"
                  name="retailerName"
                  type="text"
                  required
                  autoComplete="organization"
                  defaultValue={draft.retailerName ?? ''}
                />
              </div>
              <div className="field">
                <label htmlFor="buyerName">Your name</label>
                <input
                  id="buyerName"
                  name="buyerName"
                  type="text"
                  required
                  autoComplete="name"
                  defaultValue={draft.buyerName ?? ''}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={draft.email ?? ''}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">
                  Phone <span className="field__optional">optional</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={draft.phone ?? ''}
                />
              </div>
            </fieldset>
            <div className="cluster">
              <button type="submit" className="button">
                Continue — credentials
              </button>
            </div>
          </form>
        </>
      ) : null}

      {step === 2 ? (
        <form action={applyStepAction} className="stack apply-form">
          <input type="hidden" name="step" value="2" />
          <fieldset>
            <legend>Retail credentials</legend>
            <div className="field">
              <label htmlFor="salesTaxId">Sales tax ID</label>
              <input
                id="salesTaxId"
                name="salesTaxId"
                type="text"
                required
                aria-describedby="tax-hint"
                defaultValue={draft.salesTaxId ?? ''}
              />
              <span className="field__hint" id="tax-hint">
                Your state resale certificate number. We use it to verify you are a retailer. It
                is stored on your account and is never shown publicly.
              </span>
            </div>
            <div className="field">
              <label htmlFor="region">State</label>
              <input
                id="region"
                name="region"
                type="text"
                required
                autoComplete="address-level1"
                defaultValue={draft.region ?? ''}
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                autoComplete="address-level2"
                defaultValue={draft.city ?? ''}
              />
            </div>
            <fieldset className="field">
              <legend>
                Where you sell <span className="field__optional">optional</span>
              </legend>
              <div className="choice-row">
                {(
                  [
                    ['physical', 'A physical store'],
                    ['online', 'Online'],
                    ['both', 'Both'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="choice">
                    <input
                      type="radio"
                      name="storefront"
                      value={value}
                      defaultChecked={draft.storefront === value}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="storeUrl">
                Store site or social <span className="field__optional">optional</span>
              </label>
              <input
                id="storeUrl"
                name="storeUrl"
                type="text"
                inputMode="url"
                placeholder="yourstore.com or @yourstore"
                defaultValue={draft.storeUrl ?? ''}
              />
            </div>
          </fieldset>
          <div className="cluster">
            <button type="submit" className="button">
              Continue — buying profile
            </button>
            <Link href="/wholesale/apply?step=1" className="text-link">
              Back
            </Link>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <form action={applyStepAction} className="stack apply-form">
          <input type="hidden" name="step" value="3" />
          <fieldset>
            <legend>
              Buying profile <span className="field__optional">all optional</span>
            </legend>
            <p className="meta">Helps us pull the right rack for your store. Skip anything.</p>
            <fieldset className="field">
              <legend>Your store reads as</legend>
              <div className="choice-row">
                {STYLE_PROFILES.map((style) => (
                  <label key={style} className="choice">
                    <input
                      type="checkbox"
                      name="styleProfile"
                      value={style}
                      defaultChecked={draft.styleProfile?.includes(style) ?? false}
                    />
                    {style}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="field">
              <legend>Buying for</legend>
              <div className="choice-row">
                {categories.map((category) => (
                  <label key={category.slug} className="choice">
                    <input
                      type="checkbox"
                      name="categoriesOfInterest"
                      value={category.label}
                      defaultChecked={
                        draft.categoriesOfInterest?.includes(category.label) ?? false
                      }
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="referralSource">How you found us</label>
              <select
                id="referralSource"
                name="referralSource"
                defaultValue={draft.referralSource ?? ''}
              >
                <option value="">—</option>
                {REFERRAL_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="showsAttended">Shows or markets you attend</label>
              <input
                id="showsAttended"
                name="showsAttended"
                type="text"
                placeholder="Dallas, Atlanta…"
                defaultValue={draft.showsAttended ?? ''}
              />
            </div>
            <div className="field">
              <label htmlFor="notes">Anything else</label>
              <textarea id="notes" name="notes" rows={3} defaultValue={draft.notes ?? ''} />
            </div>
          </fieldset>
          <div className="cluster">
            <button type="submit" className="button">
              Continue — review
            </button>
            <Link href="/wholesale/apply?step=2" className="text-link">
              Back
            </Link>
          </div>
        </form>
      ) : null}

      {step === 4 ? (
        <div className="stack apply-form">
          <section className="panel" aria-labelledby="review-heading">
            <h2 className="eyebrow" id="review-heading">
              Review
            </h2>
            <dl className="definition-list">
              <dt>Store</dt>
              <dd>
                {draft.retailerName ?? <em>Not provided</em>}
                {draft.city && draft.region ? ` — ${draft.city}, ${draft.region}` : ''}{' '}
                <Link href="/wholesale/apply?step=1" className="text-link">
                  Edit
                </Link>
              </dd>
              <dt>Buyer</dt>
              <dd>
                {draft.buyerName ?? <em>Not provided</em>}
                {draft.email ? ` · ${draft.email}` : ''}
                {draft.phone ? ` · ${draft.phone}` : ''}
              </dd>
              <dt>Sales tax ID</dt>
              <dd>
                {draft.salesTaxId ? (
                  `•••• ${draft.salesTaxId.slice(-4)}`
                ) : (
                  <em>Not provided</em>
                )}{' '}
                <Link href="/wholesale/apply?step=2" className="text-link">
                  Edit
                </Link>
              </dd>
              {draft.storefront || draft.storeUrl ? (
                <>
                  <dt>Where you sell</dt>
                  <dd>
                    {[
                      draft.storefront === 'physical'
                        ? 'A physical store'
                        : draft.storefront === 'online'
                          ? 'Online'
                          : draft.storefront === 'both'
                            ? 'Physical and online'
                            : undefined,
                      draft.storeUrl,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </dd>
                </>
              ) : null}
              {draft.styleProfile?.length || draft.categoriesOfInterest?.length ? (
                <>
                  <dt>Buying profile</dt>
                  <dd>
                    {[draft.styleProfile?.join(', '), draft.categoriesOfInterest?.join(', ')]
                      .filter(Boolean)
                      .join(' · ')}{' '}
                    <Link href="/wholesale/apply?step=3" className="text-link">
                      Edit
                    </Link>
                  </dd>
                </>
              ) : null}
            </dl>
          </section>

          <form action={submitApplicationAction} className="stack">
            <label className="choice">
              <input type="checkbox" name="terms" required />
              <span>
                I&rsquo;m buying for resale, and I understand the terms: $50 minimum order,
                prepacks of 6 unless stated. <Link href="/wholesale">The full picture</Link>.
              </span>
            </label>
            <div className="cluster">
              <button type="submit" className="button">
                Submit application
              </button>
              <Link href="/wholesale/apply?step=3" className="text-link">
                Back
              </Link>
            </div>
          </form>
        </div>
      ) : null}

      <div style={{ marginTop: 'var(--space-6)' }}>
        <FixtureNotice />
      </div>
    </div>
  )
}
