/**
 * REDIRECT. The men's styles are catalogue records now (fixtures/products-mens.ts), so
 * their pages are /product/[slug] like every other garment — gallery, anatomy, the
 * buyer's price panel, the line sheet, the order. This route existed while the line was
 * a demonstration OUTSIDE the catalogue; it stays only so an old link lands on the right
 * page. One product, one URL.
 */
import { permanentRedirect } from 'next/navigation'
import { MENS_DEMO_PRODUCTS } from '@/fixtures/mens-demo'

type Params = { slug: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return MENS_DEMO_PRODUCTS.map((product) => ({ slug: product.slug }))
}

export default async function MensProductRedirect({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  permanentRedirect(`/product/${slug}`)
}
