import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listPublicProducts } from '@/data/catalog-repository'
import { EDITS, findEdit, productsInEdit } from '@/domain/edits'
import { FixtureNotice } from '@/ui/notices'
import { ProductGrid } from '@/ui/product-card'

type Params = { slug: string }

/**
 * AN EDIT — a merchandising view of the published catalogue.
 *
 * `dynamicParams = false` for the same reason every other listing uses it: an unknown slug
 * becomes an unmatched URL, which is the one 404 path Next server-renders into the initial
 * HTML rather than streaming as an RSC payload.
 *
 * Note what this route deliberately does NOT do. It does not add a category, it does not
 * appear in the sitemap's category set, and it publishes no product fact of its own. Every
 * garment here is the same record served under /shop, reached by a different door.
 */
export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return EDITS.map((edit) => ({ slug: edit.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const edit = findEdit(slug)
  if (!edit) return {}
  return {
    title: edit.name,
    description: edit.blurb,
    alternates: { canonical: `/edit/${edit.slug}` },
  }
}

export default async function EditPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const edit = findEdit(slug)
  if (!edit) notFound()

  const products = productsInEdit(edit, await listPublicProducts())

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/">Home</Link> / {edit.name}
        </p>
      </nav>

      <p className="eyebrow">An edit</p>
      <h1>{edit.name}</h1>
      <p className="lede">{edit.blurb}</p>

      {/*
        The rule, verbatim. An edit that will not say what put a garment in it is indis-
        tinguishable from a hand-picked list, and a hand-picked list presented as a theme is
        a claim about the clothes rather than a view of them.
      */}
      <section className="notice" aria-labelledby="rule-heading">
        <p className="notice__title" id="rule-heading">
          What is in this edit
        </p>
        <p className="meta">{edit.rule}</p>
        <p className="meta">
          It is a filter over the published line, not a separate collection. Every style here
          also sits in its own category, at the same price and in the same packs.
        </p>
      </section>

      <FixtureNotice detail={false} />

      {/*
        A real heading before the grid. Product cards are `h3`, so without it the outline
        jumps h1 → h3 — a category listing gets away with it only because the facet panel's
        "Filter" heading happens to sit in between, which is an accident of layout rather
        than a structure to rely on.
      */}
      <section aria-labelledby="styles-heading" style={{ marginTop: 'var(--space-6)' }}>
        <h2 id="styles-heading">
          {products.length} {products.length === 1 ? 'style' : 'styles'} in this edit
        </h2>
        <ProductGrid
          products={products}
          emptyMessage="Nothing in the published line matches this edit yet."
        />
      </section>

      <section className="section" aria-labelledby="other-edits-heading">
        <h2 id="other-edits-heading" className="eyebrow">
          Other ways in
        </h2>
        <ul className="cluster" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {EDITS.filter((other) => other.slug !== edit.slug).map((other) => (
            <li key={other.slug}>
              <Link href={`/edit/${other.slug}`} className="button button--secondary">
                {other.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/new-arrivals" className="button button--secondary">
              Everything, newest first
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
