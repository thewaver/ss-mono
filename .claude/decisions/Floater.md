# Decisions: `Floater`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Floaters are an `Abstract`, and follow the highlight as well as the selection

`Menu` was the third control to want a floater, which is the point the rule above set for extracting it. The
copies in `Tabs` and `RadioGroup` are gone; every consumer goes through `FloaterUtils` in the core and one
framework helper per package (`FloaterSolidUtils.create` and its siblings).

**What the abstract owns.** The marker's box, in the container's own coordinates: measured from the item
(`FloaterUtils.observeBounds`, a `ResizeObserver` on the container and the item plus the `offsetParent` hop
described above) in a plain row or column, or derived from the item's placement in container-query units
(`computePlacedBounds`) under a layout, where nothing is measured. A measured marker keeps the item's fractional
size, read from the computed style: `offsetWidth` rounds, and a marker rounded up past an item that fills a scrolling
box gave that box a horizontal scrollbar on hover. The fade through `ElementFader`, with the
last box kept while the marker fades out, so the exit plays where it was, and dropped once it has gone, so the
next entrance starts at the new item instead of sliding in from the old one. The `floater` class
(`position: absolute`, `z-index: -1`, no pointer events, transitions on the four box properties), so each
control's container only has to be positioned and `isolation: isolate`.

**Two floaters, two names.** `renderFloater` became `renderSelectionFloater`, and `renderHighlightFloater` sits
beside it; both take the visibility target and the duration every appearing painter takes. Where the selected
item and the highlighted item are different things each gets its own marker, and the name says which one it
follows. `Select`, `Listbox`, `Tree`, `Tabs` and `RadioGroup` take both; `Menu`, which has no selection, takes
the highlight one only. One `floaterTransitionDurationMs` drives both; its default in each control's defaults is
the user's number, after 150 felt slow, and `Tabs` and `RadioGroup` keep a longer one of their own, also the user's call.

**The highlight is the hovered item first, then the focused or keyboard-highlighted one.** In `Tabs`,
`RadioGroup` and `Tree` the controls read the pointer through `pointerover` and `pointerleave` on their container
and the focus through `focusin` and `focusout`, because none of them moves its own highlight on hover. `Listbox`
is the same: its options hold the focus, and moving the focus on hover would steal it from wherever the user
left it, so the marker reads the pointer on its own and falls back to the list's highlight while the pointer is
elsewhere. **`Listbox` reads it from `pointermove`, not `pointerover`**: a list scrolled by an arrow key slides new
options under a resting pointer, `pointerover` fires for them, and the marker jumped to the option under the pointer
instead of the focused one (the rule in `interaction-and-layout.md`, "A hover the pointer did not cause is ignored").
The others do not scroll under the pointer, so they keep `pointerover`. `Select`'s popup moves its highlight on hover anyway, so for it the two agree. `Menu` moves its
highlight on hover already, so its marker follows the highlight alone.

**The fallback is the focused item only while that focus is visible.** A click focuses what it lands on, so with
a plain "hovered, else focused" rule the left nav's marker went back to the clicked row as soon as the pointer
left the tree, instead of fading. `Tree`, `Tabs` and `RadioGroup` now remember the focused item only when
`InteractionTrackerUtils.computeIsFocusVisible` says so, read on `focusin` and again after each key press, so a
click leaves no fallback and the first arrow key brings it back. This is the same split `Listbox` makes with
`getIsPointerLed`.

**Each control wraps its items in one presentational container, because a floater needs a positioned box to
sit in.** `Listbox`'s mounted options sit in a `role="presentation"` wrapper (`listboxOptions`) which takes the
horizontal flex too; the end marker that asks for more options moved inside it, so it still overlaps the last
option rather than following the wrapper. A windowed list draws its floaters in the sizer instead, which is
already positioned and which carries the rows. `Menu`'s non-laid-out items sit in `menuItems`; under a layout
the floater sits inside the `PlacementBox` with the items. `Tree` draws them in its root (now positioned and
isolated) or in the windowed sizer.

**A windowed list can scroll the highlighted item away**, and then there is nothing to measure: the floater
fades out and back in when the row returns. That is `ElementFader`'s ordinary job, and the reason the item refs
are kept in a map that drops an element when its row unmounts.

**An option's ref is keyed by its element, not by its index.** `Listbox` records each mounted option with the
accessor for its flat index, and looks an index up by reading those accessors. Keying by index meant the cleanup
had to ask a removed option for its index, which reads a row that filtering has already taken away and throws.

**In the Playground, a floater replaces every background that marks hover or selection.** The user's rule: any
control that takes a floater and whose painter changes a box's background to show the hovered, highlighted or
selected item shows it with a floater instead — `Select`, `MultiSelect`, `Listbox`, `Menu`, `ContextMenu`, `Tree`
(the left nav included), the honeycomb `Tabs` and `FanMenu`. That holds per floater: a list that draws only a
hover floater still paints its own selected state, through the Skin's `itemBase`. The painters shared with controls that take no floater
— the text field's suggestions, the menubar, the toolbar's overflow menu — keep their backgrounds, so the switch is
on the painter, one prop per floater (`hasHoverFloater`, `hasSelectionFloater`), rather than a deletion from its
styles. Painters that mark state by color, a
filter or an underline are untouched, and so are the wheel's wedges, which fill a path rather than a box.
`renderPageHighlightFloater` and `renderPageSelectionFloater` are the one-line way a usage takes the floater in Solid and
React; Svelte keeps them as snippets in `GlideFloater.const.svelte`, since a component file cannot export snippets
that render itself, and Vue fills a `#renderHighlightFloater` slot with `PageGlideFloater` at each usage, since a slot
cannot be handed a function from a template.

**The radial `Tree` keeps its own selection gradient for now.** Its outer ring draws each circle at 70% of its box,
and a floater fills the box, so the marker would show larger than the circle it marks.
