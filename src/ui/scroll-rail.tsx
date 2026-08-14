import type { ReactNode } from 'react'

/**
 * SCROLL RAIL — arrows and a progress bar for the house's horizontal scrollers.
 *
 * The reference audit found five scrollers shipping with no affordance beyond a thin
 * native scrollbar: a mouse user without a trackpad had no way to move them at all, and
 * nobody had any signal of how much strip remained. The reference implementation is a
 * custom element that publishes one number over untouched server children — which is
 * exactly the island contract §9 already mandates, so this is that element, minus the
 * spring nobody needs:
 *
 *   - The child scroller is SERVER MARKUP, untouched. The rail only decorates it.
 *   - The element publishes `--scroll-progress` (0..1) on itself; the stylesheet spends
 *     it on a 2px bar. Zero by default: no JS → no bar, native scrollbar remains.
 *   - The arrows ship `hidden` and are revealed only when the element upgrades — a
 *     button that cannot act must not render (the hero film set this precedent).
 *   - Buttons scroll by 80% of the viewport of the strip, respecting
 *     `prefers-reduced-motion` by swapping smooth for auto.
 *   - Native scroll is read, never replaced. The wheel is never touched.
 *
 * One inline definition, deduped on a window flag, ~1.4 KB — not a Framer island,
 * because nothing here needs a spring.
 */

const DEFINITION = `(function(){
if(window.__lbScrollRail)return;window.__lbScrollRail=1;
customElements.define('scroll-rail',class extends HTMLElement{
connectedCallback(){
var host=this,sc=host.querySelector('[data-rail-scroller]');
var prev=host.querySelector('[data-rail-prev]'),next=host.querySelector('[data-rail-next]');
if(!sc||!prev||!next)return;
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
function metrics(){
var max=sc.scrollWidth-sc.clientWidth;
var p=max>0?sc.scrollLeft/max:0;
host.style.setProperty('--scroll-progress',String(Math.min(1,Math.max(0,p))));
prev.disabled=sc.scrollLeft<=1;
next.disabled=max-sc.scrollLeft<=1;
host.toggleAttribute('data-rail-active',max>1);
}
function go(dir){
sc.scrollBy({left:dir*sc.clientWidth*0.8,behavior:reduce.matches?'auto':'smooth'});
}
prev.addEventListener('click',function(){go(-1)});
next.addEventListener('click',function(){go(1)});
sc.addEventListener('scroll',metrics,{passive:true});
window.addEventListener('resize',metrics,{passive:true});
prev.hidden=false;next.hidden=false;metrics();
}});
})();`

function Arrow({ direction }: { direction: 'prev' | 'next' }) {
  const label = direction === 'prev' ? 'Scroll back' : 'Scroll forward'
  const path = direction === 'prev' ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5'
  return (
    <button
      type="button"
      className={`scroll-rail__arrow scroll-rail__arrow--${direction}`}
      {...{ [`data-rail-${direction}`]: '' }}
      hidden
      suppressHydrationWarning
      aria-label={label}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )
}

/**
 * Wrap a horizontal scroller. `children` must contain exactly one element carrying
 * `data-rail-scroller` — the element that actually scrolls.
 */
export function ScrollRail({ children }: { children: ReactNode }) {
  return (
    // @ts-expect-error -- custom element; the definition script upgrades it.
    <scroll-rail class="scroll-rail">
      {children}
      <div className="scroll-rail__controls">
        <Arrow direction="prev" />
        <Arrow direction="next" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: DEFINITION }} />
      {/* @ts-expect-error -- closing the custom element */}
    </scroll-rail>
  )
}
