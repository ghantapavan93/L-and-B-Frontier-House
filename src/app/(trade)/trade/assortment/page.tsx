import type { Metadata } from 'next'
import Link from 'next/link'
import { requireApprovedBuyer } from '@/auth/guards'
import { listVisibleProducts } from '@/data/catalog-repository'
import { buildAssortment } from '@/domain/assortment'
import { isAuthorisedProduct } from '@/domain/product'
import { hasStatedPlan, readAssortmentParams } from '@/features/order/assortment-params'
import { AssortmentForm, AssortmentPlanView, PlannerBasis } from '@/ui/assortment'
import { FixtureNotice } from '@/ui/notices'

export const metadata: Metadata = { title: 'Assortment builder', robots: { index: false } }

/**
 * ASSORTMENT BUILDER — restricted in its entirety.
 *
 * The guard runs before the read, and the read passes the session through the authorisation
 * seam. `isAuthorisedProduct` then narrows to the only shape that carries wholesale terms,
 * so an unauthorised widening cannot reach the planner: it would receive public products,
 * which have no price to plan against and are filtered out by the type guard.
 *
 * Data is awaited before render rather than streamed. That is deliberate — see
 * docs/assets/LB_LOADING_STATES.md: a Suspense boundary here would flush a 200 ahead of the
 * guard and leave a no-JavaScript buyer holding a fallback.
 */
export default async function AssortmentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await requireApprovedBuyer('/trade/assortment')

  const params = await searchParams
  const input = readAssortmentParams(params)
  const stated = hasStatedPlan(params)

  const products = (await listVisibleProducts(session)).filter(isAuthorisedProduct)
  const plan = buildAssortment(products, input)

  return (
    <div className="container section stack">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/trade">Your account</Link> / Assortment builder
        </p>
      </nav>

      <p className="eyebrow">Wholesale</p>
      <h1>Assortment builder</h1>
      <p className="lede">
        Turn a budget into a rack. Set what you have to spend and how you buy, and this fills it
        from the published line at your prices — then hands you an ordinary order you can change
        line by line.
      </p>

      <FixtureNotice detail={false} />

      <AssortmentForm input={input} />

      <PlannerBasis />

      {stated ? (
        <AssortmentPlanView plan={plan} />
      ) : (
        <section className="state-block" aria-labelledby="start-heading">
          <h2 id="start-heading">Start with a budget</h2>
          <p>
            Set your figures above and build the rack. Nothing is ordered until you add it, and
            every line stays editable after you do.
          </p>
        </section>
      )}
    </div>
  )
}
