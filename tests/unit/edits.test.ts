import { describe, expect, it } from 'vitest'
import { EDITS, findEdit, populatedEdits, productsInEdit } from '@/domain/edits'
import { CATEGORIES } from '@/domain/taxonomy'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import { publicProducts } from '@/auth/authorize'

/**
 * An edit is a QUERY over the published catalogue, and these exist to keep it one.
 *
 * The failure mode is not a bug, it is a drift: someone adds a hand-picked slug list to get
 * a nicer-looking grid, and a merchandising view quietly becomes an editorial claim about
 * the clothes. Every assertion below is aimed at that.
 */

const PRODUCTS = publicProducts(PRODUCT_RECORDS)

describe('edits are queries over verified product', () => {
  it('surfaces only products that exist in the published catalogue', () => {
    const published = new Set(PRODUCTS.map((p) => p.id))

    for (const edit of EDITS) {
      for (const product of productsInEdit(edit, PRODUCTS)) {
        expect(published.has(product.id), `${edit.slug} surfaced an unpublished id`).toBe(true)
      }
    }
  })

  it('derives membership purely from published attributes', () => {
    // Every product's membership must be reproducible from the record alone. Running the
    // rule twice over a shuffled catalogue must not change who is in it.
    for (const edit of EDITS) {
      const straight = productsInEdit(edit, PRODUCTS)
        .map((p) => p.id)
        .sort()
      const shuffled = productsInEdit(edit, [...PRODUCTS].reverse())
        .map((p) => p.id)
        .sort()
      expect(shuffled, `${edit.slug} is order-dependent`).toEqual(straight)
    }
  })

  it('never collides with a category slug', () => {
    // An edit that shares a slug with a category is a taxonomy change wearing a costume,
    // and taxonomy is the one hard gate on Phase 1 (D-04).
    const categorySlugs = new Set(CATEGORIES.map((c) => c.slug))
    for (const edit of EDITS) {
      expect(categorySlugs.has(edit.slug), `${edit.slug} collides with a category`).toBe(false)
    }
  })

  it('gives every edit a rule a buyer can read', () => {
    for (const edit of EDITS) {
      expect(edit.rule.length, `${edit.slug} has no stated rule`).toBeGreaterThan(20)
      expect(edit.name.length).toBeGreaterThan(0)
      expect(edit.blurb.length).toBeGreaterThan(0)
    }
  })

  it('has unique slugs and resolves each one', () => {
    const slugs = EDITS.map((e) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(findEdit(slug)?.slug).toBe(slug)
  })

  it('resolves an unknown slug to undefined so the route can 404', () => {
    expect(findEdit('mens')).toBeUndefined()
    expect(findEdit('')).toBeUndefined()
  })
})

describe('edits claim nothing the catalogue does not say', () => {
  it('adds no product fact — every surfaced record is untouched', () => {
    for (const edit of EDITS) {
      for (const product of productsInEdit(edit, PRODUCTS)) {
        const original = PRODUCTS.find((p) => p.id === product.id)
        expect(product, `${edit.slug} altered a product record`).toBe(original)
      }
    }
  })

  it('names no material, origin or manufacturing claim', () => {
    // "Made in Texas" is not evidenced (OQ-04) and named mills contradict verified vertical
    // integration. An edit's prose is campaign language and must stay clear of both.
    const forbidden = [
      /made in/i,
      /mill\b/i,
      /tannery/i,
      /tanneries/i,
      /hand-?made/i,
      /artisan/i,
    ]

    for (const edit of EDITS) {
      const prose = `${edit.name} ${edit.line} ${edit.blurb} ${edit.rule}`
      for (const pattern of forbidden) {
        expect(pattern.test(prose), `${edit.slug} makes a sourcing claim: ${pattern}`).toBe(
          false,
        )
      }
    }
  })

  it('states no price anywhere in its prose', () => {
    for (const edit of EDITS) {
      const prose = `${edit.name} ${edit.line} ${edit.blurb} ${edit.rule}`
      expect(/\$\s?\d/.test(prose), `${edit.slug} names a price`).toBe(false)
    }
  })

  it('hides an edit that would lead nowhere', () => {
    expect(populatedEdits([])).toHaveLength(0)
    expect(populatedEdits(PRODUCTS).length).toBeGreaterThan(0)
  })
})

describe('the edits actually partition something useful', () => {
  it('each shipped edit carries at least one style', () => {
    for (const edit of populatedEdits(PRODUCTS)) {
      expect(productsInEdit(edit, PRODUCTS).length, `${edit.slug} is empty`).toBeGreaterThan(0)
    }
  })

  it('together they reach most of the catalogue without being one big bucket', () => {
    const reached = new Set(EDITS.flatMap((e) => productsInEdit(e, PRODUCTS)).map((p) => p.id))

    // Broad enough to be a real way in …
    expect(reached.size).toBeGreaterThan(PRODUCTS.length / 2)
    // … and no single edit is simply the whole catalogue relabelled.
    for (const edit of EDITS) {
      expect(
        productsInEdit(edit, PRODUCTS).length,
        `${edit.slug} is the entire catalogue under another name`,
      ).toBeLessThan(PRODUCTS.length)
    }
  })
})
