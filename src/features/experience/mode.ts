import 'server-only'

/**
 * EXPERIENCE STATES — Cinema · Balanced · Instant Shop.
 *
 * A presentation context, never a routing branch. CLAUDE.md §7: modes change how much
 * choreography wraps the content and never change the content. Nothing about the products,
 * prices, packs, availability, sizes, commerce actions, URLs or accessibility guarantees
 * differs between them — only the amount of editorial scale.
 *
 * Resolved on the server from a cookie and applied as a `data-experience` attribute, so the
 * whole feature costs **zero client JavaScript** and the choice survives a reload.
 *
 * `prefers-reduced-motion` is deliberately NOT part of this resolution. It applies inside
 * every state and is handled once in tokens.css: it is not a fourth state, and a health
 * setting must never silently downgrade someone to a plain grid.
 */

import { cookies } from 'next/headers'

export const EXPERIENCE_STATES = ['cinema', 'balanced', 'instant'] as const
export type ExperienceState = (typeof EXPERIENCE_STATES)[number]

export const EXPERIENCE_LABELS: Record<ExperienceState, string> = {
  cinema: 'Cinema',
  balanced: 'Balanced',
  instant: 'Instant Shop',
}

const COOKIE_NAME = 'lb_experience'
const DEFAULT_STATE: ExperienceState = 'balanced'

function isExperienceState(value: string | undefined): value is ExperienceState {
  return EXPERIENCE_STATES.includes((value ?? '') as ExperienceState)
}

/**
 * The visitor's chosen state, or the default.
 *
 * An authenticated wholesale buyer defaults to Instant Shop — they are here to place an
 * order, not to watch a film — but an explicit choice always wins over the role default.
 */
export async function resolveExperience(options: { isBuyer?: boolean } = {}) {
  const chosen = (await cookies()).get(COOKIE_NAME)?.value

  if (isExperienceState(chosen)) {
    return { state: chosen, resolvedBy: 'user' as const }
  }
  if (options.isBuyer) {
    return { state: 'instant' as ExperienceState, resolvedBy: 'role' as const }
  }
  return { state: DEFAULT_STATE, resolvedBy: 'default' as const }
}

export const EXPERIENCE_COOKIE = COOKIE_NAME
