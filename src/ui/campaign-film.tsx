/**
 * THE CAMPAIGN FILM — Lucky & Blessed's own Fall Collection 2026 spot.
 *
 * Owner-supplied footage (dropped with the approved photography): real models, real
 * garments, the brand's own longhorn endcard. Click-to-play on native controls with a
 * poster frame grabbed from the film itself — `preload="none"`, so its 7 MB cost nothing
 * until asked for, and WCAG 2.2.2 never engages because nothing moves uninvited.
 */
export function CampaignFilm() {
  return (
    <section className="container section" aria-labelledby="campaign-film-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">The campaign</p>
          <h2 id="campaign-film-heading">Fall Collection 2026, on film</h2>
          <p className="meta">
            Eighteen seconds of the season, shot by the house. Plays on your click, never by
            itself.
          </p>
        </div>
      </div>
      <figure className="house-film">
        <video
          controls
          preload="none"
          playsInline
          poster="/media/campaign/fall-2026-poster.webp"
          width={1350}
          height={1200}
        >
          <source src="/media/campaign/fall-2026-film.mp4" type="video/mp4" />
          Your browser cannot play this film — it shows the Fall 2026 collection worn on models.
        </video>
        <figcaption className="meta">
          Fall Collection 2026 · the house&rsquo;s own campaign film
        </figcaption>
      </figure>
    </section>
  )
}
