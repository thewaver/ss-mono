# Decisions: `Sortable`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The `Sortable` page's cards center on their slot rather than filling it, and its surfaces are given room

Two faults the user found in the placed `Sortable` demo, both in the Playground's paint rather than in the
library, and worth recording because the first cost several rounds to locate.

**A card drew itself at its own width and hugged one edge of its slot.** `sortableItemContent` had no width
and the default `flex: 0 1 auto`, so a chip took the size of its text and sat at the left of whatever slot it
was given. In a column that reads as a left-aligned list and nobody notices; on a ring the slot is the size
the layout chose, so a long label pushed its own center right and the items stopped sharing an axis. The
library was correct throughout — box, wrapper and `listitem` were all exactly the slot's width — which is
what made it hard to see: every measurement of the library's own geometry came back symmetric while the
screen was visibly not.

**Centered, not stretched, on the user's call.** `margin-inline: auto` on the chip, which centers a flex item
along the main axis, so a card keeps its own width and sits on its point. Making it `flex: 1 1 auto` instead
also fixed the geometry and was tried first; the user preferred the cards to stay their own size. It changes
the column demo too, where the three shorter cards now center in the width of the longest rather than lining
up on the left.

**The surface is drawn outside the list, so every demo has to keep room for it.** `sortableSurface`
sits at `inset: calc(-1 * spacing.full)` — deliberately a spacing unit beyond the list it belongs to, so the
items look enclosed by it. The two-list example had that unit back all along, in the wrapper that holds its
captions, which is why its surface landed neatly on the example card's content edge while every other
example's spilled into the card's padding. `PageSortableRoom` gives that unit to the rest, in one place
rather than repeated per example. The alternative was to stop the surface reaching outside its own bounds and
let the list's end room be the halo, which would have been a smaller rule and a different look; the look the
user pointed at as correct was the one with the overhang.

### Controls: `Sortable`, and why a drag is the least important of its three routes

Asked for by the user as the first piece of game-shaped work. A list whose items can be picked up and put
down, in place or in a sibling list.

**A drag is one route in, and the one that had to be built last.** Success criterion 2.5.7 asks that anything
operated by dragging also be operable by a single pointer **without** dragging, and 2.1.1 asks that it be
operable from the keyboard. So there are three ways in and they are one state machine: a press that moves
beyond the slop starts a drag; a press that does not is a click, and a click picks the item up and the next
click puts it down; `Enter` picks up, arrows choose a place, `Tab` changes list, `Enter` drops and `Escape`
cancels. Building the drag first and bolting the others on afterwards is what produces two state machines that
disagree, which is the shape this avoided rather than discovered.

**Lists find each other through a module-level registry keyed by a group id, not through a wrapper.** Two
lists that exchange items routinely have no useful common ancestor — a hand at the foot of the screen and a
board in the middle, or one of the two inside a `Popover` that is portalled elsewhere — so requiring a shared
parent element would put a layout constraint on the page for a bookkeeping reason. `Dismisser` is the
precedent and the shape is the same: a module array, `onCleanup` removing the entry. **The registry stays in
the component's own folder rather than under `Abstracts/`**, per the standing rule that a thing is private
until a second consumer asks for it.

**The carried item stays where it is until the drop commits.** The alternative — moving it live, so it is
already in the target while the pointer is still down — reads better and costs two arrays churning against
each other on every pointer move, with the index bookkeeping having to be exactly right at every intermediate
step or an item is lost. Instead the item does not move; the flags say which item is being carried and where
it would land, and the consumer paints a marker at the landing place through `renderMarker`, which the library
positions. Same division as `RadioGroup`'s floater.

**What the library owes the marker is a box, and getting only half of that box right hid the other half.**
The library places the marker and spans it across the axis it is _not_ marking — full width for a column
list, full height for a row — and the consumer paints inside it. The first build made that box a flex row in
both directions, so in a column the consumer's bar had no width to inherit and drew nothing at all: the
landing place existed, was correct, and was invisible, which reads as a control that does not respond. The
wrapper's flex direction now follows the list's, so the child stretches across the right axis.

**The marker sits midway between its two neighbors, and the list is padded by half a gap all round so the
outermost two have a neighbor to be midway from.** The landing place before the first card and after the
last one are the only ones that ever went wrong, and they went wrong twice for the same reason: a list whose
box stops exactly where its cards stop has nowhere to draw a bar. The first build put the end marker a half
gap past the last card, outside the list, over whatever sat beside it; the second clamped it back inside,
which put it _on_ that card. Neither is a position — there was no room, and the fix is to make room. The
padding matches the gap's half, so the space at the ends reads the same as the space between, and the offset
is then the midpoint of the two edges either side of it, with the list's own edges standing in at the
extremes.

**The padding is on all four sides, not only the axis the list runs along, and the marker is inset to match.**
The cross axis needs it for a different reason: a list scrolls, so it clips, and a focus ring is drawn
_outside_ the element it belongs to. Without room on that axis a ring loses its left and right edges. The
marker is inset by the same half gap rather than spanning the padding box, so it is as wide as the list's
content rather than sticking out past it.

**The offset it is placed at is divided by the viewport scale, and this is the fault the whole control took
longest to find.** It is derived from rect differences, which are on-screen, and written as a `top`, which is
layout — see _"A measured rect and a written offset are in different spaces inside a `Viewport`"_ in
`conventions.md`, which this is the entry that produced. Every check passed for as long as it was only ever
driven headless, where the Playground's viewport scale is exactly 1.

**The Playground paints no focus ring of its own, and painting one was a mistake worth recording.** The theme
already carries a global `:focus-visible` outline, so a card was showing three rings at once: the app's, a
solid one the painter drew from the `isFocused` flag, and the dashed border that means _lifted_. The flag one
also fired on plain focus rather than keyboard focus, so it appeared on a click and not on a tab — the
opposite of what a focus ring is for. A painter should reach for `isFocused` only where the app has no ring
of its own.

**How wide a card is stays the consumer's business.** The item element is a flex container, so a painter that
states no width is as wide as its own content and a column of cards comes out ragged. That was briefly
"fixed" by making the element a block so the painter had to fill it — rejected by the user, and rightly: a
list that forces every row to one width is a decision about paint, and the library does not have one. A
consumer who wants even cards writes `width: 100%` in their painter.

**That marker is positioned, never laid out, and the reason is a feedback loop rather than a preference.** The
first build put it in the flex flow between two items, which is the obvious way to draw an insertion point and
is wrong: a marker between two items pushes every item after it along, and the rects it pushed are the ones
the drag measures to decide where the marker belongs. So the answer changed, so the marker moved, so the
answer changed again. A column list spent the whole drag oscillating and read as a control that painted
nothing at all — which is exactly how it was reported. `position: absolute` with the offset computed from the
item rects takes the marker out of the geometry it is describing, and `computeMarkerIndex` converts the
settled index back into the gap it should sit in.

**A drag ends with a click the browser sends unasked, and it has to be swallowed.** The first build
let it reach the handler that picks an item up, so releasing a drag immediately picked the same item back up
in tap-to-place mode: it stayed dimmed, the list stayed lit, and every later press was answered by a state
machine the user did not know was running. `trackAxialSwipe` had already met this and its answer is copied — a
capture-phase `click` listener on the list root that swallows exactly one click after a pointer gesture.

**`renderCarried` is handed the item and nothing else.** The user's call, and the reasoning is theirs: a
consumer may want the card under the cursor, or a stroke, or a box, or a count, so what to draw cannot be
the library's decision. It takes no flags — the first build passed some, and having to decide what
`isCarried` should say to a slot that _is_ the carried thing was the sign the argument did not belong there.
Nothing about the copy is interactive: it is not hovered, not focused, not a landing place, and whether it
is disabled is on the item already. A consumer whose painter wants flags supplies a resting set, which is
what the Playground does in one line.

It is portalled into the `Viewport` layer like every other floating element, positioned by transform, sized
from the item it copied, and offset so the card does not jump to its own corner on the first move. Its
pointer position comes from a document-level listener rather than the drag's own moves, so a tap-to-place
carry gets a preview too — the pointer is still there, it is simply not held down.

**That listener also does the aiming, and a tap-carry is what proved it has to.** A carry knows which of
three ways it began — `drag`, `tap` or `key` — because the three differ in what may drive them, not only in
how they read out. A tap-carry has no button held, so its moves never reach the item and the first build
aimed only on the drag's own moves: the copy followed the cursor while the landing place stayed where the
card had been picked up, and the drop then landed somewhere the page had never marked. The document listener
re-aims for `drag` and `tap` and leaves `key` alone, since a stray mouse must not overrule an arrow key.
**With the pointer aiming, the click that drops must not aim again** — it used to re-aim at the center of
whatever card was clicked, which is a second source of truth and quietly beat the first. **It is `pointer-events:
none`, and that is load-bearing rather than tidy**: the drop target is resolved by asking what sits under
the pointer, and this element sits exactly there, so a hit-testable preview would answer for every drop.

**A row sizes its items to their content and scrolls; a column stretches them and does not.** The first
build passed `sizing="fill"` to every item whatever the direction, copying `Select`'s options — which are
always stacked. In a row that is `width: 100%` on each of several items in one flex line, so they were
squeezed under one another's content and the text spilled out of the list. Sizing is direction-aware now,
list children are `flex: 0 0 auto` so nothing is compressed below what it says, and the list scrolls on its
own main axis when the items do not fit. **The marker offset therefore adds the list's scroll position**,
because it is written as a `left` or `top` against the padding box while the rects it is derived from are
viewport-relative — the two only agree at a scroll of nought, which is the only place it was ever tested
before this.

**A move inside one list is a single write, and a move between two is batched.** The commit used to take the
item out of one array and put it into another as two separate signal writes, which renders once with the item
missing — `<Index>` disposes and rebuilds a slot around that gap for no reason. `moveAt` does a same-list move
in one write and `batch` covers the cross-list pair.

**The index the state machine holds is where the item will end up, not where it would be inserted, and that is
the whole of a bug that shipped once.** The two landing places either side of an item are the same place: an
item put "after itself" has not moved. Counting in landing places therefore spends the first press of an arrow
key going nowhere, which reads as a broken control. So the carry holds a **settled** index — the position in
the list once the item is out of it — and `computeSettledIndex` converts a pointer's landing place into one on
the way in, while `computeMarkerIndex` converts back on the way out so the marker draws between the right two
items. Two presses move two places, which is the only behavior anybody expects.

**Pointer capture is why the target is found by hit-testing rather than by `pointerenter`.** The drag captures
the pointer on the item so that moves keep arriving after the pointer leaves it — which is also why no other
element ever receives an enter or a leave for the rest of the gesture. The target is therefore resolved by
asking `document.elementsFromPoint` what is under the pointer and matching against the registered lists.
**By containment, not by identity**: the topmost element at a point is whatever the consumer painted, and a
list that only recognized itself when the point landed on its own box recognized itself almost never. That was
the second bug, and it presented as a drag that did nothing at all.

**A list refuses an item before it is offered as a destination, not at the drop.** `computeCanAccept` is
consulted when `Tab` builds the ring of destinations, so a keyboard user is never taken somewhere that will
turn them away and told so only on pressing `Enter`. `isLocked` is the coarse form of the same thing — a list
that can be reordered from inside but takes nothing from outside.

**`InteractionWrapper` owns `tabIndex`, so the roving stop goes through `isTabbable` and nowhere else.** The
first build wrote `tabindex` on the item element in JSX **and** passed `isTabbable={false}` to the wrapper,
copying `Select`'s options — where an option is never a tab stop because the combobox is. Here the roving item
**is** the tab stop, and the wrapper's write landed after the JSX one, so every item ended at `-1` and the
whole list was unreachable by `Tab`. Nothing on screen showed it: every spec that drove the keyboard had
focused an item programmatically first. One writer for a DOM property, the same rule `BinarySwitch` states for
`checked`.

**The list root and the items both set `pointer-events: all`.** `interactionRoot` sets `none` and expects a
control to opt back in, which `Select`'s options already record. Missing it here produced a drag that never
started, with a keyboard route that worked perfectly — the failure mode that rule exists to warn about.

**Every example on the Playground page carries its own group id, which is not a detail.** They shared one at
first, so `Tab` while carrying cycled through the lists of _other examples on the same page_ and a card could
be carried out of the demo it belonged to and dropped somewhere off-screen. A group id is a namespace, and a
page mounting several independent instances has to say so.

**_Elsewhere._** React Aria is the only one of the three with drag and drop, through `useDragAndDrop` shared
with its lists, and its keyboard route is the same pick-move-drop this one implements. Radix and Ark UI ship
nothing in this family, which matches the backlog's note, at the time, that nothing had asked for it. The packages that own the
problem outright — SortableJS, dnd-kit — are pointer-first: dnd-kit ships a keyboard sensor and SortableJS has
no keyboard route at all, which is the same gap `SlideButton`'s entry records for swipe-to-confirm widgets.

### `Sortable`, and telling somebody an item can be moved before they press anything

Settled by the user, on 4.1.2. A `Sortable` item is a focusable `role="listitem"` with Enter and arrow
handlers, so a screen reader announced a static list entry and gave no hint that Enter did anything.

**The gap was narrower than it looked, which is what decided the smaller fix.** `Carrier` already announces
pick-up, every move, the drop and the cancel through a polite live region — so once Enter is pressed the whole
carry is covered. What was missing is the advertisement on a _resting_ item. A discovery gap, not a silent
control.

**So the list roles stay and the item gains `aria-roledescription` plus an `aria-describedby`** pointing at
hidden text. `listbox`/`option` was rejected: `option` means selectable, reordering is not selecting, and
`aria-selected` on the carried item would claim a selection nobody made. `aria-roledescription` is also already
the house idiom — `Wheel`, `Carousel`, `Cuboid`, `FlipCard` and `Barrel` all carry one.

**The resting sentence is `announcements.restingKeyHint`**, beside the carrying sentence `keyHint` already
supplied, and it lives on the component's announcements rather than on `CarrierZone` because it is words the
consumer writes and the component renders. `SortableGrid`, `Table` and `Timeline` carry the same member, and
`PatchBoard` carries one per kind of target, `nodeRestingKeyHint` and `socketRestingKeyHint`; each renders it
in hidden text its resting items describe themselves by.

**The hint element lives outside the list root.** Put inside it, it became a child the list's own placement and
hit-testing walked, and five specs went red. It is a sibling now; `aria-describedby` works by id wherever it
sits.
