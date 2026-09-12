import Link from 'next/link'
import type { Edit } from '@/domain/edits'
import type { MediaRef, PublicProduct } from '@/domain/product'
import { productsInEdit } from '@/domain/edits'
import { primaryMedia } from '@/domain/product'
import { EditorialMedia } from '@/ui/product-media'

/**
 * CHOOSE YOUR WEST — identity entrances, above the category grid.
 *
 * The category grid answers "what is it". This answers "who is it for", which is the
 * question someone arriving from a search or a post is actually asking. Both ship: the
 * edits are a way in, never a replacement for the taxonomy, and every card below still
 * lands the visitor on verified product.
 *
 * Each card states its count. That is deliberate — a merchandising tile that hides how
 * little sits behind it is the oldest trick in fashion retail, and this catalogue is small
 * enough that the honest number is more persuasive than the tile.
 */
/**
 * The first image in this edit that no earlier card has already taken.
 *
 * Edits overlap by design — a fringed one-shoulder dress is honestly both After Dark and
 * The Rodeo Edit — but two tiles carrying the identical photograph reads as a broken grid
 * rather than as an overlap, and it hides the breadth the section exists to show. Claiming
 * covers in render order keeps each card distinct without reordering anyone's results or
 * touching what is actually *in* an edit.
 *
 * Falling back to the first image when everything is claimed is deliberate: a duplicate
 * picture is a smaller failure than a card with a hole in it.
 */
/**
 * Small counts read as words in body copy; anything larger falls back to the numeral.
 * The band cannot render fewer than two edits and still be a choice, so the range is short.
 */
const COUNT_WORD: Record<number, string> = {
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
}

function pickCover(products: readonly PublicProduct[], claimed: Set<string>) {
  const withMedia = products.map(primaryMedia).filter((media) => media !== undefined)
  const fresh = withMedia.find((media) => !claimed.has(media.id))
  const chosen = fresh ?? withMedia[0]
  if (chosen) claimed.add(chosen.id)
  return chosen
}

/**
 * A band's heading is an `h2` when it sits among other bands and an `h1` when the band IS
 * the page. The route decides; the markup stays otherwise identical.
 */
type HeadingLevel = 'h1' | 'h2'

export function ChooseYourWest({
  edits,
  products,
  categories,
  heading: Heading = 'h2',
}: {
  heading?: HeadingLevel
  edits: readonly Edit[]
  products: readonly PublicProduct[]
  /**
   * The shipping taxonomy, rendered as the closing row of this same band.
   *
   * It used to be a whole separate section further down the page, with its own heading and
   * its own 168px of section rhythm, answering "what is it" where this band answers "who is
   * it for". Two bands, one decision. The Burberry teardown measures the cost of that habit
   * across the page — three "ways in" bands against their one
   * (docs/research/teardown-burberry-gstar-vero.md §0) — and the fix is to let the identity
   * cards and the taxonomy share a band, the way a shop rail carries its own segmented
   * control rather than spawning a second rail.
   *
   * These stay real crawlable links to the real category URLs: the no-JS assertion and the
   * sitemap both depend on them being here.
   */
  categories: readonly {
    slug: string
    label: string
    blurb: string
    media?: MediaRef | undefined
  }[]
}) {
  if (edits.length === 0) return null
  // Card names and the taxonomy title sit one level under the band heading, wherever it sits.
  const Sub = Heading === 'h1' ? 'h2' : 'h3'

  const claimed = new Set<string>()

  return (
    <section className="container section" aria-labelledby="west-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Ways in</p>
          <Heading id="west-heading">Choose your west</Heading>
          {/*
            The count is derived, never written down.

            This said "Four ways the same line reads" while the band rendered three: one of
            the four edits currently matches no published product, so `populatedEdits` drops
            it — correctly — and the hardcoded numeral outlived the thing it counted. A
            catalogue this small changes the answer whenever a style lands or sells out, and
            §12 allows real numbers only.
          */}
          <p className="meta">
            {COUNT_WORD[edits.length] ?? edits.length} ways the same line reads. Every edit is a
            filter over the published catalogue — the garments are the ones you will find under
            Women, Girls and Accessories.
          </p>
        </div>
      </div>

      <ul className="edit-grid">
        {edits.map((edit) => {
          const inEdit = productsInEdit(edit, products)
          const cover = pickCover(inEdit, claimed)

          return (
            <li key={edit.slug}>
              <article className="edit-card">
                <Link href={`/edit/${edit.slug}`} className="edit-card__link">
                  {cover ? (
                    <div className="edit-card__media">
                      <EditorialMedia
                        media={cover}
                        sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 50vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <Sub className="edit-card__name">{edit.name}</Sub>
                </Link>
                <p className="edit-card__line">{edit.line}</p>
                <p className="meta">
                  {inEdit.length} {inEdit.length === 1 ? 'style' : 'styles'}
                </p>
              </article>
            </li>
          )
        })}
      </ul>

      {categories.length > 0 ? (
        <div className="west-taxonomy">
          <Sub className="west-taxonomy__title">Or shop the line by category</Sub>
          <ul className="west-taxonomy__list">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`} className="west-taxonomy__link">
                  {category.media ? (
                    <span className="west-taxonomy__media">
                      <EditorialMedia
                        media={category.media}
                        sizes="(min-width: 62rem) 25vw, 33vw"
                      />
                    </span>
                  ) : null}
                  <span className="west-taxonomy__name">{category.label}</span>
                  <span className="meta">{category.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
