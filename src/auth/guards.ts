import 'server-only'

/**
 * ROUTE GUARDS.
 *
 * Called at the top of every authorised page, before any restricted read. Not in a layout
 * and not in middleware alone: a layout does not prevent its child page from executing, so
 * a layout-only guard would still run restricted code for an unapproved session.
 *
 * Every branch fails closed.
 */

import { redirect } from 'next/navigation'
import { isAuthorisedBuyer, isSignedIn } from '@/domain/session'
import type { Session } from '@/domain/session'
import { getSession } from './session'

export type ApprovedBuyerSession = { kind: 'buyer'; buyerId: string; status: 'approved' }

/**
 * Resolves to an approved buyer session, or redirects.
 *
 * `returnTo` preserves intent across a re-authentication, so an expired session lands back
 * on the page the buyer wanted rather than a generic dashboard.
 */
export async function requireApprovedBuyer(returnTo: string): Promise<ApprovedBuyerSession> {
  const session = await getSession()

  if (isAuthorisedBuyer(session)) return session

  if (!isSignedIn(session)) {
    redirect(`/sign-in?error=required&next=${encodeURIComponent(returnTo)}`)
  }

  // Signed in, but pending, rejected or suspended. The account surface explains why and
  // what to do next — never a raw 403 and never a dead end.
  redirect('/trade')
}

/** Any signed-in buyer, approved or not. Used by the account surface itself. */
export async function requireSignedIn(returnTo: string): Promise<Session> {
  const session = await getSession()
  if (isSignedIn(session)) return session
  redirect(`/sign-in?error=required&next=${encodeURIComponent(returnTo)}`)
}
