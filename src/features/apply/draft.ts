import 'server-only'

/**
 * APPLICATION DRAFT — server-held state for the four-step Trade Access flow.
 *
 * The flow works with JavaScript disabled, which means step state cannot live in client
 * memory; and several fields are personal (the sales tax ID above all), which means step
 * state must never travel in a URL (privacy rule: no personal data in query strings). So
 * the draft lives in an httpOnly cookie on the applicant's own browser: each step's action
 * merges its fields in, the review step reads it back, and submission clears it.
 *
 * The tax ID is treated here exactly as `Buyer` treats it: never logged, never rendered
 * back in full (the review step shows the last four characters), never in a URL.
 */

import { cookies } from 'next/headers'

const COOKIE_NAME = 'lb-apply-draft'
const MAX_AGE_SECONDS = 60 * 60

export type ApplyDraft = {
  readonly retailerName?: string
  readonly buyerName?: string
  readonly email?: string
  readonly phone?: string
  readonly salesTaxId?: string
  readonly region?: string
  readonly city?: string
  readonly storeUrl?: string
  readonly storefront?: 'physical' | 'online' | 'both'
  readonly styleProfile?: readonly string[]
  readonly categoriesOfInterest?: readonly string[]
  readonly showsAttended?: string
  readonly referralSource?: string
  readonly notes?: string
}

export async function readApplyDraft(): Promise<ApplyDraft> {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as ApplyDraft) : {}
  } catch {
    return {}
  }
}

/** Merge-and-write. Only callable from a server action. */
export async function writeApplyDraft(patch: ApplyDraft): Promise<void> {
  const current = await readApplyDraft()
  const jar = await cookies()
  jar.set(COOKIE_NAME, JSON.stringify({ ...current, ...patch }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function clearApplyDraft(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

/** Which step the draft is complete through — the review step links back per section. */
export function draftCompleteThrough(draft: ApplyDraft): 0 | 1 | 2 | 3 {
  const step1 = Boolean(draft.retailerName && draft.buyerName && draft.email)
  const step2 = Boolean(draft.salesTaxId && draft.region && draft.city)
  if (!step1) return 0
  if (!step2) return 1
  return 3
}
