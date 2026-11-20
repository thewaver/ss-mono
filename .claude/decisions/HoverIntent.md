# Decisions: `HoverIntent`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `HoverIntent`: the hover engine lifted out of `Tooltip`, and `Tooltip` on top of it

The user asked for a hover card as a preset beside `Tooltip` over one shared engine, rather than as a flag on
`Tooltip`, because a flag would switch the role, the `aria-describedby` link, the blur rule, the focus key and
the dismiss registration at once, which is the _"a mode cannot move at runtime"_ argument from `Spotlight`. So
the part of `Tooltip` that is not about being a tooltip moved to `Abstracts/HoverIntent`: the wait before
showing, the skip window, the bridge across the offset, and the leave that reads where the pointer is going.
`Tooltip`'s props did not change, and it behaves as it did.

**It takes the open state; it does not own it.** `HoverIntentUtils.create(getAnchorRef, visibilitySignal, defs)`
reads and writes a signal the caller holds. `Tooltip` keeps a private one, a hover card has an optional
`visibility`, and a consumer's flyout may keep one shared key for a whole menu. By the test in _"The 1D walk
is a pure function"_, the state it does own is the state nobody else has anywhere to keep: the pending timer,
whether the pointer is over the anchor or the panel, and the pointer type last seen.

**The skip window is a group, not one module-level number.** `createDelayGroup()` returns the record of the last
close, and each family of panels declares one at module level. Every tooltip still shares one record; a hover
card never skips its wait because a tooltip just closed, and the reverse holds too.

**Positioning did not move, because it was already shared.** `AnchorUtils.createPortalPosition` stays the one
answer to where a panel sits. The engine only computes the bridge, as the pure `computeBridgeInsets(placement,
offset)`, and each consumer applies it to its own panel; `Tooltip` keeps its `::before`.

**Four options, each needed by exactly one consumer.** `getFocusShowDelayMs` opens on keyboard focus after that
wait. `isHiddenOnAnchorBlur` is `Tooltip`'s alone, because focus can never be inside a tooltip. `getIsHeld` makes a
leave close nothing while it answers true, for a panel that stays open while focus is inside it. `isTouchIgnored`
exists because a touch screen reports a tap as the pointer arriving and staying, so without it a tap opens the
panel after the hover wait; a component whose press does something of its own switches it on, and `Tooltip`
leaves it off so a tap still shows a tooltip after the wait, as before.
