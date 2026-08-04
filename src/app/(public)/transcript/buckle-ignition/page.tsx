import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * TRANSCRIPT — the ignition film, in text.
 *
 * The edit contract makes this a prerequisite for shipping any video: a silent film
 * is not exempt, because "there is no speech" is itself information a screen-reader
 * user has no way to confirm without being told. It is also the SEO surface for a
 * film search engines cannot watch, and the one description that survives with
 * JavaScript disabled, video blocked, or the codec unsupported.
 *
 * Every line describes the artifact only. No date, no slogan, no product claim.
 */
export const metadata: Metadata = {
  title: 'Ignition film transcript',
  description:
    'A text description of the ten-second Lucky & Blessed ignition film, beat by beat.',
}

const BEATS = [
  {
    time: '0.00 – 1.30',
    text: 'A scalloped rectangular belt buckle rests in near darkness on indigo denim. Only its rope-twist rim catches any light.',
  },
  {
    time: '1.30 – 1.90',
    text: 'A warm light rises from the left, raking across darkened brushed silver, oxidised copper, hand-tooled leather and four small turquoise stones.',
  },
  {
    time: '1.90 – 3.10',
    text: 'The engraved monogram — the initials L and B — draws on from left to right, lit from within in turquoise.',
  },
  {
    time: '3.10 – 4.00',
    text: 'The buckle parts along its centre seam. The leather panel sinks back into shadow and a single turquoise thread leaves the frame at the bottom.',
  },
  /*
    The join. A straight cut, not a dissolve — the thread is the one element continuous
    across it, and softening the cut would soften the only thing holding the two halves
    together.
  */
  {
    time: '4.00 – 5.40',
    text: 'A hard cut. The camera follows the thread downward through near-darkness, falling with it.',
  },
  {
    time: '5.40 – 7.50',
    text: 'It passes between loose indigo strands suspended in open space, lit by a warm rake from one side and a cool rim from the other. The strands are individual fibres with air between them — no cloth, no seam, no garment.',
  },
  {
    time: '7.50 – 9.20',
    text: 'The field of strands separates and draws apart, opening the frame.',
  },
  {
    time: '9.20 – 10.00',
    text: 'The thread settles low and slightly left of centre against deep black negative space, where the page’s own words begin.',
  },
]

export default function IgnitionTranscript() {
  return (
    <div className="container section">
      <p className="eyebrow">Transcript</p>
      <h1>The ignition film</h1>
      <p className="lede">
        A ten-second silent film. It has no speech and no audio track; the description below
        covers everything it shows.
      </p>

      <dl className="definition-list definition-list--split">
        {BEATS.map((beat) => (
          <div key={beat.time}>
            <dt>{beat.time} seconds</dt>
            <dd>{beat.text}</dd>
          </div>
        ))}
      </dl>

      <p style={{ marginTop: 'var(--space-7)' }}>
        <Link href="/" className="button button--secondary">
          Back to the homepage
        </Link>
      </p>
    </div>
  )
}
