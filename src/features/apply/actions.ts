'use server'

/**
 * TRADE ACCESS ACTIONS — the four-step application, as plain form posts.
 *
 * Each step's form POSTs here, the action merges the step's fields into the draft cookie,
 * and the response redirects to the next step. Errors travel as search parameters so the
 * no-JS path shows the same messages as the enhanced one. No field value ever appears in a
 * URL, and no error message ever echoes one back.
 */

import { redirect } from 'next/navigation'
import { startBuyerSession } from '@/auth/session'
import { submitBuyerApplication } from '@/data/buyer-repository'
import type { BuyerApplication } from '@/data/adapters/commerce-adapter'
import { clearApplyDraft, readApplyDraft, writeApplyDraft } from './draft'
import type { ApplyDraft } from './draft'

function readString(form: FormData, field: string): string {
  const value = form.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

function readList(form: FormData, field: string): string[] {
  return form
    .getAll(field)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)
}

const STOREFRONTS = ['physical', 'online', 'both'] as const
type Storefront = (typeof STOREFRONTS)[number]

function readStorefront(form: FormData): Storefront | undefined {
  const value = readString(form, 'storefront')
  return (STOREFRONTS as readonly string[]).includes(value) ? (value as Storefront) : undefined
}

export async function applyStepAction(formData: FormData): Promise<void> {
  const step = readString(formData, 'step')

  if (step === '1') {
    const patch: ApplyDraft = {
      retailerName: readString(formData, 'retailerName'),
      buyerName: readString(formData, 'buyerName'),
      email: readString(formData, 'email'),
      phone: readString(formData, 'phone'),
    }
    if (!patch.retailerName || !patch.buyerName || !patch.email) {
      await writeApplyDraft(patch)
      redirect('/wholesale/apply?step=1&error=missing')
    }
    await writeApplyDraft(patch)
    redirect('/wholesale/apply?step=2')
  }

  if (step === '2') {
    const storefront = readStorefront(formData)
    const patch: ApplyDraft = {
      salesTaxId: readString(formData, 'salesTaxId'),
      region: readString(formData, 'region'),
      city: readString(formData, 'city'),
      storeUrl: readString(formData, 'storeUrl'),
      ...(storefront ? { storefront } : {}),
    }
    if (!patch.salesTaxId || !patch.region || !patch.city) {
      await writeApplyDraft(patch)
      redirect('/wholesale/apply?step=2&error=missing')
    }
    await writeApplyDraft(patch)
    redirect('/wholesale/apply?step=3')
  }

  if (step === '3') {
    await writeApplyDraft({
      styleProfile: readList(formData, 'styleProfile'),
      categoriesOfInterest: readList(formData, 'categoriesOfInterest'),
      showsAttended: readString(formData, 'showsAttended'),
      referralSource: readString(formData, 'referralSource'),
      notes: readString(formData, 'notes'),
    })
    redirect('/wholesale/apply?step=4')
  }

  redirect('/wholesale/apply?step=1')
}

export async function submitApplicationAction(formData: FormData): Promise<void> {
  const draft = await readApplyDraft()

  // Server-side re-validation — the review screen may have been reached out of order.
  if (!draft.retailerName || !draft.buyerName || !draft.email) {
    redirect('/wholesale/apply?step=1&error=missing')
  }
  if (!draft.salesTaxId || !draft.region || !draft.city) {
    redirect('/wholesale/apply?step=2&error=missing')
  }
  if (formData.get('terms') !== 'on') {
    redirect('/wholesale/apply?step=4&error=terms')
  }

  const application: BuyerApplication = {
    email: draft.email,
    retailerName: draft.retailerName,
    salesTaxId: draft.salesTaxId,
    city: draft.city,
    region: draft.region,
    buyerName: draft.buyerName,
    ...(draft.phone ? { phone: draft.phone } : {}),
    ...(draft.storefront ? { storefront: draft.storefront } : {}),
    ...(draft.storeUrl ? { storeUrl: draft.storeUrl } : {}),
    ...(draft.styleProfile?.length ? { styleProfile: draft.styleProfile } : {}),
    ...(draft.categoriesOfInterest?.length
      ? { categoriesOfInterest: draft.categoriesOfInterest }
      : {}),
    ...(draft.showsAttended ? { showsAttended: draft.showsAttended } : {}),
    ...(draft.referralSource ? { referralSource: draft.referralSource } : {}),
    ...(draft.notes ? { notes: draft.notes } : {}),
  }

  const profile = await submitBuyerApplication(application)
  await clearApplyDraft()
  await startBuyerSession(profile.id)
  redirect('/wholesale/apply/received')
}
