/**
 * MEDIA SLOT — a reserved, honest, empty container for photography that does not exist yet.
 *
 * The owner's direction is explicit: build the containers now, at final dimensions, and the
 * images get pasted in later. That is exactly the right order of work — layout, rhythm and
 * motion can all be finished against reserved boxes, and the day a photograph arrives it
 * drops into a slot that already has its aspect ratio, its `sizes` logic and its position
 * in the composition.
 *
 * Two rules keep this honest rather than fake:
 *
 *   1. A slot NAMES ITSELF. It says what it is waiting for ("Garment in motion · film slot")
 *      rather than pretending with a grey shimmer that something is loading. A loading
 *      skeleton is a lie here — nothing is loading, the photograph has not been taken.
 *
 *   2. A slot is `aria-hidden`. It carries no information a screen-reader user needs; the
 *      surrounding section's copy carries the message. When real media replaces the slot it
 *      arrives with real alt text.
 *
 * This is the same pattern as the existing `hero__pending` and `fixture-placeholder`
 * conventions, generalised so every new surface stops inventing its own.
 */

export type MediaSlotProps = {
  /** What belongs here, shown inside the slot. e.g. "Campaign photograph". */
  readonly label: string
  /** CSS aspect ratio, e.g. "2 / 3". Reserves the box; prevents CLS on fill day. */
  readonly aspectRatio: string
  /** `video` slots get a small film marker so the owner knows which slots want motion. */
  readonly kind?: 'image' | 'video'
  readonly className?: string
}

export function MediaSlot({ label, aspectRatio, kind = 'image', className }: MediaSlotProps) {
  return (
    <div
      className={className ? `media-slot ${className}` : 'media-slot'}
      style={{ aspectRatio }}
      aria-hidden="true"
      data-media-slot={kind}
    >
      <span className="media-slot__mark">{kind === 'video' ? '▸' : '◻'}</span>
      <span className="media-slot__label">{label}</span>
    </div>
  )
}
