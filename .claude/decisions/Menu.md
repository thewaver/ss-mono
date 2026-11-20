# Decisions: `Menu`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Menu` sections are `Select`'s groups again

The user's call: a menu is split into sections with exactly the mechanism `Select` groups use — a group entry
`{ label, items }` with no value, `renderGroupHeader` for its heading and `renderGroupBox` for whatever surrounds it — on
the grounds that one modular slot covers a boxed section, a line under a section, spacing and indents alike, so no
separator role or separator record was added. The heading is never reached by the arrows, as in `Select`.

**Everything that walks a level works on the flattened list**, `MenuUtils.flattenNodes`; only drawing reads
`MenuUtils.getSections`. **Radio runs are worked out per section**, and the activation is handed those runs, because
radio items used to group by adjacency alone and two sections of radio items side by side would have become one group.
**A laid-out menu draws neither painter** — each item is placed on its own — so `MenuGroupPaintExcludesLayout` refuses
the pair and `MenuUtils.warnIfGroupPaintIgnored` catches the rest, the `Stepper` pattern again; `FanMenu` and
`WheelMenu`, always laid out, leave both out of their props. A laid-out menu still wraps a group in its named
`role="group"`.

Per framework: Vue cannot express the refused pair against slots, so it keeps only the warning, and its box painter is
handed one content function per section index kept across renders — `Listbox`'s `getGroupContent` rule for
`<component :is>`. Svelte keys its sections by position, not by `from`, since an empty group shares its `from` with
the next section and a duplicate key stops Svelte.

### A menu paints its first item highlighted the moment it opens

On a wheel this makes one item look picked while the pointer is still on the opener, and hiding the paint until
the pointer or a key engages was weighed. The user turned it down on the decisive point: on open, keyboard focus is
on the first item (the menu pattern: "When a `menu` opens … keyboard focus is placed on the first item"), so Enter
or Space runs it. The paint is the truth; hidden, a person who opened by clicking and pressed Enter would run an item
they never saw.

### `Menu` submenus: a level per popup, focus moving between them

An item may carry `items`, and a level is drawn per popup all the way down.

**The choice was one focus target for the whole tree versus one per level, and support decided it rather
than structure.** Keeping focus on the root menu looked like the smaller change. It is not:
`aria-activedescendant` may only name a descendant of the focused element **or** one claimed through
`aria-owns`, and every level is portalled out to the viewport — so that variant rests entirely on
`aria-owns` across a portal, which is sanctioned and thinly supported. A level holding its own focus has its
items physically inside it, and it is the variant the APG menu examples implement: `ArrowRight` opens a
submenu onto its first item, `ArrowLeft` closes it and returns.

**`MenuLevel` is the recursion; `Menu` is the trigger plus the root level.** A level owns its highlighted
value, which of its items is open, its own popup and its own keyboard. It renders each submenu inside the
item that owns it, so a level unmounts with its parent for free and the anchor is that item's element.

**An item with children is the trigger for its level, and says so in the same words the button does** —
`aria-haspopup="menu"`, `aria-expanded`, `aria-controls` while open. `MenuItemFlags` gained `hasSubmenu` and
`isOpen` so a painter can draw the arrow and the open state, which it could not otherwise infer.

**`MenuItemFlags` is a superset of `MenuFlags`, and that keeps `renderPopup` at one signature.** A popup is
handed the flags of whatever opened it — the trigger's for the root, the parent item's for a submenu.
Disjoint flag types would have forced a union every consumer had to narrow.

**A key is handled by the level it was pressed in, and the check has to be explicit.** The levels are
portalled siblings, so nothing bubbles between them in the page, yet a key pressed three levels deep ran every
ancestor level's handler: `Escape` collapsed two levels and `ArrowLeft` closed the menu outright. Each level now
ignores a keydown whose target is not its own popup root.

**A blur dismisses only when focus has left the whole tree**, identified by id prefix — every level's id
derives from the root's. The previous `relatedTarget === trigger` guard cannot generalize, because closing a
level restores focus to the level above and that restore reaches the parent as a blur; with three levels
open, hovering back up the chain closed everything. The trigger check stays beside it for its own reason.

**Hovering an item opens its submenu, and moves the highlight there.** Splitting them is worse: the highlight
is what `aria-activedescendant` names, so a submenu open under an unhighlighted item states two positions at
once, and `ArrowLeft` back out would land on neither. Hovering an item with no children closes whatever was
open at that level. Nothing is on a timer.

**`ArrowUp` on a closed trigger still opens onto the last item, but the mechanism moved.** The highlight now
lives in the level, so the trigger states an intent — `initialHighlightPosition` — which the level reads only
as the fallback for a highlight nothing has set. It is not written into the level's state, so the first arrow
press walks from it and overwrites it as before.

**A trigger swallows its own keys while its menu is open, rather than opening it again.** Added
. A menu is drawn and highlighted before it takes keyboard focus — the layer takes focus only
once positioned, and its position waits on a `ResizeObserver` callback in a later task. In that window an
`Enter` meant for the highlighted item reached the trigger, which read it the only way it knows: open the
menu. Opening an open menu reset the highlight to the first item, so the keystroke silently moved the
highlight and the next `Enter` ran the wrong item. Refusing the four opening keys while the state says open
turns that into a keystroke ignored, the tolerable failure.

**The default is prevented before the open state is consulted, and the order is load-bearing.** All four
keys activate a `<button>` natively, so returning early without preventing the default lets the browser
synthesise a click that toggles the menu shut.

**What this does not do is make that early keystroke work.** Closing the window means giving a layer focus
as soon as it is open rather than once positioned; the cheap version — reading the content size once on mount
instead of waiting for the observer — was tried and reverted. Positioned a frame earlier, the
menu lands under the pointer that just clicked the trigger and `onMouseEnter` takes the highlight, so six
menu specs failed on a highlight one item further down. That makes it a question about whether the pointer or
the keyboard owns the highlight at open, which nobody has decided.

**The submenu's placement defaults to `right_out` / `top_in`; its offset is zero and belongs to the
consumer.** A submenu anchors to its parent item, and an item sits inside whatever padding and border the
painter's surface has, so a submenu flush against its anchor overlaps the surface it came from. The library
cannot know that inset, so `getSubmenuOffset` is where the consumer states it; the Playground passes its own
surface's padding plus border. Anything a consumer paints _outside_ its box — a drop shadow — overlaps by the
same arithmetic and is theirs by the same argument.

### `Menu`: Tab leaves for the stop after the trigger

**Tab closes the menu and moves focus to the first tab stop after the element that opened it; Shift+Tab closes it
and leaves focus on that element.** The user's call, matching the WAI-ARIA menu-button pattern ("Tab: moves focus to
the next element in the tab sequence"), which Radix's menu does not do. Before this, Tab closed the menu and returned
focus to the trigger, costing a keyboard user one extra press, because the popup is portalled to the end of the
document and letting the browser handle Tab would have sent focus past everything on the page.

**The next stop is worked out before the menu closes, then focused after it.** `MenuUtils.computeNextTabStop` takes
`FocusManagerUtils.getFocusableChildren` — the page's reachable elements in tab order, `inert` ones already left out —
and returns the first that follows the opener, skipping anything inside the opener and anything inside a menu popup.
Closing returns focus to the trigger synchronously, through the popover's focus restore, so the view closes first and
focuses the answer second; with nothing after the opener, focus stays on the trigger. The level reports Tab as the
same dismiss step it always did, and the view reads Shift from the event, so the shared step type did not change.
`ContextMenu` does the same from its region.

### `Menu`: `staysOpenOnPick` is the item's to say

**Whether a pick closes the menu is the item's decision.** The kind-based default stands: a checkbox stays open, a
radio or a command closes. `staysOpenOnPick` overrides it, for a command pressed repeatedly such as zoom in.
`MenuUtils.getStaysOpenOnPick` is the one place the rule lives, so `Menu` and `ContextMenu` cannot drift apart. It
reaches the wheel and fan menus through the shared item type, where the default is the right one, because the pick
animation there is the menu leaving.

### `ContextMenu`: the same menu, opened by a right-click at a point

Settled while closing the last of the opener bullets in `backlog.md`. What differs between a menu on a
button and a menu on a right-click is the opener, not the menu — so the level, the items, the submenus, the
typeahead, the keyboard and the dismissal are all the ones `Menu` already has.

**There is a keyboard opener, and the anchor is the focused element rather than a point.** The ContextMenu
key, and Shift+F10 for keyboards without one, open the menu on the region's own `keydown`. The anchor is the
adjusted rect of whatever inside the region has focus, falling back to the region itself, so the menu lands
against something the person can see rather than at a coordinate they never pointed at. The `contextmenu`
event is handled the same way when it arrives carrying the origin as its point: a menu anchored at 0,0 is
not usable however it got there, which is a fact about the coordinate rather than a guess about the input
device — MDN does not document a property that separates a keyboard-invoked `contextmenu` from a mouse one,
so nothing here tries to infer it. A `keydown` only reaches the region once focus is inside it, which is why
the region is the component's own tab stop rather than the consumer's element — argued below.

**It is a second component rather than a mode, because a right-click menu has no button to render.** `Menu`
is a trigger plus a root level, and its trigger is a real `<button>` with a name, a tab stop and an
`aria-expanded` — none of which a context menu has any use for. A `hasTrigger` flag would have left an empty
button in the tab order, or an `InteractionWrapper` wrapping a control that is not there. `ContextMenu`
renders the level and nothing else. This is also what the published libraries do: Radix ships a whole
`ContextMenu` over the same menu internals, and Ark UI adds a second trigger part rather than a second menu.

**The region is the component's element, and the consumer paints into it through `renderRegion`.** It was
first a ref to the consumer's element, `regionRef`, on the grounds that the region is whatever area the menu
belongs to — a canvas, a row, a whole page — and the library could not know its shape. That left the keyboard
opener dead wherever the region held nothing focusable: a plain box of text has no tab stop, so the
ContextMenu key could never arrive, and the Playground's own example was exactly that shape (2.1.1, Level A).
Fixing it meant writing a `tabindex`, a role and a name onto the region, and whether a component may write
attributes onto a ref a consumer handed it was an open question with nothing else needing the answer. The
pickers answered it first — the library needed ARIA on a control the consumer painted, and the answer taken
there was that **the library owns the element** (_"The pickers own their trigger"_). Applied here, the question
stops arising rather than being answered: `ContextMenu` renders a `div` with `tabindex="0"` (`-1` while
disabled), `role="group"`, the required `regionAriaLabel`, and `aria-haspopup`, `aria-expanded` and
`aria-controls` pointing at the menu, and everything inside it is `renderRegion`'s.

- **The role and the name are part of the same fix, not a follow-up.** A focusable box that announces as
  nothing is the same fault as a tab stop with no name anywhere else, and the region's name cannot be the
  menu's, which describes what the menu offers rather than what the region holds.
- **The region is still the anchor and the dismiss root**, as the ref was; owning the element changed where it
  comes from, not what it does.
- **The listeners are the library's, and always were.** The point has to be converted out of client
  coordinates into the space the positioner works in, and a consumer cannot be expected to know that a
  `Viewport` may be scaling everything around them.

**The point is a rect of no size, which is what let this be built with nothing new underneath.**
`AnchorUtils.createPortalPosition` already took an optional `getAnchorRect` for `Spotlight`, so a zero-size rect at
the pointer is an anchor like any other: the default placement puts the popup's near corner on it, and the
same edge-safety logic flips it near a screen edge. `Popover` gained the one prop that threads it through.

**A popup with an explicit rect drops its anchor from the dismiss roots, and that reversal is deliberate.**
`Popover` normally treats the anchor element as part of its own layer, so pressing a toggle button does not
dismiss the popup before the button's handler can toggle it. A point-anchored popup is the opposite case: the
anchor is a whole region rather than a button, and a plain left-click inside it has to dismiss the menu like
any other press outside. The right-click that re-opens the menu elsewhere in the region is unaffected —
`pointerdown` dismisses first and `contextmenu` opens again at the new point, so the menu appears to move.

**The menu names itself, because there is no trigger to be named by.** `MenuLevel` labeled its popup with
the trigger's id; it now takes an `ariaLabel` beside that, and `ContextMenu` requires one.

### Controls: stateful `Menu` rows, and the run that makes a radio group

The user's call, in their words: extended functionality rather than a `Select` wearing menu paint. `Menu`
had one kind of row — a command you press, which does something and closes the menu. It now has three.

**The kind is a field on the record, not a second component.** `MenuItem<T>` gains `kind?: "command" |
"checkbox" | "radio"`, absent meaning command, so every list written before this is unchanged and a list can
mix all three. A discriminated union in `SelectItem`'s shape was the alternative and buys nothing here: the
three kinds carry the same fields and differ only in what pressing one does, where a `Select` group differs
from an option in having children at all.

**A run of adjacent radio rows is one group, derived rather than declared.** Nothing names a group; the
component walks the list and treats consecutive `radio` rows as a set, boxing them in `role="group"` the way
the published pattern asks. The alternative — a `radioGroup: string` field on each row — is a second thing to
keep in step with the order the rows are written in, and a group whose members are not adjacent is not a
thing a menu can draw anyway. `MenuUtils.getRuns` is the walk; everything that is not a radio is a run of
one, so the render is flat whatever the list holds.

**One signal holds every checked value, radios included.** `checked: Signal<T[]>` is `MultiSelect`'s
shape, and a radio pick is expressed as set arithmetic over it: drop whatever else in this row's own run is
in the list, then add this one. So a consumer reads one array rather than one array plus a value per group,
and the library needs no notion of a group identity to write it — the run it was handed is enough.

**A tick keeps the menu open and a pick closes it, because that is the split `Select` already made.** A
multi list stays open across a pick and a single one closes; ticking is a thing you do several times and
picking one of a set is a thing you do once. Following the existing decision rather than inventing a third
answer also means the two controls cannot drift apart. Radix arrives at the same behavior by a different
route — its items close on select unless the consumer prevents it.

**`aria-checked` goes on the two stateful roles and nowhere near a command.** The attribute is what tells a
reader a thing is checkable at all, so a command carrying `aria-checked="false"` would announce one that can
never be checked. `MenuItemFlags` gains `isChecked`; the painter reads the kind off the record it already
has, which is why no `kind` flag was added beside it.

**What the level owes the top and what the top owes back.** A submenu is another `MenuLevel`, so the checked
values are handed down as a read-only accessor and the pick is handed up: `onPick(item, radioGroupValues)`
replaced `onActivate(value)` on the level, because the level is the only place that knows which run a row
belongs to and the top is the only place that owns the signal and can close. The public `onActivate(value)`
is unchanged.
