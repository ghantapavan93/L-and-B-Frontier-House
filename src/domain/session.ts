/**
 * SESSION — the authorisation context.
 *
 * Deny by default. Only `{ kind: 'buyer', status: 'approved' }` is authorised. Every other
 * shape — including a buyer whose application is pending, rejected or suspended, and an
 * expired session — receives the public view.
 */

import type { BuyerStatus } from './buyer'

export type Session =
  | { readonly kind: 'anonymous' }
  /** A session cookie was present but is no longer valid. Must not flash restricted data. */
  | { readonly kind: 'expired' }
  | { readonly kind: 'buyer'; readonly buyerId: string; readonly status: BuyerStatus }
  | { readonly kind: 'owner'; readonly userId: string }

export const ANONYMOUS_SESSION: Session = { kind: 'anonymous' }

/**
 * The single predicate that decides whether restricted wholesale data may exist in a
 * payload. Every restricted read passes through here.
 */
export function isAuthorisedBuyer(
  session: Session,
): session is { kind: 'buyer'; buyerId: string; status: 'approved' } {
  return session.kind === 'buyer' && session.status === 'approved'
}

/** May reach `/trade/*` at all, even if only to see their application status. */
export function isSignedIn(session: Session): boolean {
  return session.kind === 'buyer' || session.kind === 'owner'
}
