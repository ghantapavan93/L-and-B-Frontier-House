/**
 * THE AUTHORISATION SEAM.
 *
 * One helper. One call site per data access. Deny by default.
 *
 * The restricted field is not in the returned object unless the session is authorised —
 * not hidden, not null, ABSENT. TypeScript then makes it impossible to render.
 *
 * This is the architectural answer to the audit's central finding: no design source
 * expresses an authorisation boundary. See docs/production/08.
 */

import type {
  AuthorisedProduct,
  ProductRecord,
  PublicProduct,
  VisibleProduct,
} from '@/domain/product'
import { isAuthorisedBuyer } from '@/domain/session'
import type { Session } from '@/domain/session'

/**
 * Strips the wholesale terms from the record. Written as an explicit destructure so that
 * adding a new restricted field to `ProductRecord` without adding it here is a type error
 * rather than a silent leak.
 */
function toPublicProduct(record: ProductRecord): PublicProduct {
  const {
    // Restricted. Deliberately discarded.
    wholesale: _wholesale,
    ...base
  } = record
  return { ...base, access: 'public' }
}

function toAuthorisedProduct(record: ProductRecord): AuthorisedProduct {
  return { ...record, access: 'authorised' }
}

/**
 * The only function permitted to widen a product into its authorised shape.
 *
 * Fail closed: any session that is not a demonstrably approved buyer receives the public
 * shape, including `expired`, `pending`, `rejected` and `suspended`.
 */
export function visibleProduct(record: ProductRecord, session: Session): VisibleProduct {
  return isAuthorisedBuyer(session) ? toAuthorisedProduct(record) : toPublicProduct(record)
}

export function visibleProducts(
  records: readonly ProductRecord[],
  session: Session,
): VisibleProduct[] {
  return records.map((record) => visibleProduct(record, session))
}

/** Public shape regardless of session. Used by surfaces that are public by definition. */
export function publicProduct(record: ProductRecord): PublicProduct {
  return toPublicProduct(record)
}

export function publicProducts(records: readonly ProductRecord[]): PublicProduct[] {
  return records.map(toPublicProduct)
}
