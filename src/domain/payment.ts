import type { Money } from './money'
import { usd } from './money'

/**
 * PAYMENT METHODS — what the house accepts, and only what is evidenced.
 *
 * Two sources, both Level 1:
 *
 *   - Net 30 for approved accounts is the buyer's terms on every authorised product
 *     record (docs/brand-research/00_BRAND_TRUTH.md, verified wholesale terms).
 *   - Afterpay, Sezzle and PayPal Credit are the three marks on the live site's own
 *     "Buy now, pay later" strip — landbapparel.com/images/promo/221/
 *     BuyNowPayLater_2600x320px.jpg, recorded 2026-09-12 as S-20 — and the live site
 *     runs an Afterpay module that computes "4 payments of" on a pack total
 *     (00_BRAND_TRUTH §1a). The instalment count is the one provider term we state,
 *     because the brand's own site states it; Sezzle and PayPal Credit are named as
 *     accepted and nothing more is claimed about their terms.
 *
 * What this registry does NOT do is take a payment. There is no merchant integration
 * here: a buyer's choice is RECORDED on the order (`Order.paymentMethod`), stated on the
 * confirmation, and handed to whatever collects it — today the fixture, tomorrow the
 * provider once the owner supplies credentials (docs/production/24 readiness register).
 * A stubbed redirect to a provider would be a fabricated capability; a recorded choice is
 * a fact about the order.
 */
export type PaymentMethodId = 'net-30' | 'afterpay' | 'sezzle' | 'paypal-credit'

export type PaymentMethod = {
  readonly id: PaymentMethodId
  readonly label: string
  /** `terms` is settled on account; `bnpl` is collected at checkout by the provider. */
  readonly kind: 'terms' | 'bnpl'
  /** One line the buyer reads beside the choice. Verified or provider-generic only. */
  readonly note: string
  /** Research source id. */
  readonly source: 'verified-terms' | 'S-20'
}

export const PAYMENT_METHODS: readonly PaymentMethod[] = [
  {
    id: 'net-30',
    label: 'Net 30 terms',
    kind: 'terms',
    note: 'For approved accounts. Prepacks ship complete.',
    source: 'verified-terms',
  },
  {
    id: 'afterpay',
    label: 'Afterpay',
    kind: 'bnpl',
    note: 'Pay in 4 instalments at checkout.',
    source: 'S-20',
  },
  {
    id: 'sezzle',
    label: 'Sezzle',
    kind: 'bnpl',
    note: 'Pay over time at checkout.',
    source: 'S-20',
  },
  {
    id: 'paypal-credit',
    label: 'PayPal Credit',
    kind: 'bnpl',
    note: 'Pay over time at checkout.',
    source: 'S-20',
  },
]

/** The buy-now-pay-later trio, in the order the brand's own strip shows them. */
export const BUY_NOW_PAY_LATER: readonly PaymentMethod[] = PAYMENT_METHODS.filter(
  (m) => m.kind === 'bnpl',
)

export const DEFAULT_PAYMENT_METHOD: PaymentMethodId = 'net-30'

export function findPaymentMethod(id: string | null | undefined): PaymentMethod | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id)
}

/** Type guard for form input. Unknown values are rejected, never defaulted. */
export function isPaymentMethodId(value: unknown): value is PaymentMethodId {
  return typeof value === 'string' && PAYMENT_METHODS.some((m) => m.id === value)
}

/**
 * Afterpay's instalment on an amount: four equal payments, rounded up to the cent — the
 * arithmetic the live site's module shows ("Or 4 payments of $60.00" on $240). Integer
 * minor units in, integer minor units out; nothing is rounded into existence.
 *
 * Rendered ONLY inside an authorised session, because it is derived from a restricted
 * price — the exact thing the live site leaks by computing on an un-gated pack total
 * (D-00). The unauthenticated crawl asserts the phrase never reaches a public surface.
 */
export const AFTERPAY_INSTALMENTS = 4

/**
 * Four payments that SUM to the total. Equal when the cents divide by four; otherwise the
 * remainder rides on the first, which is how Afterpay itself splits — never a ceiling that
 * overstates the pack by up to three cents (caught in review).
 */
export function afterpayInstalments(total: Money): { first: Money; rest: Money } {
  const rest = Math.floor(total.amountMinor / AFTERPAY_INSTALMENTS)
  const first = total.amountMinor - rest * (AFTERPAY_INSTALMENTS - 1)
  return { first: usd(first), rest: usd(rest) }
}
