import 'server-only'

/**
 * THE PHASE 2 FEATURE BOUNDARY.
 *
 * A BUILD-TIME boundary: the public routes are statically prerendered, so the flag is
 * evaluated when `next build` runs. Deploying the verified Phase 1 experience means building
 * with the variable set to `0` — which the flag-off structural test does for real, into its
 * own dist directory, and then boots.
 *
 * Unset defaults to ENABLED: the cinematic experience is the intended product, and the flag
 * exists as a safety exit, not an opt-in. Nothing behind it changes content, prices, routes,
 * authorization or caching — it gates presentation only, which is why the flag-off state is
 * simply the Phase 1 homepage.
 */
export function frontierEnabled(): boolean {
  return process.env['NEXT_PUBLIC_ENABLE_FRONTIER_EXPERIENCE'] !== '0'
}
