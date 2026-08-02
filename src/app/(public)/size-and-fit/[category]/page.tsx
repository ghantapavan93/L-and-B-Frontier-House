import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listPublicProducts } from '@/data/catalog-repository'
import { findRoutableCategory, routableCategories } from '@/domain/taxonomy'
import { SizeAndFitTable } from '@/ui/size-and-fit-table'

type Params = { category: string }

/** Closed param set, so an unknown category 404s as an unmatched URL. See the product page. */
export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return routableCategories().map((category) => ({ category: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = findRoutableCategory(slug)
  if (!category) return {}
  return {
    title: `${category.label} size and fit`,
    description: `Body measurements for ${category.label.toLowerCase()} styles, in inches.`,
  }
}

/**
 * A standalone, linkable size-and-fit surface per category.
 *
 * It exists because buyers and shoppers search for it directly, and because a size chart
 * that lives only inside a product page is not findable. Same structured tables, same
 * source of truth.
 */
export default async function SizeAndFitPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params
  const category = findRoutableCategory(slug)
  if (!category) notFound()

  const products = await listPublicProducts({ categorySlug: category.slug })

  // One representative table per distinct size-range kind offered in this category.
  const seen = new Set<string>()
  const ranges = products
    .flatMap((p) => p.sizeRanges)
    .filter((range) => {
      if (seen.has(range.kind)) return false
      seen.add(range.kind)
      return true
    })

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/">Home</Link> /{' '}
          <Link href={`/shop/${category.slug}`}>{category.label}</Link> / Size and fit
        </p>
      </nav>

      <h1>{category.label} size and fit</h1>
      <p>
        Body measurements in inches. If you are between sizes on the waist, take the larger size
        — our denim is cut with stretch through the hip.
      </p>

      {/* The table component starts at h3, so this section heading keeps the outline
          contiguous — without it the page jumps straight from h1 to h3. */}
      <h2>Measurements by size range</h2>

      {ranges.length > 0 ? (
        <SizeAndFitTable ranges={ranges} />
      ) : (
        <div className="state-block">
          <h2>Not published yet</h2>
          <p>Measurements for this category are not published yet.</p>
        </div>
      )}
    </div>
  )
}
