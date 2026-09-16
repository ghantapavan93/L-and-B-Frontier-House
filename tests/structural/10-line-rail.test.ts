import { describe, expect, it } from 'vitest'
import { get } from '../helpers/http'

/**
 * THE SECOND SHOP RAIL — what makes it a second rail and not the first one twice.
 *
 * The reference carries two product rails on its homepage, and the second is a different
 * grouping with its own switch. Three properties make ours the same thing, and each is
 * the kind that erodes quietly: a product query drifts and the rails start overlapping; a
 * panel gets hidden behind a script "for the animation"; the radio group loses its name.
 */
describe('the line rail', () => {
  it('carries only garments the sheet does not', async () => {
    const { body } = await get('/')

    const sheet = body.slice(body.indexOf('class="contact-sheet'), body.indexOf('line-rail'))
    const rail = body.slice(body.indexOf('line-rail'), body.indexOf('ways-in'))
    expect(sheet.length, 'the sheet precedes the rail').toBeGreaterThan(0)
    expect(rail.length, 'the rail precedes the link garden').toBeGreaterThan(0)

    const slugs = (html: string) =>
      new Set([...html.matchAll(/href="\/product\/([a-z0-9-]+)"/g)].map((m) => m[1]))

    const overlap = [...slugs(rail)].filter((slug) => slugs(sheet).has(slug))
    expect(overlap, 'the rail repeats the sheet').toEqual([])
    expect(slugs(rail).size, 'the rail is empty').toBeGreaterThan(0)
  })

  it('renders every panel server-side, in full, behind no script', async () => {
    const { body } = await get('/')

    // One radio per panel, one panel per radio, and every one of them in the HTML.
    const radios = body.match(/name="line-rail"/g)?.length ?? 0
    const panels = body.match(/class="line-rail__panel"/g)?.length ?? 0
    expect(radios).toBeGreaterThan(1)
    expect(panels).toBe(radios)

    // The group has an accessible name and exactly one default selection.
    expect(body).toContain('Show the line by category')
    expect(body.match(/name="line-rail"[^>]*checked/g)?.length ?? 0).toBe(1)

    // Nothing in the band is a script's to reveal.
    const rail = body.slice(body.indexOf('line-rail'), body.indexOf('ways-in'))
    expect(rail).not.toMatch(/data-line-rail|line-rail__state[^>]*hidden/)
  })

  it('links each panel to the whole category it samples', async () => {
    const { body } = await get('/')
    const rail = body.slice(body.indexOf('line-rail'), body.indexOf('ways-in'))
    for (const category of ['mens-denim', 'women', 'girls', 'accessories']) {
      if (rail.includes(`id="line-${category}"`)) {
        expect(rail).toContain(`href="/shop/${category}"`)
      }
    }
  })
})
