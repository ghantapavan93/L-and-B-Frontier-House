import { setExperienceAction } from '@/features/experience/actions'
import { EXPERIENCE_LABELS, EXPERIENCE_STATES } from '@/features/experience/mode'
import type { ExperienceState } from '@/features/experience/mode'

/**
 * The segmented control the Design DNA specifies: Cinema | Balanced | Instant Shop.
 *
 * Always visible, never a modal-on-load, and the choice persists. It is a form of real
 * `<button>` elements, so it is keyboard operable and works without JavaScript.
 *
 * `aria-pressed` rather than a radio group: these are actions that change presentation
 * immediately, and each button states whether its state is the active one.
 */
export function ExperienceSelector({
  current,
  returnTo,
}: {
  current: ExperienceState
  returnTo: string
}) {
  return (
    <div className="experience-selector">
      <span className="experience-selector__label" id="experience-label">
        View
      </span>
      <form action={setExperienceAction} aria-labelledby="experience-label">
        <input type="hidden" name="returnTo" value={returnTo} />
        {EXPERIENCE_STATES.map((state) => (
          <button
            key={state}
            type="submit"
            name="state"
            value={state}
            aria-pressed={state === current}
          >
            {EXPERIENCE_LABELS[state]}
          </button>
        ))}
      </form>
    </div>
  )
}
