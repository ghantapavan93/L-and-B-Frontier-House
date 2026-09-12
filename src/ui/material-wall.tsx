import Link from 'next/link'
import { atmospherePlate, MATERIAL_PLATE } from '@/content/media/campaign-plates'
import { EditorialMedia } from './product-media'

/**
 * THE MATERIAL WALL — the making band, argued rather than asserted.
 *
 * This band used to be an editorial split: one plate on the left, one claim on the right.
 * The claim was "Legible at close range", and it was carried by a single photograph.
 *
 * The Burberry measurement is what condemned that shape. Their editorial bands run **eight
 * images in 799px**; ours ran **one image in 726px**
 * (docs/research/teardown-burberry-gstar-vero.md §1.2). That is the whole of the density
 * gap between a fashion house and a brochure, and it is not a type or spacing problem —
 * they simply put more photography on the screen. G-Star reaches the same place from the
 * other direction: their story chapters name articulated knees, curved seams and placed
 * panels rather than describing denim as "crafted" (§2.3). Neither reference asks you to
 * take its word for anything.
 *
 * So the band now shows the materials instead of describing them. A lead plate, then a row
 * of macros — weave, stitch, hardware, tooling — each captioned with what it actually is.
 * Six photographs where there was one, and the sentence underneath stops being a claim and
 * becomes a caption for evidence already on screen.
 *
 * ── What keeps this honest ─────────────────────────────────────────────────────────────
 *
 * Every plate here is `provenance: 'generated-campaign'` and is MATERIAL or HARDWARE only —
 * no garment, no person, no place that implies a manufacturing location (OQ-04 is
 * unevidenced and stays that way). The captions are the manifest's own alt text, so what
 * the reader is told a picture shows is the same string the audit record carries and the
 * same string a screen reader receives. The band-level provenance line is not decoration:
 * §12 forbids generated imagery being presented as real product, and a wall of convincing
 * macros is exactly where that would happen by accident.
 *
 * Zero JavaScript. Zero new dependencies. The lead plate is the only priority image; the
 * macro row is lazy by default.
 */

/**
 * The macros, chosen to cover the four things the house actually makes claims about:
 * cloth, seam, hardware and leatherwork. One of each — a row of four denim weaves would
 * look like density without being it.
 */
const MACROS = [
  { slug: 'denim-weave', label: 'Cloth' },
  { slug: 'selvedge-stitch', label: 'Seam' },
  { slug: 'engraved-buckle', label: 'Hardware' },
  { slug: 'embossed-leather', label: 'Leather' },
] as const

/**
 * A band's heading is an `h2` when it sits among other bands and an `h1` when the band IS
 * the page. The route decides; the markup stays otherwise identical.
 */
type HeadingLevel = 'h1' | 'h2'

export function MaterialWall({ heading: Heading = 'h2' }: { heading?: HeadingLevel } = {}) {
  return (
    <section className="container section material-wall" aria-labelledby="craft-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">The making</p>
          <Heading id="craft-heading">Legible at close range.</Heading>
          <p className="lede">
            Buck stitch, pearl snaps, a swirl worked into the leg. The detail is the argument,
            so we photograph close enough that you can see the thread.
          </p>
        </div>
        <Link href="/new-arrivals" className="text-link">
          See what just landed
        </Link>
      </div>

      <figure className="material-wall__lead depth-far">
        <EditorialMedia media={MATERIAL_PLATE} sizes="100vw" />
        <figcaption>{MATERIAL_PLATE.alt}</figcaption>
      </figure>

      <ul className="material-wall__grid">
        {MACROS.map(({ slug, label }) => {
          const media = atmospherePlate(slug)
          return (
            <li key={slug}>
              <figure className="material-wall__cell">
                <EditorialMedia media={media} sizes="(min-width: 62rem) 25vw, 50vw" />
                <figcaption>
                  <span className="material-wall__label">{label}</span>
                  <span className="material-wall__note">{media.alt}</span>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>

      {/*
        One provenance line for the whole band rather than five repetitions of the same
        sentence. It sits after the images, which is where a reader who has just looked at
        five convincing macros needs it.
      */}
      <p className="material-wall__provenance">
        Campaign imagery — generated for art direction while the house photography is
        commissioned. None of these frames is a product.
      </p>
    </section>
  )
}
