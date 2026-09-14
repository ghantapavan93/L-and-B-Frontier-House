import 'server-only'

/**
 * FIXTURE STATE, HELD IN THE BUYER'S OWN BROWSER.
 *
 * The fixture adapter used to keep drafts, submitted orders and new applications in
 * process memory. On a laptop that is one process and it works. On serverless hosting it
 * is one process PER INSTANCE, and instances are many, unshared and recycled: a buyer adds
 * a garment, opens the order page on a different instance, and the order is empty; they
 * refresh a confirmation and it is gone. Often it appears to work on a warm instance, then
 * loses state without warning — worse than failing consistently.
 *
 * So the state lives where the buyer is: one httpOnly, sameSite cookie, sealed with the
 * session's HMAC. Three properties keep it inside the rules:
 *
 *   1. NOTHING RESTRICTED IS STORED. A draft line is a product id and a pack count; the
 *      price, SKU, name and prepack are re-derived from the catalogue on every read. The
 *      cookie could be printed in a log and reveal no wholesale figure.
 *   2. NOTHING PERSONAL BEYOND WHAT THE BUYER TYPED. A pending application keeps the fields
 *      needed to sign the applicant in and show their status; the sales tax ID is NOT
 *      among them — `Buyer` says that value never leaves the server, and a cookie leaves
 *      the server. The fixture receives it and discards it; a real backend holds it.
 *   3. THE SEAL DECIDES ORIGIN, THE CODEC DECIDES SHAPE. A cookie that was not written by
 *      this server fails the signature and reads as empty. One that was, but has drifted
 *      (an older version, a hand edit), fails the shape check and reads as empty. Neither
 *      path ever renders a forged line or throws on a bad byte.
 *
 * Bounded on purpose: forty draft lines, five recent orders. A cookie is ~4 KB, and a
 * fixture is not a ledger.
 */

import { cookies } from 'next/headers'
import { openJson, sealJson } from '@/auth/seal'
import type { PaymentMethodId } from '@/domain/payment'
import { isPaymentMethodId } from '@/domain/payment'

const COOKIE_NAME = 'lb_fixture_state'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30
const VERSION = 1

export const MAX_DRAFT_LINES = 40
export const MAX_RECENT_ORDERS = 5

/** A line as stored: what the buyer chose, never what it costs. */
export type StoredLine = { readonly p: string; readonly q: number }

export type StoredOrder = {
  readonly id: string
  readonly buyerId: string
  readonly createdAt: string
  readonly submittedAt: string
  readonly paymentMethod: PaymentMethodId
  readonly lines: readonly StoredLine[]
}

/** A pending application, minus the one field that may not travel. */
export type StoredApplication = {
  readonly id: string
  readonly email: string
  readonly retailerName: string
  readonly city: string
  readonly region: string
  readonly storeUrl?: string
  readonly appliedAt: string
}

export type FixtureState = {
  readonly v: typeof VERSION
  /** Draft lines keyed by buyer id — a browser may sign in as more than one fixture. */
  readonly drafts: Readonly<Record<string, readonly StoredLine[]>>
  readonly orders: readonly StoredOrder[]
  readonly applied?: StoredApplication
  /** Running count for order ids, so LB-FIXTURE-0003 stays 0003 after 0001 drops off. */
  readonly seq: number
}

export const EMPTY_STATE: FixtureState = { v: VERSION, drafts: {}, orders: [], seq: 0 }

const isStr = (x: unknown): x is string => typeof x === 'string'
const isPosInt = (x: unknown): x is number => Number.isInteger(x) && (x as number) > 0

function isLine(x: unknown): x is StoredLine {
  return (
    typeof x === 'object' &&
    x !== null &&
    isStr((x as StoredLine).p) &&
    isPosInt((x as StoredLine).q)
  )
}

function isOrder(x: unknown): x is StoredOrder {
  if (typeof x !== 'object' || x === null) return false
  const o = x as StoredOrder
  return (
    isStr(o.id) &&
    isStr(o.buyerId) &&
    isStr(o.createdAt) &&
    isStr(o.submittedAt) &&
    isPaymentMethodId(o.paymentMethod) &&
    Array.isArray(o.lines) &&
    o.lines.every(isLine)
  )
}

function isApplication(x: unknown): x is StoredApplication {
  if (typeof x !== 'object' || x === null) return false
  const a = x as StoredApplication
  return (
    isStr(a.id) &&
    isStr(a.email) &&
    isStr(a.retailerName) &&
    isStr(a.city) &&
    isStr(a.region) &&
    isStr(a.appliedAt) &&
    (a.storeUrl === undefined || isStr(a.storeUrl))
  )
}

/** Shape check. Anything that is not exactly a current-version state reads as empty. */
export function decodeState(value: unknown): FixtureState {
  if (typeof value !== 'object' || value === null) return EMPTY_STATE
  const s = value as FixtureState
  if (s.v !== VERSION) return EMPTY_STATE
  if (typeof s.drafts !== 'object' || s.drafts === null) return EMPTY_STATE
  if (!Object.values(s.drafts).every((lines) => Array.isArray(lines) && lines.every(isLine))) {
    return EMPTY_STATE
  }
  if (!Array.isArray(s.orders) || !s.orders.every(isOrder)) return EMPTY_STATE
  if (s.applied !== undefined && !isApplication(s.applied)) return EMPTY_STATE
  if (!Number.isInteger(s.seq) || s.seq < 0) return EMPTY_STATE
  return s
}

export async function readFixtureState(): Promise<FixtureState> {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (!raw) return EMPTY_STATE
  return decodeState(openJson(raw))
}

/**
 * Write-back. Only callable from a server action or route handler — Next refuses to set a
 * cookie during a render, which is correct: a page that reads the draft must not also
 * change it. Every mutating adapter method is reached through an action.
 */
export async function writeFixtureState(state: FixtureState): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_NAME, sealJson(state), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}
