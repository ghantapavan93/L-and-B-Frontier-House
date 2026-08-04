import Link from 'next/link'
import { HeroFilm, type HeroFilmSources } from './hero-film'

/**
 * The ignition film's media, declared here rather than fetched.
 *
 * Provenance is `owner-supplied` throughout: the buckle and the fibre field are both
 * objects we designed and rendered ourselves, so there is no third party to license and
 * nothing generative to disclose. The description covers the artifact — never a date, never
 * a slogan, never a price, and never a garment. The passage is deliberately abstract fibre:
 * a rendered garment would be a product claim about clothes that were never photographed.
 */
const IGNITION_FILM: HeroFilmSources = {
  desktopWebm: '/media/hero/lb-hero-ignition-desktop.webm',
  desktopMp4: '/media/hero/lb-hero-ignition-desktop.mp4',
  mobileWebm: '/media/hero/lb-hero-ignition-mobile.webm',
  mobileMp4: '/media/hero/lb-hero-ignition-mobile.mp4',
  posterDesktop: '/media/hero/lb-hero-poster-desktop.webp',
  posterMobile: '/media/hero/lb-hero-poster-mobile.webp',
  alt: 'A scalloped rectangular western belt buckle in darkened silver, oxidised copper and tooled leather, its engraved L and B monogram lit from within in turquoise, resting on indigo denim',
  captionsSrc: '/media/hero/lb-hero-ignition.vtt',
  transcriptHref: '/transcript/buckle-ignition',
}

/**
 * FRONTIER IGNITION — the cinematic entry.
 *
 * ONE film, full-bleed behind the section, running ten seconds: the buckle ignition cut
 * straight into the thread passage. It previously carried two renderings of the same
 * artifact — an inline SVG buckle and a video whose poster was another buckle — which read
 * as a duplicate rather than as a fallback. The film and its poster now carry it alone.
 *
 * What was lost with the SVG is worth naming: it was zero bytes and rendered with no
 * network at all. The poster replaces it as the floor, which costs a request but is a
 * photograph of the real rendered object rather than a redrawing of it, and it is the frame
 * the film itself opens on — so the still and the motion are finally the same artifact.
 *
 * The engraving reads L&B — the brand's initials. It does not read "L&B Frontier House"
 * anywhere customer-facing (D-10), and it carries no date (the corpus's "EST. 1865" is a
 * fabrication and stays dead).
 *
 * Motion rules live in `hero-film.tsx`: no autoplay attribute, playback started only when
 * reduced motion is not requested, a visible pause control because ten seconds of automatic
 * motion beside a headline is squarely inside WCAG 2.2.2, and no player chrome.
 */
export function FrontierIgnition() {
  return (
    <section className="ignition" aria-label="Introduction">
      <HeroFilm film={IGNITION_FILM} />

      <div className="ignition__grain" aria-hidden="true" />

      {/* Ghost statement — display texture, not a heading; the page's h1 lives below. */}
      <p className="ignition__ghost" aria-hidden="true">
        Not the west
        <br />
        you remember
      </p>

      <div className="ignition__content">
        <p className="ignition__stage">01 · Ignition</p>

        <div className="ignition__actions">
          <a className="button button--secondary" href="#hero">
            Enter the frontier
          </a>
          <a className="button button--quiet ignition__skip" href="#sheet">
            Skip to shop
          </a>
          <Link className="text-link" href="/wholesale">
            Wholesale access
          </Link>
        </div>
      </div>
    </section>
  )
}
