import 'server-only'

/**
 * SEALING — the one HMAC every server-held cookie shares.
 *
 * The session cookie and the fixture commerce state are both client-held and therefore
 * untrusted on the way back in. Both are sealed here, with one key, so a value that was
 * not written by this server fails before it is parsed. This module imports nothing from
 * the data layer on purpose: the data layer seals its own state with it, and a cycle
 * through `@/data` would evaluate the adapter before the key exists.
 *
 * The seal proves origin, not meaning — every caller still validates the shape of what
 * comes back.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * A development signing key. In any deployed environment LB_SESSION_SECRET must be set;
 * the build refuses to start without it in production.
 */
export function signingSecret(): string {
  const secret = process.env['LB_SESSION_SECRET']
  if (secret && secret.length > 0) return secret
  if (process.env.NODE_ENV === 'production' && process.env['LB_ALLOW_DEV_SECRET'] !== '1') {
    throw new Error('LB_SESSION_SECRET is required in production')
  }
  return 'development-only-session-secret'
}

export function sign(value: string): string {
  return createHmac('sha256', signingSecret()).update(value).digest('base64url')
}

export function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  if (bufferA.length !== bufferB.length) return false
  return timingSafeEqual(bufferA, bufferB)
}

export function sealJson(value: unknown): string {
  const body = Buffer.from(JSON.stringify(value)).toString('base64url')
  return `${body}.${sign(body)}`
}

/** `null` for a missing, tampered or unparseable token. Shape is the caller's problem. */
export function openJson(token: string): unknown {
  const separator = token.lastIndexOf('.')
  if (separator <= 0) return null
  const body = token.slice(0, separator)
  if (!safeEqual(token.slice(separator + 1), sign(body))) return null
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}
