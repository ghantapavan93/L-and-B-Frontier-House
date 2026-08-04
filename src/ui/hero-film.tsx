/**
 * THE HERO FILM — a full-bleed background film, not a player.
 *
 * Ten seconds: the approved buckle ignition (4.00 s) cut straight into the fibre-field
 * continuation (6.00 s). It ends where it was authored to end — deep negative space sized
 * for the copy that sits over it — which is why it does NOT loop. Looping would drag the
 * frame back to the buckle every ten seconds and fight the headline for the rest of the
 * visit.
 *
 * Four decisions here are load-bearing, and three of them are accessibility rather than
 * art direction.
 *
 * 1. NO `autoplay` ATTRIBUTE IN THE SERVER HTML. Autoplay cannot be gated on
 *    `prefers-reduced-motion` from the server, and no amount of CSS stops a video carrying
 *    the attribute. So the markup ships inert and an inline script starts playback only
 *    when motion is welcome. With JavaScript off, nothing moves, the poster carries the
 *    whole message, and no pause obligation is incurred at all.
 *
 * 2. A VISIBLE PAUSE CONTROL, REVEALED BY THAT SAME SCRIPT. WCAG 2.2.2 is Level A and
 *    binds any motion that starts automatically, runs over five seconds and sits alongside
 *    other content. Ten seconds under a headline is squarely inside it. The control is
 *    revealed rather than server-rendered because a button that cannot act on anything is
 *    worse than no button: without JavaScript there is no motion for it to stop.
 *
 * 3. NO `controls`. Native player chrome is what makes a film read as an embedded video
 *    rather than as the page's own surface, and it is the thing this section is explicitly
 *    not meant to be. The pause control replaces it — one affordance, the only one owed.
 *
 * 4. THE POSTER IS A REAL, ART-DIRECTED IMAGE RATHER THAN THE `poster` ATTRIBUTE. `poster`
 *    takes a single URL, so a 16:9 frame would be centre-cropped on a 9:16 phone — which
 *    this project has already ruled is not an art direction. A `<picture>` behind the video
 *    lets each aspect have its own frame, and it survives a failed codec, a blocked
 *    request, and iOS Low Power Mode, where autoplay is refused and a centred play glyph is
 *    drawn over the frame by the system and cannot be removed by CSS.
 */

export type HeroFilmSources = {
  readonly desktopWebm: string
  readonly desktopMp4: string
  readonly mobileWebm: string
  readonly mobileMp4: string
  readonly posterDesktop: string
  readonly posterMobile: string
  /** Describes the artifact. Never a date, never a slogan, never a price. */
  readonly alt: string
  readonly captionsSrc: string
  readonly transcriptHref: string
}

/**
 * Playback control, inlined.
 *
 * Inline rather than bundled so it costs no request and no hydration — the cinematic layer
 * is budgeted at zero client JavaScript and this is the one deliberate exception, taken
 * because correct autoplay is impossible without it.
 *
 * `play()` returns a promise that rejects when a browser refuses autoplay (Low Power Mode,
 * a data saver, a user setting). That rejection is caught and ignored on purpose: the
 * refusal is a correct outcome, the poster is already showing, and the control is already
 * on screen for anyone who wants to start it themselves.
 */
const CONTROLLER = `(function(){
var v=document.querySelector('[data-hero-film]'),b=document.querySelector('[data-hero-toggle]');
if(!v||!b)return;
function sync(){var p=v.paused||v.ended;b.textContent=p?'Play the film':'Pause the film';b.setAttribute('aria-pressed',p?'false':'true')}
b.addEventListener('click',function(){if(v.paused||v.ended){v.play().catch(function(){})}else{v.pause()}});
v.addEventListener('play',sync);v.addEventListener('pause',sync);v.addEventListener('ended',sync);
b.hidden=false;sync();
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){v.play().catch(function(){})}
})();`

export function HeroFilm({ film }: { film: HeroFilmSources }) {
  return (
    <div className="hero-film">
      {/*
        The floor. Art-directed per aspect, real alt text, and complete on its own — if
        every byte of video below fails to arrive, this is still the section's image.
      */}
      <picture className="hero-film__poster">
        {/* Orientation, matching the video's own source selection below — otherwise a
            narrow landscape window gets a portrait still and a landscape film. */}
        <source media="(orientation: portrait)" srcSet={film.posterMobile} />
        <img
          src={film.posterDesktop}
          alt={film.alt}
          width={1920}
          height={1080}
          fetchPriority="high"
        />
      </picture>

      {/*
        `aria-hidden` because the poster above already carries this description to assistive
        technology, and announcing the same artifact twice is noise. The film's content is
        reachable as text through the transcript.
      */}
      <video
        className="hero-film__video"
        data-hero-film=""
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        {/*
          Selected on ORIENTATION, not width. The two renders are separate camera
          compositions — 16:9 and 9:16 — and a narrow desktop window is still landscape, so
          a width breakpoint hands it the 9:16 file and `object-fit: cover` then crops the
          buckle to a corner. Orientation is the property that actually decides which
          framing fits.
        */}
        {/*
          MP4 before WebM, which is the reverse of the usual advice and is measured, not
          assumed: at this resolution and quality target H.264 lands smaller than VP9 here
          (1.07 MB against 1.22 MB desktop). H.264 also decodes in hardware on effectively
          every device, which matters more than usual for a film that starts by itself —
          a software-decoded background loop is a battery cost the visitor did not ask for.
        */}
        <source media="(orientation: portrait)" src={film.mobileMp4} type="video/mp4" />
        <source media="(orientation: portrait)" src={film.mobileWebm} type="video/webm" />
        <source src={film.desktopMp4} type="video/mp4" />
        <source src={film.desktopWebm} type="video/webm" />
        {/*
          No `default`. The cues ship so a viewer can turn them on, but a background film
          has no audio to caption and its content is already carried as text by the poster's
          alt and the transcript below — burning eight cue cards over the headline would be
          decoration masquerading as access.
        */}
        <track kind="captions" src={film.captionsSrc} label="Visual description" />
      </video>

      <div className="hero-film__controls">
        {/*
          Hidden until the script can make it work. See decision 2 above.

          `suppressHydrationWarning` because the controller runs during parse, before React
          hydrates, and deliberately leaves this button in a different state than the server
          sent — revealed, labelled for whatever playback actually did. That is the intended
          behaviour, not a bug to reconcile: React leaves the mutated DOM alone and never
          re-renders this subtree. Without the flag every visit logs a hydration mismatch.
        */}
        <button
          type="button"
          className="hero-film__toggle"
          data-hero-toggle=""
          hidden
          suppressHydrationWarning
        >
          Pause the film
        </button>
        <a className="hero-film__transcript" href={film.transcriptHref}>
          Read the film transcript
        </a>
      </div>

      <script dangerouslySetInnerHTML={{ __html: CONTROLLER }} />
    </div>
  )
}
