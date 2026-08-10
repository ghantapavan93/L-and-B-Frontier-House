/**
 * THE HOUSE MARQUEE — one line of type, running the width of the world.
 *
 * A film strip of display type between the collection grid and the campaign story: the
 * house saying what it is at a scale nothing else on the page reaches.
 *
 * Three things make it editorial rather than a gimmick, and all three are load-bearing:
 *
 * 1. THE PHRASE IS OURS AND CLAIMS NOTHING. "Built for the long ride west" is campaign
 *    language about a register, not a fact about manufacture, origin or materials — the
 *    one kind of line that may ship without a source (§12 permits clearly-labelled
 *    campaign voice; it forbids evidentiary claims).
 * 2. IT IS ONE ELEMENT, ANNOUNCED ONCE. The track repeats the phrase for the eye, so the
 *    duplicates are `aria-hidden` and the strip carries a single accessible reading. A
 *    screen reader hears the sentence, not four of it.
 * 3. IT STOPS. Under `prefers-reduced-motion` the animation is removed entirely and the
 *    phrase sits still, centred and complete — no scroll, no drift, nothing to chase.
 *    The animation is transform-only and never touches layout.
 */
const PHRASE = 'Built for the long ride west'
/** Four passes fill the widest viewport before the loop seam; the CSS translates by half. */
const REPEATS = 4

export function HouseMarquee() {
  return (
    <section className="marquee" aria-label={PHRASE}>
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
