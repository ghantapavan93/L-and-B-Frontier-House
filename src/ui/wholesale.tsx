import Link from 'next/link'
import { addToOrderAction } from '@/features/order/actions'
import { formatMoney, VERIFIED_ORDER_MINIMUM } from '@/domain/money'
import type { Order } from '@/domain/order'
import {
  minimumMet,
  minimumProgressPercent,
  orderSubtotal,
  orderUnits,
  remainingToMinimum,
} from '@/domain/order'
import type { AuthorisedProduct, Prepack } from '@/domain/product'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'

/**
 * WHOLESALE PRICE PANEL — restricted.
 *
 * It accepts `AuthorisedProduct`, so it is unrenderable on a public route: the public type
 * has no wholesale field to pass. Every value is server-rendered semantic text — never
 * canvas, never an image, never fetched client-side into a public shell.
 *
 * MSRP is recovered from V2 Frame 6. V3 Frame 11 dropped it, and buyers need margin maths.
 */
export function WholesalePricePanel({ product }: { product: AuthorisedProduct }) {
  const { wholesale } = product
  const margin =
    wholesale.msrp.amountMinor > 0
      ? Math.round(
          ((wholesale.msrp.amountMinor - wholesale.wholesalePrice.amountMinor) /
            wholesale.msrp.amountMinor) *
            100,
        )
      : 0

  return (
    <section className="price-panel" aria-labelledby="wholesale-heading">
      <h2 className="eyebrow" id="wholesale-heading">
        Your wholesale terms
      </h2>

      <p className="price-panel__price">
        {formatMoney(wholesale.wholesalePrice)} <span>per unit</span>
      </p>
      <p className="price-panel__msrp">
        Suggested retail {formatMoney(wholesale.msrp)} — {margin}% margin
      </p>

      {/* Label left, value right — the way a line sheet reads. */}
      <dl className="definition-list definition-list--split">
        <dt>SKU</dt>
        <dd>{wholesale.sku}</dd>

        <dt>Minimum</dt>
        <dd>{wholesale.moq} units of this style</dd>

        <dt>Pack price</dt>
        <dd>{formatMoney(wholesale.packPrice)}</dd>

        <dt>Terms</dt>
        <dd>{wholesale.terms}</dd>
      </dl>
    </section>
  )
}

/**
 * PREPACK — a structured table with a real size run. Verified prepack structure is 6 units.
 */
export function PrepackTable({ prepack }: { prepack: Prepack }) {
  if (prepack.openSizing) {
    return (
      <section aria-labelledby="prepack-heading">
        <h2 className="eyebrow" id="prepack-heading">
          Pack breakdown
        </h2>
        <p>Open sizing — {prepack.totalUnits} units per pack, sizes selected at checkout.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby="prepack-heading">
      <h2 className="eyebrow" id="prepack-heading">
        Pack breakdown
      </h2>
      <div className="table-scroll inset">
        <table>
          <caption>Units per prepack ({prepack.totalUnits} total)</caption>
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Units</th>
            </tr>
          </thead>
          <tbody>
            {prepack.breakdown.map((row) => (
              <tr key={row.size}>
                <th scope="row">{row.size}</th>
                <td>{row.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td>{prepack.totalUnits}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

/**
 * ADD TO ORDER — a real button in a real form. Works without JavaScript.
 *
 * Waitlisted styles have no allocation, so the control is disabled with the reason stated
 * in text rather than removed silently.
 */
export function AddToOrder({
  product,
  returnTo,
}: {
  product: AuthorisedProduct
  returnTo: string
}) {
  const unavailable =
    product.availability === 'waitlist' || product.availability === 'discontinued'
  const unitsPerPack = product.wholesale.prepack.totalUnits

  return (
    <form action={addToOrderAction} className="stack">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="field">
        <label htmlFor="quantity">Prepacks</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          inputMode="numeric"
          min={1}
          max={999}
          defaultValue={1}
          step={1}
          aria-describedby="quantity-hint"
        />
        {/* Associated, not merely adjacent — the pack size is the single most important
            thing a buyer needs to hear before choosing a quantity. */}
        <span className="field__hint" id="quantity-hint">
          {unitsPerPack} units per pack.{' '}
          {product.availability === 'pre-order'
            ? 'Pre-order — allocation confirmed at production.'
            : null}
        </span>
      </div>

      <button type="submit" className="button button--block" disabled={unavailable}>
        {unavailable ? 'Not currently available' : 'Add to order'}
      </button>

      {unavailable ? (
        <p className="meta">
          This style is on waitlist. Contact your representative for allocation.
        </p>
      ) : null}
    </form>
  )
}

/**
 * MINIMUM ORDER PROGRESS against the verified $50 minimum.
 *
 * `role="status"` announces on threshold change. Browsing is never blocked before the
 * minimum is met — it is a checkout condition, not a gate.
 */
export function MinimumOrderProgress({ order }: { order: Order }) {
  const met = minimumMet(order)
  const percent = minimumProgressPercent(order)
  const remaining = remainingToMinimum(order)

  return (
    <section className="progress" aria-labelledby="minimum-heading">
      <h2 className="eyebrow" id="minimum-heading">
        Order minimum
      </h2>

      <div
        className="progress__track"
        role="progressbar"
        aria-labelledby="minimum-heading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% of the ${formatMoney(VERIFIED_ORDER_MINIMUM)} minimum`}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="meta" role="status">
        {met
          ? `Minimum met — ${formatMoney(orderSubtotal(order))} across ${orderUnits(order)} units.`
          : `${formatMoney(remaining)} to reach the ${formatMoney(VERIFIED_ORDER_MINIMUM)} minimum.`}
      </p>
    </section>
  )
}

/**
 * THE PUBLIC GATE.
 *
 * V3.1 frame 12f_4 is the only frame in the corpus that gets this right: it sells the
 * assortment and gates pricing behind an entry control, showing no price at all. This is
 * that pattern. It reads as an invitation, and it states the verified approval timing.
 */
export function WholesaleGate({ returnTo }: { returnTo: string }) {
  return (
    <section className="gate" aria-labelledby="gate-heading">
      <h2 className="eyebrow" id="gate-heading">
        Wholesale pricing
      </h2>
      <p>
        Wholesale pricing, pack breakdowns and ordering are available to approved retailers.
        Approval {VERIFIED_APPROVAL_TIMING} once we have your sales tax ID.
      </p>
      <div className="cluster">
        <Link href="/wholesale/apply" className="button">
          Apply for an account
        </Link>
        <Link
          href={`/sign-in?next=${encodeURIComponent(returnTo)}`}
          className="button button--secondary"
        >
          Buyer sign in
        </Link>
      </div>
      {/*
        A session-independent shortcut. Following it resolves the session on the authorised
        route: an approved buyer lands on their pricing, anyone else is sent to sign in with
        their intent preserved. This is how a cacheable public page offers a signed-in
        affordance without varying its own output by cookie.
      */}
      <p className="meta" style={{ marginTop: 'var(--space-3)' }}>
        <Link href={returnTo}>Already approved? Go straight to your pricing</Link>
      </p>
    </section>
  )
}
