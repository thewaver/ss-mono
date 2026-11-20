# Decisions: `Collapsible`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Collapsible`, and what an accordion adds to one

Settled, on the user's call, when a single show-more panel became the second consumer of
machinery `Accordion` had kept to itself. The split is **what each layer claims about the page** rather than
how either one opens.

**`Collapsible` owns the disclosure**: the trigger's `aria-expanded` and `aria-controls`, the panel, the
measured height, the fader, and `inert` while closed. `expanded: Signal<boolean>` is its state — a lone
panel genuinely owns its own boolean.

**`Accordion` adds the three things that make a panel part of a set**, each a statement rather than a
behavior: the heading element around the trigger, the panel's `role="region"` named by that trigger, and the
arrow-key walk across the headers. The expanded-set policy, including single-expand, stays with it too, since
only a set can have a policy.

**The heading is the load-bearing half of that split.** A show-more at the end of a paragraph is a control
inside prose; wrapping it in an `h3` puts a heading in the document outline that no reader would agree is
one, and a `region` landmark for a two-sentence expansion is landmark noise. So `getHeadingLevel` is
**optional** on `Collapsible` and absent means no heading element at all — the only component here where the
absence of a prop removes an element rather than defaulting one.

**The panel's role arrives as `getPanelRole` plus `getPanelAriaAttributes`, which is `Popover`'s shape**: the
role is the consumer's, so the ARIA that role requires is too, and one bag beats a prop per attribute.
`Accordion` passes `region` and an `aria-labelledby` pointing at the header id it generated, which is also why
`Collapsible` takes `getId` — whoever names the panel owns the id.

**A section has no boolean, so `SignalMirror` is the bridge.** `Accordion` owns `Signal<T[]>` and each
section reads its own membership out of it, while `Collapsible` wants the whole signal.
`SignalMirrorUtils.createValueMirror` was extracted for this and writes outward only when the value actually
differs, so "the difference is the toggle" holds and the set stays the single source of truth. Its fifth
consumer, and the first inside the library.

**`AccordionFlags` is gone rather than aliased to `CollapsibleFlags`**, following the `TextField` extraction:
old names went with it and the Playground's painter was renamed. One shape, one name.

**The panel opens on any side of its trigger, through one `side` prop.** Top, right, bottom or left, bottom
by default, which is what it always did. The user's call over an orientation prop plus a before-or-after prop:
four physical sides say the same thing in one value, and `Drawer`'s `edge` already uses that vocabulary. It
gives up flipping by itself in a right-to-left page, which `Drawer` does not do either. Sideways, the panel
animates its width instead of its height, the trigger stops filling the row, and the contents are laid out at
`max-content` so the growing panel uncovers them rather than squeezing them — which is why a sideways panel
wants contents with a width of their own.

**A minimum collapsed size was considered and dropped.** A closed panel is `inert`, so whatever a minimum
left showing would be visible and unusable; keeping it usable means lifting `inert`, which lets Tab walk into
the clipped part. The user dropped it rather than change what closing means. `Sidebar` is where a panel that
stays partly visible lives.

**Every element the two render between the consumer's box and the consumer's painters passes `border-radius`
down** — the user's call: a consumer who rounds the box around an accordion and writes `border-radius: inherit`
in their header and panel painters gets matching corners without knowing what lies between, rather than two radii
or a clip. Both are runs in `CornerRunUtils`' sense: an `Accordion` hands the box's leading corners to its first
section and the trailing ones to its last, none to a section between; a `Collapsible` squares the corners where
its trigger meets its panel while it is open, on its own button and panel, so the consumer never writes the
seam. While a panel animates shut the trigger is already rounded, since `aria-expanded` flips first.

**A box around the trigger and panel together is a third painter, `renderSection`** — the user's design, on both
`Collapsible` and `Accordion` (which hands it the item too). It is for decoration — a border, shadow or background
holding the pair — and never for layout, so it follows `renderGroupBox`'s shape: handed `renderContent` and the
section's flags (`CollapsibleSectionFlags`: open, disabled), it wraps a library element that keeps the side
layout. The structure is the root (sizing, a one-cell grid so whatever sits in it fills it, its column
`minmax(0, 1fr)` so content that cannot wrap, such as code, does not widen it past its container) → the consumer's box,
or with no `renderSection` a `display: contents` element the user asked for so nothing is dropped → the library's
content element (the flex row or column for `side`) → heading and panel. A box that does not inherit
`border-radius` breaks the corner chain below it, as `renderGroupBox` does; the Playground's
`PageAccordionWrapper` always takes its Skin's radius: an unlayered "inherit inside a `pageContainer`" rule beat
every Skin's layered radius on the Appearance page's rows, and the only accordion that needs the box's corners, the
docs' "Show code" disclosure, has no wrapper — its header and panel painters still inherit inside a `pageContainer`.
