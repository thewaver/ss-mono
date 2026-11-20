# Decisions: `Lens`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Lens`: Reveal's window the other way round

**`Reveal` cuts a hole in a cover; `Lens` shows a magnified copy only inside the hole.** So it sits beside `Reveal` and `ScratchCard` in `Exotics/Reveals`. Everything about where the window is, when it is open, what shape it has and how the keyboard moves it is `Reveal`'s, reused rather than repeated: the view calls `RevealUtils` for the pointer point, the keyboard point, the nudges and the window's image. `LensUtils` holds only the two things a lens adds, the layer's mask and the copy's scale. `radius`, `joinRadii`, `lameExponents`, `softness`, `computePoints`, `stepSize`, `isDisabled` and `pointSource` mean exactly what they mean on `Reveal`, so a consumer moving between the two meets one vocabulary.

**`renderContent` is called twice, and only the first is real.** The second is drawn inside a layer carrying `aria-hidden="true"` and `inert`, with pointer events off, so a screen reader meets the content once, Tab never lands in the copy, and a click always reaches the real thing underneath. It is `Wraparound`'s arrangement for its copies, with the same consequence written on the prop: anything with a state of its own runs separately in the copy.

**The mask and the scale are on two different elements, and that is the whole trick.** The outer layer covers the element and carries the mask, the lens's image placed once, so only the inside of the window paints. The copy inside it carries `scale(zoom)` with its `transform-origin` at the lens's center; scaling about a point leaves that point where it is, so whatever sits under the middle of the lens sits there in the copy too. With both on one element the mask would scale along with the content and the window would grow with the zoom. Magic UI's `Lens` splits them the same way.

**The mask is one layer, not `Cutout`'s.** `CutoutUtils.getMaskStyle` composes a full layer minus holes, which is a cover; a lens wants the window alone, one image at one position, small enough that it did not earn a second mode on the abstract.

**With no lens, the layer is hidden rather than taken out**, so moving the pointer in and out does not rebuild the copy or decode a picture in it again each time. The lens shows whenever the pointer is anywhere on the page, as `Reveal`'s hole does, so it slides in from the edge.

**Softness defaults to a hard edge**, where `Reveal`'s is soft, because a lens reads as glass only if its rim is sharp. Zoom is not clamped: 1 magnifies nothing and below 1 shrinks the copy. A radius of 0 shows no lens.

**The keyboard is `Reveal`'s, for the same reason.** WCAG 2.1.1 applies as it does there: what the lens shows depends on where the pointer is, so a keyboard user needs their own way to move it. One Tab stop, `role="group"` and a required `ariaLabel`; the lens opens at the center on `:focus-visible`, the arrows move it by `stepSize` inside the element, and blur closes it.
