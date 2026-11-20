# Decisions: `FanMenu`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `FanMenu`: levels that replace rather than stack, and the row that walks back

The user's design, and the second control built on `Menu` rather than beside it. A fan shows one arc at a
time: opening a submenu replaces the arc it came from, and the new arc's first card is the item you came in
through, which takes you back.

**It is a mode on `Menu`, not a trick played on it.** The first sketch had `FanMenu` hold a path and hand
`Menu` a flat list of leaves, which would have needed `Menu` to be told not to close on them — the user's
objection was that a branch never closes a menu, which is true and is exactly what flattening throws away. So
the items stay nested, `Menu` keeps its recursion and its `aria-haspopup`, and `submenuMode: "replace"` says
what to do with the levels. `FanMenu` is then the fan layout plus that mode, and nothing else.

**A covered level is hidden, not unmounted, and the reason is structural.** A submenu is rendered inside the
item that owns it, so unmounting a covered level would destroy the level that covered it — which would
uncover it, which would mount it again. That nesting is deliberate elsewhere too: it is what gives a submenu
an anchor and what makes a level unmount with its parent. Hiding costs nothing a screen reader can tell
apart, since `display: none` removes a subtree from the accessibility tree as thoroughly as unmounting does,
and it leaves the outgoing arc in place long enough to animate away.

**What is hidden is the popup's content, not the popup, and that is a focus decision.** Hiding the whole
layer would blur it the instant a submenu opened — before the child had taken focus, since a level takes
focus only once positioned — so the child would record `<body>` as the thing to restore to and going back
would land on nothing. `Popover` therefore wraps its content in a `display: contents` box and turns that box
off instead: the level keeps its own focus until the child takes it and gets it back on the way out, exactly
as in a stacked menu, while everything a person can see or hear is gone.

**The back row is the opener re-rendered, which is why no new concept was needed.** In replace mode a level
prepends its own opener to its entries, flagged `isBack` so a painter can mark it, and activating it closes
that level — the same thing `ArrowLeft` already does. It is a real item: in the walk, in the arc's geometry,
carrying the opener's own painted content and its name. It never opens a submenu of its own, and the
highlight opens on the first entry below it rather than on the way out.

**A submenu opens on a hover or on a press, and that is the menu's choice rather than an item's.** The user's
call, and the fan sets it to press. It was left out of the first build and the fan was unusable for it: a
pointer sweeping the arc drilled a level, the arc was replaced under the cursor, and the new arc drilled
again — which reads as hit-testing gone wrong rather than as a hover rule, and is what the fault was
reported as. Measured afterwards, each card owns exactly its own painted area and nothing else, so the
geometry was never in it. Hovering still moves the choice under either setting; only the opening changes, and
under `press` a hover no longer closes an open level either, since opening and closing should answer to the
same gesture.

**A fan factory came with it, on the same terms as `createRing`.** The fan's measurements — card size,
spacing, gap and tilt — were module constants and became a defs type of their own. **There is no fan factory
any more** — see _"A fan is an arc that tilts"_ — but the paragraph below still holds, since it is about how
a fan should be tuned rather than about which function draws it.

**A fan is given the angle between two cards, not the angle the whole arc covers.** The user's call, after a
menu of five opened a submenu of three and the three were stretched across the same spread. A total arc makes
spacing a function of how many items happen to be there; a step makes it a property of the fan, so five cards
and fifteen sit the same distance apart and the arc simply grows. `maxSpreadDegrees` is the only thing
holding it: past that the step is squeezed to fit, which is what stops a menu of two hundred from wrapping
round on itself. The radius follows the effective step rather than the count, so the cards never crowd.

**A replaced level stays hidden while the whole menu fades out.** Closing clears each level's open submenu, and
"covered" was read straight off that, so picking a card two levels down uncovered every level above it at the
moment the fade began — the person saw the arc they had left reappear and fade beside the one they picked from.
`MenuLevel` now remembers, on close, whether it was covered and keeps that until it next opens, so only the
level that was on screen fades.

**Each card covers the one before it, and the highlighted card is lifted above them all.** The user's rule. A placed
entry is stacked by `MenuUtils.computeStackAt`: its position plus one, or above the whole level while it is the
highlighted entry. `InteractionWrapper` already raises a hovered control over its siblings, but inside a
`PlacementItem` that raise is trapped in the item's own stacking order, so on its own it never brought a fan card
forward — in devtools it read as hover lowering the card, a `2` against neighbors at `3` to `5`. Lifting the
highlight rather than the hover covers the arrow keys too, which keeps the item a keyboard user is on from being
covered by a neighbor (WCAG 2.4.11).

**The highlight floater rises with it.** Its stylesheet puts it behind every item, right for a list whose rows never
overlap; in a fan the highlighted card has no fill of its own and is painted by the floater, so a lifted card still
showed its neighbors over its fill and only its label on top. A laid-out level writes the floater's order from
`MenuUtils.computeFloaterStackAt`, one above every entry and one below the highlighted one.
