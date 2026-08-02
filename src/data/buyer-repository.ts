import 'server-only'

/**
 * BUYER ACCESS.
 *
 * `Buyer` carries the sales tax ID, which never leaves the server and is never rendered.
 * Callers receive `BuyerProfile`, which has no tax-ID value — only a verified boolean.
 */

import { toBuyerProfile } from '@/domain/buyer'
import type { BuyerProfile } from '@/domain/buyer'
import type { Session } from '@/domain/session'
import { commerce } from './index'
import type { BuyerApplication } from './adapters/commerce-adapter'

export async function getBuyerProfile(session: Session): Promise<BuyerProfile | null> {
  if (session.kind !== 'buyer') return null
  try {
    const buyer = await commerce.getBuyerById(session.buyerId)
    return buyer ? toBuyerProfile(buyer) : null
  } catch {
    return null
  }
}

export async function submitBuyerApplication(
  application: BuyerApplication,
): Promise<BuyerProfile> {
  const buyer = await commerce.createBuyerApplication(application)
  return toBuyerProfile(buyer)
}
