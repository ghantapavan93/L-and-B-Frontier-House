import type { Money } from '@/domain/money'
import { formatMoney } from '@/domain/money'
import {
  afterpayInstalments,
  AFTERPAY_INSTALMENTS,
  BUY_NOW_PAY_LATER,
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
  type PaymentMethodId,
} from '@/domain/payment'

/**
 * The marks, as the brand's own strip shows them, cut from that strip
 * (assets/source/owner-approved/payment/, S-20). Knocked out to transparency so they sit
 * on the house's own dark surface; on a light one Afterpay's wordmark is a hole and
 * Sezzle's is white on white, which is why the marks appear ONLY on the footer and every
 * other surface names the methods in text.
 */
const MARKS: Record<
  Exclude<PaymentMethodId, 'net-30'>,
  { src: string; w: number; h: number }
> = {
  afterpay: { src: '/media/payment/afterpay.png', w: 263, h: 80 },
  sezzle: { src: '/media/payment/sezzle.png', w: 319, h: 80 },
  'paypal-credit': { src: '/media/payment/paypal-credit.png', w: 274, h: 80 },
}

/**
 * BUY NOW, PAY LATER — the footer strip, done the way the live site's is not.
 *
 * The live site conveys these three methods as one 2600×320 JPEG with an empty alt:
 * three payment options a screen reader cannot read, the same failure as its size chart.
 * Here the phrase is text, the list is a list, and every mark carries the provider's name
 * as its alternative text. Remove the images and the sentence still reads.
 */
export function BuyNowPayLater() {
  return (
    <section className="bnpl" aria-labelledby="bnpl-heading">
      <p className="bnpl__label" id="bnpl-heading">
        <strong>Buy now,</strong> pay later
      </p>
      <ul className="bnpl__marks">
        {BUY_NOW_PAY_LATER.map((method) => {
          const mark = MARKS[method.id as keyof typeof MARKS]
          return (
            <li key={method.id}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a static mark, not a photograph */}
              <img
                src={mark.src}
                alt={method.label}
                width={mark.w}
                height={mark.h}
                loading="lazy"
                decoding="async"
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function joinNames(): string {
  const names = BUY_NOW_PAY_LATER.map((m) => m.label)
  return `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`
}

/** Terms and methods in one sentence. For the wholesale page, which has no Terms row. */
export function acceptedMethodsSentence(): string {
  return `Net 30 for approved accounts, or pay at checkout with ${joinNames()}.`
}

/** The checkout methods alone. For a panel that already states the terms on its own row. */
export function checkoutMethodsPhrase(): string {
  return `${joinNames()} at checkout`
}

/**
 * The Afterpay line on an AUTHORISED price panel: "A pack is 4 payments of $46.50 with
 * Afterpay." One sentence that stands on its own after the methods.
 * Derived from a restricted amount, so the caller must already be inside the session
 * boundary — this component never appears on a public route, and the unauthenticated
 * crawl asserts the phrase is absent there.
 */
export function AfterpayLine({ total }: { total: Money }) {
  const { first, rest } = afterpayInstalments(total)
  const equal = first.amountMinor === rest.amountMinor
  return (
    <span className="afterpay-line">
      {equal
        ? `A pack is ${AFTERPAY_INSTALMENTS} payments of ${formatMoney(rest)} with Afterpay.`
        : `A pack is ${formatMoney(first)} then ${AFTERPAY_INSTALMENTS - 1} payments of ${formatMoney(rest)} with Afterpay.`}
    </span>
  )
}

/**
 * THE CHOICE — a radio group on the order form, recorded on submission.
 *
 * Real inputs in a real fieldset: works without JavaScript, arrow keys move between
 * options, the legend names the group. Net 30 is checked by default because it is the
 * verified terms every approved account already has; the three checkout methods are the
 * alternatives the brand's own site offers. Nothing here charges anyone — see
 * domain/payment.ts for exactly what the recorded value does and does not claim.
 */
export function PaymentMethodChoice({ error }: { error?: boolean }) {
  return (
    <fieldset className="payment-choice" aria-describedby={error ? 'payment-error' : undefined}>
      <legend>How would you like to pay?</legend>
      {error ? (
        <p className="field__error" id="payment-error" role="alert">
          That is not a payment method we accept. Choose one below to send the order.
        </p>
      ) : null}
      <ul className="payment-choice__list">
        {PAYMENT_METHODS.map((method) => (
          <li key={method.id}>
            <label className="payment-choice__option">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                defaultChecked={method.id === DEFAULT_PAYMENT_METHOD}
                required
              />
              <span className="payment-choice__label">{method.label}</span>
              <span className="meta">{method.note}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
