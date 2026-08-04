import Link from 'next/link'
import { addAssortmentToOrderAction, addToOrderAction } from '@/features/order/actions'
import { formatMoney, VERIFIED_ORDER_MINIMUM } from '@/domain/money'
import {
  EXCLUDED_INPUTS,
  MIXES,
  PRICE_BANDS,
  STORE_SIZES,
  planMeetsMinimum,
} from '@/domain/assortment'
import type { AssortmentInput, AssortmentPlan } from '@/domain/assortment'
import { findCategory } from '@/domain/taxonomy'

/**
 * THE PLAN FORM — a GET form, like the facet panel.
 *
 * GET so a plan is a URL: a buyer can send it to their rep, bookmark it, or come back to it
 * after a week and see the same rack. It also means the whole surface works with JavaScript
 * disabled, which the order surfaces already require.
 *
 * The one thing that must never enter that URL is an L&B price, so the band control submits
 * `entry` / `core` / `elevated` rather than the figures it stands for. The figures are shown
 * in the option labels, where they are inside the authorised response instead of in a
 * history entry, a referrer header or a log line.
 */
export function AssortmentForm({ input }: { input: AssortmentInput }) {
  return (
    <form method="get" action="/trade/assortment" className="assortment-form">
      <div className="assortment-form__grid">
        <div className="field">
          <label htmlFor="budget">Budget</label>
          <div className="field__prefixed">
            <span aria-hidden="true">$</span>
            <input
              id="budget"
              name="budget"
              type="number"
              inputMode="numeric"
              min={50}
              max={100000}
              step={50}
              defaultValue={Math.round(input.budgetMinor / 100)}
              aria-describedby="budget-hint"
            />
          </div>
          <span className="field__hint" id="budget-hint">
            Whole dollars at wholesale. The {formatMoney(VERIFIED_ORDER_MINIMUM)} order minimum
            still applies.
          </span>
        </div>

        <div className="field">
          <label htmlFor="storeSize">Store size</label>
          <select id="storeSize" name="storeSize" defaultValue={input.storeSize}>
            {Object.entries(STORE_SIZES).map(([value, profile]) => (
              <option key={value} value={value}>
                {profile.label} — {profile.styles} styles, {profile.packsPerStyle}{' '}
                {profile.packsPerStyle === 1 ? 'pack' : 'packs'} each
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="mix">Category mix</label>
          <select id="mix" name="mix" defaultValue={input.mix}>
            {Object.entries(MIXES).map(([value, profile]) => (
              <option key={value} value={value}>
                {profile.label} —{' '}
                {[...profile.shares.entries()]
                  .map(
                    ([slug, share]) =>
                      `${findCategory(slug)?.label ?? slug} ${Math.round(share * 100)}%`,
                  )
                  .join(' · ')}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="band">Price band</label>
          <select id="band" name="band" defaultValue={input.band}>
            {Object.entries(PRICE_BANDS).map(([value, profile]) => (
              <option key={value} value={value}>
                {profile.label} —{' '}
                {formatMoney({ amountMinor: profile.minMinor, currency: 'USD' })}–
                {formatMoney({ amountMinor: profile.maxMinor, currency: 'USD' })}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="launchMonth">Launch month</label>
          <input
            id="launchMonth"
            name="launchMonth"
            type="month"
            defaultValue={input.launchMonth ?? ''}
            aria-describedby="launch-hint"
          />
          <span className="field__hint" id="launch-hint">
            Optional. Excludes pre-order styles whose ship window opens later.
          </span>
        </div>
      </div>

      <div className="cluster">
        <button type="submit" className="button">
          Build the rack
        </button>
        <Link href="/trade/assortment" className="button button--secondary">
          Reset
        </Link>
      </div>
    </form>
  )
}

/**
 * WHAT THE PLANNER USED, AND WHAT IT DID NOT.
 *
 * This block is not a disclaimer, it is the feature. A tool that fills a budget against a
 * catalogue looks exactly like a tool that knows what sells, and the difference is invisible
 * unless it is written down. Saying plainly that there is no sales, returns or regional data
 * behind any of this is what keeps the output honest — and it tells a buyer precisely how
 * much of their own judgement the rack still needs.
 */
export function PlannerBasis() {
  return (
    <section className="notice" aria-labelledby="basis-heading">
      <p className="notice__title" id="basis-heading">
        How this rack was built
      </p>
      <p className="meta">
        Your budget, breadth and depth, category split and price band, applied to published
        styles at your wholesale prices, in the manufacturer&rsquo;s prepacks. Styles are taken
        newest first. Nothing here is a prediction.
      </p>
      <p className="meta">
        <strong>Not used, because we do not have it:</strong> {EXCLUDED_INPUTS.join(', ')}.
        Regional performance in particular is not something this platform knows — every line
        below is a starting point for your judgement, not a recommendation.
      </p>
    </section>
  )
}

function CategorySummary({ plan }: { plan: AssortmentPlan }) {
  return (
    <div className="table-scroll">
      <table>
        <caption>Budget by category</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Share</th>
            <th scope="col">Allocated</th>
            <th scope="col">Planned</th>
            <th scope="col">Styles</th>
          </tr>
        </thead>
        <tbody>
          {plan.categories.map((category) => (
            <tr key={category.categorySlug}>
              <th scope="row">
                {findCategory(category.categorySlug)?.label ?? category.categorySlug}
              </th>
              <td>{Math.round(category.share * 100)}%</td>
              <td>{formatMoney(category.budget)}</td>
              <td>{formatMoney(category.spend)}</td>
              {/*
                A short count is the question a buyer asks first, so the cell answers it
                rather than leaving them to infer it: the band emptied the category, the
                band limited it, or the budget ran out. Silence here reads as a bug.
              */}
              <td>
                {category.lines.length}
                {category.eligible === 0 ? (
                  <span className="meta">
                    {' '}
                    — no style in this category matches the band and launch month
                  </span>
                ) : category.eligible > category.lines.length ? (
                  <span className="meta">
                    {' '}
                    of {category.eligible} in this band
                    {category.skippedForBudget > 0
                      ? ` — ${category.skippedForBudget} did not fit the budget`
                      : null}
                  </span>
                ) : (
                  <span className="meta"> — every style in this band</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * THE RACK.
 *
 * Every row carries its own editable pack count and its own Add to order button, so a buyer
 * can take three styles and leave the rest. "Never a locked recommendation" is a structural
 * requirement, not a tone of voice: if the only control were "add everything", the plan
 * would be exactly the locked artefact the brief rules out.
 */
function Rack({ plan }: { plan: AssortmentPlan }) {
  return (
    <div className="table-scroll">
      <table className="assortment-rack">
        <caption>Suggested rack — every line editable before it is added</caption>
        <thead>
          <tr>
            <th scope="col">Style</th>
            <th scope="col">Pack</th>
            <th scope="col">Packs</th>
            <th scope="col">Units</th>
            <th scope="col">Unit price</th>
            <th scope="col">Spend</th>
            <th scope="col">Suggested retail</th>
            <th scope="col">Add</th>
          </tr>
        </thead>
        <tbody>
          {plan.lines.map((line) => {
            const { product } = line
            const inputId = `packs-${product.id}`
            return (
              <tr key={product.id}>
                <th scope="row">
                  <Link href={`/trade/product/${product.slug}`}>{product.displayName}</Link>
                  <br />
                  <span className="meta">{product.wholesale.sku}</span>
                </th>
                <td>
                  {product.wholesale.prepack.openSizing
                    ? `Open sizing, ${product.wholesale.prepack.totalUnits} units`
                    : product.wholesale.prepack.breakdown
                        .map((b) => `${b.quantity} ${b.size}`)
                        .join(' · ')}
                </td>
                <td>
                  <label htmlFor={inputId} className="visually-hidden">
                    Packs of {product.displayName}
                  </label>
                  {/* Associated with the row's form by `form=`, not by nesting — a <form>
                      inside a <tbody> is not valid HTML, and the count must be the one the
                      submit actually sends. */}
                  <input
                    id={inputId}
                    form={`add-${product.id}`}
                    name="quantity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={999}
                    step={1}
                    defaultValue={line.packs}
                    style={{ width: '4.5rem' }}
                  />
                </td>
                <td>{line.units}</td>
                <td>{formatMoney(product.wholesale.wholesalePrice)}</td>
                <td>{formatMoney(line.spend)}</td>
                <td>{formatMoney(line.retailValue)}</td>
                <td>
                  <button
                    type="submit"
                    form={`add-${product.id}`}
                    className="button button--secondary button--small"
                  >
                    Add
                    <span className="visually-hidden">
                      {' '}
                      {product.displayName} to your order
                    </span>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={3}>
              Total
            </th>
            <td>{plan.totalUnits}</td>
            <td />
            <td>{formatMoney(plan.totalSpend)}</td>
            <td>{formatMoney(plan.totalRetailValue)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function Distribution({
  heading,
  id,
  rows,
  total,
}: {
  heading: string
  id: string
  rows: readonly { readonly label: string; readonly units: number }[]
  total: number
}) {
  return (
    <section aria-labelledby={id}>
      <h3 className="eyebrow" id={id}>
        {heading}
      </h3>
      <dl className="distribution">
        {rows.map((row) => {
          const percent = total > 0 ? Math.round((row.units / total) * 100) : 0
          return (
            <div className="distribution__row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>
                {row.units} {row.units === 1 ? 'unit' : 'units'}
                <span className="meta"> · {percent}%</span>
                <span
                  className="distribution__bar"
                  aria-hidden="true"
                  style={{ inlineSize: `${percent}%` }}
                />
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

export function AssortmentPlanView({ plan }: { plan: AssortmentPlan }) {
  if (plan.lines.length === 0) {
    return (
      <div className="state-block">
        <h2>Nothing fits this plan yet</h2>
        <p>
          No published style matches this budget, price band and launch month together. Widen
          the price band, raise the budget, or clear the launch month.
        </p>
        <Link href="/trade/assortment" className="button button--secondary">
          Start again
        </Link>
      </div>
    )
  }

  const meetsMinimum = planMeetsMinimum(plan)

  return (
    <div className="stack">
      <section className="price-panel" aria-labelledby="plan-summary-heading">
        <h2 className="eyebrow" id="plan-summary-heading">
          This plan
        </h2>
        <dl className="definition-list definition-list--split">
          <dt>Styles</dt>
          <dd>{plan.lines.length}</dd>

          <dt>Units</dt>
          <dd>{plan.totalUnits}</dd>

          <dt>Spend</dt>
          <dd>{formatMoney(plan.totalSpend)}</dd>

          <dt>Budget remaining</dt>
          <dd>{formatMoney(plan.remainingBudget)}</dd>

          <dt>Suggested retail value</dt>
          <dd>{formatMoney(plan.totalRetailValue)}</dd>

          <dt>Blended margin</dt>
          <dd>{plan.blendedMargin}%</dd>
        </dl>

        {!meetsMinimum ? (
          <p className="meta" role="status">
            This rack is below the {formatMoney(VERIFIED_ORDER_MINIMUM)} order minimum. Add
            depth or another style before sending it.
          </p>
        ) : null}
      </section>

      <CategorySummary plan={plan} />

      <section aria-labelledby="rack-heading" className="stack">
        <h2 id="rack-heading">Suggested rack</h2>
        <Rack plan={plan} />

        {/*
          One form per row, declared outside the table because a <form> inside a <tbody> is
          not valid HTML. The row's pack input and Add button join it by `form=`, so the
          quantity that submits is the one the buyer edited. No quantity is hardcoded here.
        */}
        {plan.lines.map((line) => (
          <form
            action={addToOrderAction}
            id={`add-${line.product.id}`}
            key={line.product.id}
            hidden
          >
            <input type="hidden" name="productId" value={line.product.id} />
            <input type="hidden" name="returnTo" value="/trade/order" />
          </form>
        ))}

        <form action={addAssortmentToOrderAction} className="cluster">
          <input type="hidden" name="budget" value={Math.round(plan.input.budgetMinor / 100)} />
          <input type="hidden" name="storeSize" value={plan.input.storeSize} />
          <input type="hidden" name="mix" value={plan.input.mix} />
          <input type="hidden" name="band" value={plan.input.band} />
          <input type="hidden" name="launchMonth" value={plan.input.launchMonth ?? ''} />
          <button type="submit" className="button">
            Add all {plan.lines.length} styles to your order
          </button>
          <Link href="/trade/order" className="button button--secondary">
            Go to your order
          </Link>
        </form>
        <p className="meta">
          Adding puts every line in your order, where pack counts stay editable and any style
          can be removed.
        </p>
      </section>

      <section aria-labelledby="distribution-heading" className="stack">
        <h2 id="distribution-heading">What arrives</h2>
        <div className="distribution-grid">
          <Distribution
            heading="By size"
            id="size-distribution-heading"
            rows={plan.sizeDistribution.map((row) => ({ label: row.size, units: row.units }))}
            total={plan.totalUnits}
          />
          <Distribution
            heading="By colour"
            id="colour-distribution-heading"
            rows={plan.colourDistribution.map((row) => ({
              label: row.colour,
              units: row.units,
            }))}
            total={plan.colourDistribution.reduce((sum, row) => sum + row.units, 0)}
          />
        </div>
        <p className="meta">
          Sizes are summed from the manufacturer&rsquo;s prepack breakdowns — they are fixed at{' '}
          {plan.lines[0]?.product.wholesale.prepack.totalUnits ?? 6} units per pack and cannot
          be reweighted.
        </p>
      </section>
    </div>
  )
}
