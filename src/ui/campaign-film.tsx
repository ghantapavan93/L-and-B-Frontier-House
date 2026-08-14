import { PLATE_CAMPAIGN_BACKDROP, PLATE_MARKER } from '@/content/media/frontier-plates'

/**
 * THE CAMPAIGN STAGE — the house's own film, staged.
 *
 * NOTE ON THE NAME: this section shipped as "Fall Collection 2026". That season name was
 * ours, not the owner's — their file arrived as `video_6a36d58ece9146.64769701.mp4`, and
 * nothing in the corpus establishes that L&B names seasons at all. Invented brand
 * vocabulary is exactly what §12 forbids, so the name is gone. The runtime stays: the file
 * measures 18.0s at 1350×1200.
 *
 * The owner asked for the reference "scroll-expansion" treatment: a cinematic backdrop
 * that recedes while the film grows and starts on its own. The reference does it by
 * intercepting the wheel and shipping an unconditional `autoPlay loop`. This is the same
 * experience on the house's legal machinery, all of it precedented by the hero film:
 *
 *   - The BACKDROP is a generated campaign plate behind the section, fading back as the
 *     film expands — both driven by `animation-timeline: view()`, which reads native
 *     scroll and never touches the wheel. No support → full-size film over a still
 *     backdrop, which is the complete composition.
 *   - PLAYBACK starts when the film is properly in view — via the same pattern as the
 *     hero: NO autoplay attribute in the server HTML (it cannot be gated on
 *     `prefers-reduced-motion` from the server), an inline script that plays only when
 *     motion is welcome, and a visible pause control revealed by that script (WCAG 2.2.2).
 *     An IntersectionObserver starts it at half-visible and pauses it off-screen; a
 *     reader's explicit pause is remembered and never overridden.
 *   - WITH JAVASCRIPT OFF or reduced motion preferred, the markup is exactly the old
 *     section: poster, native controls, click-to-play, `preload="none"`.
 *   - iOS Low Power Mode refuses `play()`: the rejection is caught, native controls are
 *     restored, and the poster carries the frame.
 *
 * The film ends on its authored longhorn endcard, so it does NOT loop: looping would
 * yank the frame back mid-thought every eighteen seconds. `ended` relabels the control
 * to "Play the film" for a replay.
 */

const CONTROLLER = `(function(){
var v=document.querySelector('[data-campaign-film]'),b=document.querySelector('[data-campaign-toggle]');
if(!v||!b)return;
var userPaused=false;
function sync(){var p=v.paused||v.ended;b.textContent=p?'Play the film':'Pause the film';b.setAttribute('aria-pressed',p?'false':'true')}
b.addEventListener('click',function(){if(v.paused||v.ended){userPaused=false;v.play().catch(function(){v.controls=true})}else{userPaused=true;v.pause()}});
v.addEventListener('play',sync);v.addEventListener('pause',sync);v.addEventListener('ended',sync);
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){b.hidden=false;sync();return}
v.controls=false;b.hidden=false;sync();
var near=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){v.preload='auto';near.disconnect()}})},{rootMargin:'150% 0px'});
near.observe(v);
var io=new IntersectionObserver(function(es){es.forEach(function(e){
if(e.intersectionRatio>=0.5){if(!userPaused&&!v.ended){v.play().catch(function(){v.controls=true})}}
else if(!v.paused){v.pause()}
})},{threshold:[0,0.5]});
io.observe(v);
})();`

export function CampaignFilm() {
  const backdrop = PLATE_CAMPAIGN_BACKDROP
  return (
    <section className="campaign-stage" aria-labelledby="campaign-film-heading">
      {/* The stage. The wrapper is aria-hidden (the section is about the film, and the
          plate's provenance is carried by the visible marker chip), but the image still
          carries its real alt — the media-integrity gate is right that an empty alt is a
          description nobody can check. */}
      <div className="campaign-stage__backdrop" aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet={backdrop.asset.avifSrcSet} sizes="100vw" />
          <source type="image/webp" srcSet={backdrop.asset.webpSrcSet} sizes="100vw" />
          <img
            src={backdrop.asset.poster}
            alt={backdrop.alt}
            width={backdrop.asset.intrinsicWidth}
            height={backdrop.asset.intrinsicHeight}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <p className="plate-note">{PLATE_MARKER}</p>

      <div className="container campaign-stage__inner">
        <div className="section-head">
          <div>
            <p className="eyebrow">The campaign</p>
            <h2 id="campaign-film-heading">The house, on film</h2>
            {/* The old line promised "plays on your click, never by itself" — no longer
                true, so it does not ship. The new line says exactly what happens. */}
            <p className="meta">
              Eighteen seconds of the line, from the house&rsquo;s own drop. Starts as it enters
              your screen and stops the moment you say so; with reduced motion set, it waits for
              your click.
            </p>
          </div>
        </div>

        <figure className="house-film house-film--expand">
          <video
            data-campaign-film=""
            controls
            muted
            playsInline
            preload="none"
            poster="/media/campaign/fall-2026-poster.webp"
            width={1350}
            height={1200}
          >
            <source src="/media/campaign/fall-2026-film.mp4" type="video/mp4" />
            Your browser cannot play this film — it shows garments from the line worn on models.
          </video>
          <div className="campaign-stage__controls">
            {/* Hidden until the script can make it act; suppressHydrationWarning because
                the controller reveals and relabels it during parse, before hydration —
                the same deliberate mismatch the hero film documents. */}
            <button
              type="button"
              className="campaign-stage__toggle"
              data-campaign-toggle=""
              hidden
              suppressHydrationWarning
            >
              Pause the film
            </button>
          </div>
          <figcaption className="meta">
            The house&rsquo;s own campaign film — eighteen seconds, owner-supplied
          </figcaption>
        </figure>
      </div>

      <script dangerouslySetInnerHTML={{ __html: CONTROLLER }} />
    </section>
  )
}
