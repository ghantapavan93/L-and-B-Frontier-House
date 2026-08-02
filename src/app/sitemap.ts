import type { MetadataRoute } from 'next'
import { listPublicProducts } from '@/data/catalog-repository'
import { routableCategories } from '@/domain/taxonomy'

/**
 * Public routes only.
 *
 * Built from the public catalogue read, so a restricted value cannot reach the sitemap even
 * in principle — the objects this function handles have no wholesale field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env['LB_SITE_URL'] ?? 'http://localhost:3000'
  const products = await listPublicProducts()

  const staticRoutes = ['', '/new-arrivals', '/wholesale'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const categoryRoutes = routableCategories().flatMap((category) => [
    { url: `${base}/shop/${category.slug}`, changeFrequency: 'daily' as const, priority: 0.8 },
    {
      url: `${base}/size-and-fit/${category.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ])

  const productRoutes = products.map((product) => ({
    url: `${base}/product/${product.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
