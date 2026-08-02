'use server'

/**
 * AUTHENTICATION ACTIONS.
 *
 * Plain form actions. They work without JavaScript — the form POSTs, the server acts, and
 * the response redirects. Errors travel as a search parameter rather than client state, so
 * the no-JS path shows the same messages as the enhanced one.
 *
 * No error message ever echoes a restricted value.
 */

import { redirect } from 'next/navigation'
import { commerce } from '@/data'
import { submitBuyerApplication } from '@/data/buyer-repository'
import { endSession, startBuyerSession } from './session'

function readString(form: FormData, field: string): string {
  const value = form.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = readString(formData, 'email')
  const password = readString(formData, 'password')
  const next = readString(formData, 'next')

  if (!email || !password) {
    redirect('/sign-in?error=missing')
  }

  const buyer = await commerce.authenticateBuyer(email, password)
  if (!buyer) {
    // Deliberately does not distinguish unknown account from wrong password.
    redirect('/sign-in?error=invalid')
  }

  await startBuyerSession(buyer.id)

  // Only same-origin relative paths are honoured, so the parameter cannot be an open redirect.
  const destination = next.startsWith('/') && !next.startsWith('//') ? next : '/trade'
  redirect(destination)
}

export async function signOutAction(): Promise<void> {
  await endSession()
  redirect('/')
}

export async function applyAction(formData: FormData): Promise<void> {
  const email = readString(formData, 'email')
  const retailerName = readString(formData, 'retailerName')
  const salesTaxId = readString(formData, 'salesTaxId')
  const city = readString(formData, 'city')
  const region = readString(formData, 'region')

  if (!email || !retailerName || !salesTaxId || !city || !region) {
    redirect('/wholesale/apply?error=missing')
  }

  const profile = await submitBuyerApplication({
    email,
    retailerName,
    salesTaxId,
    city,
    region,
  })

  await startBuyerSession(profile.id)
  redirect('/trade')
}
