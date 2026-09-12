import type { Metadata } from 'next'
import { CATEGORY_TILE_FALLBACK } from '@/content/media/campaign-plates'
import { officialMediaForSlot } from '@/content/media/official-media'
import { listPublicProducts } from '@/data/catalog-repository'
import { populatedEdits } from '@/domain/edits'
import { navigableCategories } from '@/domain/taxonomy'
import { ChooseYourWest } from '@/ui/choose-your-west'

export const metadata: Metadata = {
  title: 'Choose your west',
  description:
    'Ways into the line by who it is for — the working West, the rodeo, after dark — each one a real set of garments with the rule that picks them stated plainly.',
}

/**
 * THE EDITS INDEX — "who is it for", as a page of its own.
 *
 * `/edit/[slug]` has existed for each edit since the identity entrances shipped; what never
 * existed was the index above them. It lived on the homepage as "Choose your west", 1,771
 * px of it, answering a question — is this for me — that the front page now answers by
 * showing garments instead. The band is unchanged: same edits, same honest counts, same
 * category row of crawlable `/shop/[category]` links.
 */
export default async function EditsIndexPage() {
  const products = await listPublicProducts({ sort: 'newest' })
  return (
    <ChooseYourWest
      heading="h1"
      edits={populatedEdits(products)}
      products={products}
      categories={navigableCategories().map((category) => ({
        ...category,
        media:
          officialMediaForSlot(`category-${category.slug}`) ??
          CATEGORY_TILE_FALLBACK[category.slug],
      }))}
    />
  )
}
