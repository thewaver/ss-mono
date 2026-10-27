---
paths:
    - "components/src/**"
    - "components-solid/src/**"
    - "components-react/src/**"
    - "components-vue/src/**"
    - "components-svelte/src/**"
    - "playground/src/**"
    - "playground-solid/src/**"
    - "playground-react/src/**"
    - "playground-vue/src/**"
    - "playground-svelte/src/**"
---

# Conventions: how a control is built

The architecture every interactive control shares — the wrapper, the leaf, the painter — and the rules that keep
them apart. The library-wide rules are in `conventions.md`.

### Controls: wrapper owns behavior, leaf owns the element

**The composition is an implementation detail.** `Button` _is_ `InteractionWrapper` wrapping a private
`ButtonElement`, and consumers write `<Button {...props} />`; making them write the `renderControl` wiring
themselves was tried and reverted. `InteractionWrapper` stays public for custom controls, the leaves stay private
(as `Surface` keeps `SurfaceSVG`/`SurfaceDiv`).

**What the wrapper hands a leaf is the wrapper's type.** `InteractionControlProps` (`id`, `flags`, `ref`) lives with
the wrapper; anything every wrapped element needs goes there, and only element-specific props (`ButtonCbs`) stay with
the leaf. A preset's props are derived — `Omit<InteractionWrapperProps, "renderControl"> & …` — so wrapper props reach
consumers as the wrapper grows. **The tooltip anchors on the leaf, not the wrapper**; anchoring on the wrapper div
would have forced four changes to `Tooltip`, which this design leaves untouched.

**Disabled is one mechanism for every control: `aria-disabled`, never the native attribute.** Native `disabled`
kills every event, so a tooltip explaining why a control is disabled becomes unreachable; and keeping both
mechanisms cannot look the same, because the browser paints natively disabled controls itself and no CSS reproduces
that. Costs accepted: activation is gated in code for every disabled control (`Button` returns early in `onClick`,
`Checkbox` calls `preventDefault` on click, both gate `onMouseEnter`/`onMouseLeave`), and disabled controls are no
longer excluded from form submission. What used to lean on the attribute:

- **Tab order**: `wrapElement` sets `tabIndex = !isDisabled || isReachable ? 0 : -1` on every wrapped element.
  `role`, `ariaDisabled` and `cursor` stay opt-in through `applyButtonSemantics`, since `role="button"` breaks an
  `<input>`.
- **Focus traps**: `isReachable` rejects `tabindex="-1"` first, which is the correct tab-order rule anyway.
- **Mouse focus**: `tabIndex = -1` still allows click focus, and a focused text field blinks a caret, so a disabled,
  unreachable control refuses `mousedown` with `preventDefault()`. Clicking its `<label>` can still focus it — the
  only catch-all, blurring on focus, costs a flicker and a jump to `<body>`, and nothing is drawn in that state.
- **Reachability stops at `wrapElement`**; a leaf never learns whether it is reachable.

**Reachable while disabled has two ways in:**
`reachable = isDisabled && ((isReachableWhenDisabled && tooltipDefs !== undefined) || isFocusableWhenDisabled)`.

- **Do not change behavior because an unrelated option happens to be set; require an explicit switch.** Deriving
  reachability from the tooltip's presence alone would change disabled semantics the moment someone adds hover text.
  `isReachableWhenDisabled` is the switch, and the tooltip check only restrains it, because a focusable disabled
  control with nothing to reveal is worse than one skipped. The check reads the value (`tooltipDefs` returning
  something), not whether the prop was passed, since a group forwarding records passes it for every option. The
  development warning for reachable-without-tooltip stays presence-based on purpose, so a group forwarding both
  fields legitimately stays quiet. In Solid the tooltip renders under a non-keyed `<Show>`, so a record rebuilt under
  `<Index>` does not remount a visible tooltip.
- **`isFocusableWhenDisabled`** is for an item inside a roving composite (`TileBoard`'s refused tiles): a walk that
  skips disabled items hides the set's shape from a screen-reader user, and a composite whose current item is
  disabled would otherwise have no tab stop at all. It needs no tooltip guard, since a roving item is `tabindex="-1"`
  unless current. Set it only on such an item, gated on the composite itself being enabled.
- **A disabled control that is not reachable shows no tooltip, by pointer or by keyboard** — the user's call, so
  there is no gap between the two (WCAG 2.1.1: "All functionality of the content is operable through a keyboard
  interface"; a reason for the disabling that only a hovering pointer can read is the gap). While `isDisabled` and
  not reachable, `InteractionWrapper` offers no tooltip props, and the tooltip's own listeners then have no anchor.
  The opt-in that brings the tooltip back is the same one that brings the keyboard back: `isReachableWhenDisabled`.
- **A control reachable while disabled keeps its focus ring.**

**Disabled and reachable looks exactly like disabled.** A control that looks actionable and does nothing is worse
than one that reads as unavailable, and approximating the browser's disabled paint is not a way to reach "equal" —
the mechanisms had to converge, which is why there is one. **Nothing that fades or filters may touch the element
that owns the focus ring**: `filter` and `opacity` paint the outline too, and redrawing the ring elsewhere would
split ring styling between library and consumer. So the library paints no disabled state at all; the painter does,
from the flags, inside the focusable element, where it cannot reach the ring.

### Controls: the shell owns behavior, the painter owns paint

The user's model: `Button` is a shell, its content is a painter, as `Tooltip` and `Modal` already are.

**A control paints nothing.** The shell owns events, ARIA, focus, tab order, tooltip anchoring, geometry and the
flags; every pixel comes from `renderContent(flags)`, declared on `InteractionControlProps` so every leaf has it. It
is a `render*` callback rather than `children` because the painter needs the flags; Vue and Svelte receive it as a
slot or snippet under the same name. The library carries no colors, and a consumer defines a branded control once.

**Where the paint goes is the leaf's decision.** `Button` puts it inside the `<button>`. `<input>` is void, so
`Checkbox` returns the painter in flow and the input over it at `inset: 0`: the painter sizes the box, the input
covers exactly that box, and the ring lands around what was painted. That input is a blank slate — `appearance: none`
plus `!important` resets of background, border, radius, shadow, padding, margin and size, because a consumer's element
selectors outrank a class — with `outline` deliberately left, since it is the ring. A painter is handed `isDisabled`
and nothing about reachability, so the two cannot be drawn differently. **Painted text is `aria-hidden="true"`**,
since the name comes from the control.

**The tooltip gets the flags too**, since it usually explains a state; the wrapper adapts the consumer-facing
`renderContent` down to `Tooltip`'s own signature.

**The wrapper's box equals the painted box — nothing may decouple them.** The decoration slot is `inset: 0` against
the root and the ring is drawn on the control, so the root is `display: flex` (no inline descender slack) and
`interactionRoot > *` forces `margin: 0 !important` against consumer element selectors. Sizing, padding, border and
surface paint are the painter's; `margin`, `transform`, `position`, `float` and `inset` on the in-flow child are not,
and only `margin` is defended. Spacing belongs outside the wrapper; a painter wanting inner space uses padding.

**Under `sizing: "fill"` the in-flow child grows with the root** (`flex-grow: 1` on `fill > *`) — the user's pick.
Before, the root stretched and a painter declaring its own width stayed at it, while a `Range`'s inputs, set over the
whole root, took presses across the full width: the slider drew half its track and put the thumb where nobody had
pressed. Every filling `Range` had to measure its slot and pass the width back to its painter, and the examples that
forgot kept reappearing. A painter's declared width is now where it starts under `fill`, and a control whose in-flow
element already filled (`Button`'s `<button>`, `Sortable`'s item) is unchanged.

**A painter's declared width is a preference: `max-width: 100%` on `interactionRoot` makes it one.** Under
`width: fit-content`, a flex item with a definite width sets the container's min-content size, so a 200px painter in
190px of space overflows, and nothing inside the painter can fix it — `max-width: 100%` on the painter is circular,
`min-width: 0` does not reach the container, `width: 100%` collapses to zero. Clamping the root lets the painter
shrink with it. It is a no-op under `fill`, and a percentage `max-width` against an indefinite container computes to
`none`, so nothing else changes size.

**Render props receive what drives them**: `renderDecoration(flags)`, not a zero-argument slot the consumer has to
wire state into themselves, and never a name already meaning a different signature elsewhere. **The decoration slot
belongs to the wrapper** because it needs `position: relative` on the root, `inset: 0` and `pointer-events: none`;
one slot, a fragment for several. Marker classes (`interactionPressed`, `interactionError`, `interactionDisabled`)
are empty escape hatches; a painter reads state from the flags.

**Flags merge, and the owner's win.** `isPressed`, `hasError` and `isDisabled` come from the owner; `isHovered`,
`isFocused` and `isActive` from the element. `wrapElement` keeps its listeners while disabled and forces `isHovered`
and `isActive` false — the flags are all that stands between a disabled control and a live-looking one — while
`isFocused` stays live for reachable controls. `Tooltip` keeps its own listeners, so a disabled reachable control
still reveals its explanation.

### Controls: the flags are extensible, and a painter is typed to its own control

`InteractionFlags<TExtra>` defaults `TExtra` to `{}`. A control with private state declares it
(`BinarySwitchFlags = { checkedState }`, `TextInputFlags = { isEmpty, isReadOnly }`) and threads it as
`InteractionWrapperProps<BinarySwitchFlags>`, so its painters receive exactly what it produces — and a painter typed
for one control fails to compile under another it does not fit. **The wrapper takes the extras as one `extraFlags`
prop**, merged last, so a private flag is never a public prop. **Extras are required fields**, since the control
always produces them; the universal flags stay optional. Props that mention `TExtra` are declared together, by hand.

### A leaf with more than one focusable element owns the disabled half itself

`wrapElement` acts on the one element the wrapper is given, so a second thumb of a `Range` or the axes of a
`ColorArea` sat outside the disabled handling at a native `tabIndex` of 0.
**`InteractionTrackerUtils.wrapExtraControls(refs, isDisabled, opts)` applies only the disabled half** — the
`tabIndex` and the focus refusal — to the extra elements. Reachability does not enter into it: the tooltip anchors on
the single wrapped element, so the extras leave the tab order whenever the control is disabled. Not applied to every
focusable inside the root, because a `TextField`'s trailing slot may hold a real `Button` with its own wrapper.

**A disabled control gates the write and still syncs the element.** Returning before the sync leaves a refused arrow
press holding a position state never accepted, with `aria-valuetext` disagreeing.

**An enabled multi-element control is one tab stop per element** — the user's call. A radio group's members are N
spellings of one value and share a roving stop; a range's two thumbs and a color surface's two axes are two values
with their own names, so each is a stop.

### The wrapper between a container role and its items is presentational

The user's call. A component wrapping each item puts the wrapper's root between the container's role and the item's
(`listbox` → `option`, `row` → `gridcell`), so the root carries `role="presentation"`, through a `role` prop defaulting
to it. Valid because the root is neither focusable nor carries global ARIA. Not `aria-owns`, which states a
relationship the DOM no longer shows; not hand-rolled items, which _"the composition is an implementation detail"_
rules out. A consumer's own markup between a listbox and its items is theirs to mark.

### An example that shows a picture gives it the picture's own proportions

The user's rule, after two examples cropped a square picture into a landscape box. A Playground example sets the width
and leaves the height `auto`, so the box is the picture's own shape; it never sets both sides to a ratio the picture does
not have, and does not reach for `object-fit` to hide the mismatch. The same holds for a shape drawn into a box: a
built-in shape stretches to fill its box, so the box is square unless the shape is meant to be oblong. A knob that
exists only to show a crop or a stretch is not an example of the component.

### An example's knobs live in the page, never in the example file

The user's rule, given more than once. The example file under `Examples/` (or `Docs/`) is what the source view shows and
what a consumer copies, so it holds only the component and the props it is given. Any knob that example needs, with its
state and its `PageExampleKnobs`, sits in a wrapper component in the page file, as `ParticleFieldPage`'s
`ShapedExampleWrapper` does, and reaches the example as accessors. State the example needs to demonstrate itself, such as
a control that raises a toast or a button that dissolves, stays in the example.
