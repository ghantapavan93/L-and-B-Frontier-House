'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EXPERIENCE_COOKIE, EXPERIENCE_STATES } from './mode'
import type { ExperienceState } from './mode'

/**
 * Sets the experience state.
 *
 * A plain form action, so the selector works with JavaScript disabled: the form POSTs, the
 * cookie is set, and the visitor is returned to the page they were on. The value is
 * allowlisted, and the return path is accepted only when it is same-origin and relative.
 */
export async function setExperienceAction(formData: FormData): Promise<void> {
  const requested = formData.get('state')
  const returnTo = formData.get('returnTo')

  const state = EXPERIENCE_STATES.includes(requested as ExperienceState)
    ? (requested as ExperienceState)
    : 'balanced'

  const jar = await cookies()
  jar.set(EXPERIENCE_COOKIE, state, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  const destination =
    typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
      ? returnTo
      : '/'

  redirect(destination)
}
