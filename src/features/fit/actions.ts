'use server'

/**
 * FIT PASSPORT ACTIONS — plain form posts, no-JS complete, no value in a URL.
 */

import { redirect } from 'next/navigation'
import { DENIM_SILHOUETTES } from '@/features/discovery/denim-finder'
import { clearFitProfile, writeFitProfile } from './profile'
import type { FitProfile } from './profile'

export async function saveFitProfileAction(formData: FormData): Promise<void> {
  const rawWaist = formData.get('waistIn')
  const rawSilhouette = formData.get('silhouette')

  const waist = typeof rawWaist === 'string' ? Number.parseFloat(rawWaist) : NaN
  const silhouette =
    typeof rawSilhouette === 'string' &&
    DENIM_SILHOUETTES.some((s) => s.value === rawSilhouette)
      ? rawSilhouette
      : undefined

  const profile: FitProfile = {
    // The published charts run roughly 23–40in; anything outside is a typo, not a person.
    ...(Number.isFinite(waist) && waist >= 20 && waist <= 60 ? { waistIn: waist } : {}),
    ...(silhouette ? { silhouette } : {}),
  }

  if (profile.waistIn === undefined && profile.silhouette === undefined) {
    redirect('/fit-passport?error=empty')
  }

  await writeFitProfile(profile)
  redirect('/fit-passport')
}

export async function clearFitProfileAction(): Promise<void> {
  await clearFitProfile()
  redirect('/fit-passport')
}
