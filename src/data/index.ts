import 'server-only'

import { FixtureCommerceAdapter } from './adapters/fixture-commerce-adapter'
import type { CommerceAdapter } from './adapters/commerce-adapter'

/**
 * The single adapter instance. Swapping this for a real provider is the whole point of the
 * boundary — no route, component or repository signature changes.
 */
export const commerce: CommerceAdapter = new FixtureCommerceAdapter()
