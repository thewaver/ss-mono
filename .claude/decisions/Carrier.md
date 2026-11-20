# Decisions: `Carrier`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Carrier` speaks in the consumer's words, and the zone carries them

The convention _"The library says what a component is, and nothing else a reader hears"_ landed on the drag
engine hardest, because it is the component that talks most: pick-up, every nudge, every zone change, the drop
and each way a drop can fail were eight English templates inside `Carrier.utils.ts`, and the four zones added
their own key hints and place labels.

**The words ride on the zone.** `CarrierZone` gained `getAnnouncements: () => CarrierAnnouncements`, eight
`compute*` functions taking the parts the engine knows (the item's label, the zones' labels, the place label,
the key hint). The engine reads the source zone's words for pick-up, cancel and left-in-place, and the target
zone's for aimed, entered, refused and dropped, because that is the zone whose consumer knows what a "place"
there is called. A module-level `announcements` would have been simpler, and wrong: two lists on one page can
belong to two consumers with two vocabularies.

**Each drag component takes one required `announcements` prop, typed for itself.** `SortableAnnouncements`,
`TableAnnouncements`, `SortableGridAnnouncements` and `PatchBoardAnnouncements` each extend the shared type with
the strings only that component has — a resting hint, a place label built from an index and a count, a column
move, a socket's name. Indexes handed to these count from zero, like every other label prop. Capitalizing the
first word is the consumer's, so `startSentence` went; a sentence's shape is not the library's to know.

**The resting hint is an announcement string, not a zone member.** `Table`, `SortableGrid` and `PatchBoard` once
each defined a `getRestingKeyHint` on their zone that nothing displayed, so the member left `CarrierZone`. The
hint came back as a string in each component's own announcements — `restingKeyHint` on `Sortable`,
`SortableGrid`, `Table` and `Timeline`'s edge announcements, and `nodeRestingKeyHint` plus
`socketRestingKeyHint` on `PatchBoard`, which has two kinds of thing to pick up — and each component renders it
in hidden text that its resting items point at through `aria-describedby`. A zone never builds it: the words
are the consumer's, and the component is the one that owns the element carrying them. Why a resting item
needs the hint at all is argued under _"`Sortable`, and telling somebody an item can be moved before they
press anything"_.

**The same pass made the label props required everywhere a default had been English.** `Carousel`'s
`computeSlideLabel`, `computeStepLabel` and `computeRotationLabel`, `Wheel`'s `computeWedgeLabel`, `Paginator`'s
`ariaLabel`, `computePageLabel` and `computeStepLabel`, `Cuboid`'s and `FlipCard`'s `computeFaceLabel`,
`CardStack`'s `computeCardLabel`; each `STEP_LABELS`- and `FACE_LABELS`-style constant went with it. The role
descriptions those components spoke ("carousel", "slide", "wheel", "wedge", "sortable item", "box", "face", "flip
card", "card stack", "card") stayed as defaults in each `.const.ts` behind `roleDescription` and an inner
`*RoleDescription` prop, the one exception the convention allows. The Playground keeps the text in
`PageComponents/Announcements/Announcements.const.ts`, word for word what the library used to say, so the specs
that listen for it still hear it.

**The pickers and color controls followed, and two format hints turned out to be text too.** `DatePicker`,
`DateRangePicker`, `TimePicker`, `DateTimePicker`, `ColorInput` and `ColorArea` had labels with English defaults
("Open the calendar", "Choose a color", "Saturation"); the defaults went and the props are required, which
emptied `DateTimePicker.const.ts` and so deleted it. `DateInput` and `TimeInput` were building their placeholder
hints from "yyyy", "mm", "dd" and "hh", "mm", "ss", which a page displays and a consumer could not change, so
each takes them per part now (`partHints`, `segmentHints`) and still owns the order and the separators, which are
the format's and not the language's. `ColorInput` gained `areaAxisLabels` for the `ColorArea` it draws itself.
The library's remaining English is developer-facing: a console warning, an error message.

**`Table`'s words are required exactly when its columns can move.** A table without an `order` never speaks
any of them, so `TableOrderProps` is a union: `order` and `announcements` together, or neither. It is the
same shape as `Modal`'s two names, chosen by the user over a prop that every read-only table would carry unused.

**The three zones that had no resting hint now have one, in `Sortable`'s shape.** A hidden element inside the
component carries the sentence, and every element the keyboard can move points at it with `aria-describedby`: a
`SortableGrid` item and both a `PatchBoard` node and socket, which Enter picks up, and which pick up different
things and so say different sentences (`nodeRestingKeyHint`, `socketRestingKeyHint`); and a reorderable `Table`
header, which Enter does not pick up. Enter and Space sort there and Shift with an arrow moves the column
directly, so the header's sentence names Shift with an arrow instead. The user's call, for
the reason the `Sortable` entry gives: a focusable thing that moves and no advertisement of how is a discovery gap
on 4.1.2. `Table`'s hint lives inside the `order` union with the rest of its words.

### The carry engine stopped counting in indices, and holds a place the zone defines

`SortableGrid` is what forced this, and the shape of the problem is worth stating before the answer. Every
question `Sortable` asks of a carry has one number behind it: the item is at place 4 of 7, an arrow key makes
that 5, the pointer's landing place is worked out by walking the item rects until one's middle is passed. A
grid has none of that. An item there holds an area rather than a slot, positions are a pair of coordinates
plus a footprint, nothing closes ranks when an item leaves, and — the part with no equivalent at all in a
list — the place being aimed at can be one that cannot be taken.

**Three ways to have both, and the middle one is the one that was rejected out loud.** A grid could register
as an ordinary zone and count its cells row by row, which costs nothing up front and cannot say "does not
fit" at any price: an index has no room for a footprint, a turn changes which cells the same index covers, and
every piece of the settled-index arithmetic would need a bypass, leaving an engine shared in name only. Or a
grid could have its own stack beside `Carrier`, which keeps its rules to itself and produces the second
state machine the whole of _"why a drag is the least important of its three routes"_ was written to avoid —
and forecloses a list and a grid ever exchanging an item, since neither registry can see the other. So the
engine was generalized instead. **The user chose this, with the three set out as they are here.**

**A place is opaque to the engine, and the zone answers every question about one.** `CarryState` holds
`fromPlace` and `toPlace` as `CarryPlace`, which is `NonNullable<unknown>` rather than plain `unknown` so that
`CarryPlace | undefined` still means something — a zone returns `undefined` to refuse. The zone gained the
seven questions the stack used to answer for itself: where a point lands, what a nudge does to a place, where
`Tab` arrives, whether two places are the same, whether a place may be committed, what a place reads as out
loud, and what the keys are. `Sortable` and `Table` define their place as a number and are otherwise
unchanged; `SortableGrid` defines it as a spot and a turn.

**Each zone casts at its own boundary rather than the engine carrying a type parameter.** A module-level
registry of zones with different place types cannot be typed without either a generic that erases at the
array or the bivariance trick of writing the members as methods, and both cost more to read than
`const asIndex = (place: CarryPlace) => place as number` at the top of the zone that owns the meaning. The
precedent is already there: `carry.value` has always been `unknown` and every zone has always cast it.

**An arrow key sends a nudge rather than a step, and that is what kept rotation off the engine.**
`aimAtIndex(±1)` became `aimAtNudge({ x, y, turn })`, all three optional. A list adds `x` and `y` — it has one
axis, so only one of them is ever set — and ignores `turn` by returning the place it was given, which the
stack reads as no change. A grid uses all three. The alternative was a second call on the stack for turning,
which would have put a notion the engine has no use for into the engine.

**The zone owns all of its keyboard words, because "Tab changes list" is wrong in a grid.** `getKeyHint` is
handed one fact the zone cannot know — whether there is anywhere else to Tab to — and returns the whole
sentence. The stack composing a hint out of clauses would have to know what kind of container each zone is,
which is exactly the knowledge this change removed from it.

**A place that cannot be committed is still a place you may aim at.** The refusal happens at the drop and
nowhere earlier: aiming freely is what lets the grid paint the footprint in red where it will not go, and a
control that silently slid the aim to the nearest legal spot would be answering a question the person did not
ask. `getIsTargetAllowed` is what a painter reads, and `end` turns a refused drop into the announcement
_"X does not fit in Y, returned to Z"_ with nothing written.

**A foreign list has one landing place more than it has items, but only while something is being carried into
it.** The count used to come from `computePlaceCount`, which the stack held; it now comes from the zone's own
place label. The drop announcement is composed after the commit — it always was, so that it reads the list's
new length — so a place count that still added one for a carry would say "place 2 of 4" of a list holding
three. Reading it off whether a carry is in flight at all is correct at both moments and needs no argument
passed in.

**Two things about `Sortable` changed with it, and only one is a rename.** `computeCanAccept`'s second
argument is documented as the label of the list an item is coming from and was being handed `carry.groupId`,
which is the namespace the lists share — every consumer filtering by origin was reading the same string for
all of them. It now gets the source zone's label. And `SortableTransfer.fromIndex` is optional, because an
item arriving from a grid has no index to report; a list-to-list transfer is unchanged.

#### A `Sortable` under `sizing="fill"` painted a bigger target than it would accept

Found on the `SVGFilters` page, where the two step lists sit in equal columns and the empty one is a wide, short
box. Dragging into it worked from some approaches and not others, which is the shape of a hit area that does
not match what is drawn.

**The list and the box around it are two different elements, and only one of them was filling.**
`InteractionWrapper` renders the root, and the control it wraps comes back from `renderControl` — for
`Sortable` that is the `<ul>`-equivalent carrying the items. `sizing` is set on the **root**, and so is
`renderDecoration`, which is what paints the dashed empty-list surface. The root is `display: flex`, so a
child stretches on the cross axis and is content-sized on the main one; the list had no flex properties of
its own and therefore defaulted to `flex: 0 1 auto`. Under `fill` the root and the decoration went to the
full column width and the list stayed at its content width — eight pixels when it holds nothing. The
consumer sees a wide dashed rectangle and can only drop inside a sliver at its left edge.

**`CarrierUtils.findZoneAt` is what made it directional.** It reads `document.elementsFromPoint` and takes
the first element that is, or sits inside, a registered zone root — and the zone root is the list, not the
wrapper. So the painted area outside the list belongs to no zone at all: crossing the sliver registers, and
approaching the same rectangle anywhere else never does.

**The fix is `flex: 1 1 auto` on the sortable root**, so the list fills the box the decoration already
fills. It changes nothing under `fit-content`, where the root shrink-wraps its content and growing has
nowhere to go — which is why the `Sortable` page never showed this, its lists all being `fit-content` and
therefore honest about their own size, including the empty one at eight pixels wide. The root already had
`flex-shrink: 1` by default, so only growing was added.

**The general rule this settles: a control that fills its wrapper has to fill it too, not just be painted
into it.** Anything using `InteractionWrapper` with `sizing="fill"` and a decoration is exposed to the same
mismatch, and for a carrier zone it is not cosmetic — the decoration is the only thing telling a person
where they may drop.
