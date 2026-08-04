import Link from 'next/link'
import type { Edit } from '@/domain/edits'
import type { PublicProduct } from '@/domain/product'
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
function pickCover(products: readonly PublicProduct[], claimed: Set<string>) {
  const withMedia = products.map(primaryMedia).filter((media) => media !== undefined)
  const fresh = withMedia.find((media) => !claimed.has(media.id))
  const chosen = fresh ?? withMedia[0]
  if (chosen) claimed.add(chosen.id)
  return chosen
}

export function ChooseYourWest({
  edits,
  products,
}: {
  edits: readonly Edit[]
  products: readonly PublicProduct[]
}) {
  if (edits.length === 0) return null

  const claimed = new Set<string>()

  return (
    <section className="container section" aria-labelledby="west-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Ways in</p>
          <h2 id="west-heading">Choose your west</h2>
          <p className="meta">
            Four ways the same line reads. Every edit is a filter over the published catalogue —
            the garments are the ones you will find under Women, Girls and Accessories.
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
                  <h3 className="edit-card__name">{edit.name}</h3>
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
    </section>
  )
}
