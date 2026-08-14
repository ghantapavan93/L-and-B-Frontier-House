/**
 * THE HOUSE MARQUEE — one line of type, running the width of the world.
 *
 * A film strip of display type between the collection grid and the campaign story: the
 * house saying what it is at a scale nothing else on the page reaches.
 *
 * Four things make it editorial rather than a gimmick, and all four are load-bearing:
 *
 * 1. THE PHRASE IS OURS AND CLAIMS NOTHING. "Built for the long ride west" is campaign
 *    language about a register, not a fact about manufacture, origin or materials — the
 *    one kind of line that may ship without a source (§12 permits clearly-labelled
 *    campaign voice; it forbids evidentiary claims).
 * 2. IT IS ONE ELEMENT, ANNOUNCED ONCE. The track repeats the phrase for the eye, so the
 *    duplicates are `aria-hidden` and the strip carries a single accessible reading. A
 *    screen reader hears the sentence, not four of it.
 * 3. IT STOPS BY PREFERENCE. Under `prefers-reduced-motion` the animation is removed
 *    entirely and the phrase sits still, centred and complete.
 * 4. IT STOPS BY REQUEST — and this was missing until the reference audit found it. The
 *    track runs 42s linear infinite, and WCAG 2.2.2 (Level A) binds ANY motion over five
 *    seconds that runs alongside other content, INDEPENDENTLY of whether the visitor has
 *    asked for reduced motion. The hero film and the campaign film both carried a control;
 *    this surface did not.
 *
 *    The control is a checkbox, not a button: the checked state IS the paused state, so
 *    the whole mechanism is CSS with zero JavaScript, works with scripting disabled, and
 *    is keyboard-operable for free. Both glyphs ship in the DOM and CSS reveals the one
 *    describing the NEXT action; the label text swaps with them for screen readers.
 */
const PHRASE = 'Built for the long ride west'
/** Four passes fill the widest viewport before the loop seam; the CSS translates by half. */
const REPEATS = 4

export function HouseMarquee() {
  return (
    <section className="marquee" aria-label={PHRASE}>
      {/*
        Order matters: the checkbox must PRECEDE both the toggle and the track so
        `:checked +` reaches the label and `:checked ~` reaches the track.
      */}
      <input
        type="checkbox"
        id="marquee-pause"
        className="marquee__state"
        // eslint-disable-next-line jsx-a11y/aria-role
        aria-label="Pause the marquee"
      />
      <label className="marquee__toggle" htmlFor="marquee-pause">
        <svg
          className="marquee__glyph marquee__glyph--pause"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="2" y="1" width="3.5" height="12" fill="currentColor" />
          <rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" />
        </svg>
        <svg
          className="marquee__glyph marquee__glyph--play"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3 1l9 6-9 6z" fill="currentColor" />
        </svg>
      </label>

      <div className="marquee__track">
        {Array.from({ length: REPEATS * 2 }, (_, index) => (
          <span className="marquee__phrase" key={index} aria-hidden="true">
            {PHRASE}
            <span className="marquee__mark">&mdash;</span>
          </span>
        ))}
      </div>
    </section>
  )
}
