import 'server-only'

/**
 * SESSION TRANSPORT.
 *
 * An httpOnly, sameSite cookie carrying an HMAC-signed payload. Authorisation is decided on
 * the server, per request, before render — not in a layout, not in a client component, and
 * not in middleware alone.
 *
 * The buyer's *current* status is re-read from the data layer on every request. The cookie
 * carries an identifier, never a role or an entitlement: a buyer suspended between requests
 * loses access on the next request, not at their next sign-in.
 */

import { cookies } from 'next/headers'
import { safeEqual, sign } from './seal'
import { commerce } from '@/data'
import { ANONYMOUS_SESSION } from '@/domain/session'
import type { Session } from '@/domain/session'

const COOKIE_NAME = 'lb_session'
const MAX_AGE_SECONDS = 60 * 60 * 8

type TokenPayload = { buyerId: string; expiresAt: number }

function encode(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

function decode(token: string): TokenPayload | null {
  const separator = token.lastIndexOf('.')
  if (separator <= 0) return null

  const body = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (!safeEqual(signature, sign(body))) return null

  try {
    const parsed: unknown = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as TokenPayload).buyerId !== 'string' ||
      typeof (parsed as TokenPayload).expiresAt !== 'number'
    ) {
      return null
    }
    return parsed as TokenPayload
  } catch {
    return null
  }
}

export async function startBuyerSession(buyerId: string): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_NAME, encode({ buyerId, expiresAt: Date.now() + MAX_AGE_SECONDS * 1000 }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function endSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

/**
 * The one place a request becomes a `Session`.
 *
 * Fail closed on every branch: a missing cookie, a bad signature, an expired token, an
 * unknown buyer, or a thrown lookup all resolve to a session with no authorisation.
 */
export async function getSession(): Promise<Session> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return ANONYMOUS_SESSION

  const payload = decode(token)
  if (!payload) return { kind: 'expired' }
  if (payload.expiresAt < Date.now()) return { kind: 'expired' }

  try {
    const buyer = await commerce.getBuyerById(payload.buyerId)
    if (!buyer) return { kind: 'expired' }
    return { kind: 'buyer', buyerId: buyer.id, status: buyer.status }
  } catch {
    return ANONYMOUS_SESSION
  }
}
