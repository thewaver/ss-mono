# Survey: Essentials against the reference libraries, and Exotics add-ons

Read-only survey. Reference set: Kobalte, Ark UI, Radix, MUI, Ant Design, Mantine, Chakra, PrimeReact. The render-slot pattern and the absence of shipped styling are stated intent and are not listed. Anything already in `backlog.md` is cited by item number rather than re-proposed. Findings that have since been fixed are removed rather than marked, so everything here is open. Parts 1 and 2 are closed: every item was fixed or built, recorded in `decisions.md`, or moved to `backlog.md` (the submit story is item 28; the scroll area sits at the bottom of item 4's list).

## How Part 3 is to be run, for the next session

Parts 1 and 2 were decided in chat, one item at a time, with the owner answering by letter. Part 3 is to be run
by one Opus agent in two steps, so the owner reads once and answers once.

**Step 1, the discussion document.** The agent reads this file's Part 3, `conventions.md` ("API naming" and
"Control architecture"), and the `decisions.md` entry for each Exotic it writes about (search the component's
name in a `###` heading), then writes one document and publishes it as a page the owner can read at leisure. For
every add-on idea in Part 3, in the order listed here, one section with:

1. A heading carrying a number and the component and idea, so the owner can answer "12: B".
2. **What it is**, in two or three sentences of plain words: what a person does and sees. No jargon, no idioms,
   no unexplained acronyms; a term of art is defined in the sentence it first appears in.
3. **What is here already**: the props, abstracts or helpers the idea would stand on, named.
4. **The sidecar answer**, which the owner asks of every item: can this be had through one or two props on the
   existing component, or through a Playground example with no library change? Say yes or no and why.
5. **Options**, each with a letter in its heading, `A`, `B`, `C`, never numbers. The recommended option is
   always `A`, and the recommendation is never shuffled. Under each: `Pro:` and `Con:` bullets, one line each,
   nothing else. An option that is a non-starter is still listed with its reason as its con. The usual set is
   build as a prop or example / build as a component or mode / backlog or drop, but only where each is real.
6. **My lean is X**, one line, with the reason if it is not obvious from the cons.

Two rules from the house apply to the whole document: paint is the consumer's, so any idea that is only a look
is answered "an example, or nothing"; and WCAG outranks everything, so an idea that adds a drag names its
single-pointer route (2.5.7) and an idea that adds motion names its reduced-motion behavior.

**Step 2, after the owner answers.** The owner replies with one letter per number. The agent (or a fresh one,
handed the answers and this file) records each verdict in bold at the start of its Part 3 bullet, exactly as the
Part 2 bullets were recorded, then builds every `A`/`B` that means work, under the same rules the earlier waves
used: no comments in `components/src` or `playground/src` except `/** */` on `*.utils.ts` exports and props-type
members; defaults in `.const.ts`; no spoken or displayed English in the library; both typechecks and `vitest`
clean; no edits under `e2e/`, reporting any spec expected to go red with its assertion; a lift-and-paste
`decisions.md` entry per settled point, which the session then pastes; `backlog.md` and `brief.md` updated
together for anything backlogged or dropped to the bottom of the list; and finally every implemented bullet is
removed from this file, so it holds only what is open. The full Playwright suite is run once at the end, by the
session and not by parallel agents, and any red is put to the owner, since a red spec may be describing behavior
the owner just decided against.

## Part 3: Exotics, possible add-ons

None of these repeats Open discussion (animation-collection ideas, CardFan, split-flap, magnifier, ticker, marquee selection, Minimap, ExplodedView, Flipbook) or items 1, 19, 22, 25, 26, 27.

- Bracket: a flag on each node for "on the focused entrant's route to the final" so a whole path lights (small; `parentId` exists). Round-header slot per layer (small). "Advance the winner" helper (small). Losers' bracket for double elimination (large).
- CardStack: `recall` command bringing the last card back along its exit path (small to medium). `allowedDirections` so an upward swipe is refused (small). `onLow(remaining)` callback for loading more (small).
- CellAnimation: reverse or alternate direction per pass, like CSS `animation-direction` (small). A progress signal to scrub the pass from a scroll position or slider (medium).
- Corners: a mode where the marks glide to frame the focused or hovered element, a moving focus bracket (medium; Anchor and ElementObserver measure). Draw-on mode where arms grow from the corner (small).
- Cuboid: `faceSignal` turning to a named face by the shortest route (small). Drag to turn, snapping to nearest face (medium; the turn signals stay as the non-drag route).
- FlipCard: turn toward the side pressed (small). A ratio signal for a partial turn, to peek at the back (medium).
- Formation: animate between layouts when `computeLayout` changes, optionally staggered (medium). Key items by identity rather than position so removal does not shift neighbors (small).
- Mosaics: animate the re-pack on add, remove, resize (medium). Keyboard walk in reading order with an activation callback (`readingIndex` exists) (medium).
- Odometer: extra full turns before settling, staggered per digit, for a slot-machine reel (small; a mode, not the rejected split-flap). Animate slot width when digit count changes (small to medium).
- ParticleSpawner: `emit(count, fromElement?)` for a burst on demand, such as confetti from a pressed button (medium). Source elements alongside targets, many-to-many (small).
- PatchBoard: pan and zoom (medium; Timeline has the window arithmetic). Snap-to-grid on drop and keyboard move (small). `computeCanLink` helper refusing a cable that closes a loop (small).
- PointerEffects: a light point supplied by the consumer, so a moving sun lights a set of these (medium). Smoothing factor so the effect trails the pointer (small). Device tilt on phones (medium; iOS permission).
- Reveals: Reveal window moved by arrow keys, and an optional automatic path for a demo mode (small to medium). ScratchCard named zones each reporting its own cleared share (medium).
- RichText: map a tag to a component, not only a class, so `<term>` renders a Tooltip (medium). Allowed attribute list such as `href` on `<a>` (small).
- Satellite: several satellites around one subject (small). Flip to the other side when cut off by the viewport, using Anchor's arithmetic (small).
- ScanlineAnimation: vertical lines as well as horizontal; it always cuts rows (`col: 1`) (small). Gets CellAnimation's reverse and scrub for free.
- ScrambleText: scramble only the characters that differ between old and new text (medium). Glyph set per position: digits among digits, letters among letters (small).
- ScreenWiper: an origin point so the wipe radiates from the press (small to medium). Automatic in, hold, out sequence with `onCovered`, the moment to swap page content on a route change (small).
- Shape: morph between two point sets of equal length (medium). Expose the outline as `shape-outside` so text flows around it (small).
- SortableGrid: blocked cells nothing may land on (small). Optional compaction pulling items upward after a move (medium). Resize an item's footprint by dragging an edge, with keyboard route (medium to large).
- Staircase: complete. At most a connector slot between steps, in Stepper's shape (small).
- TileBoard: reach and path helpers on `getNeighborTiles`: every tile within N steps, shortest route avoiding disabled tiles (small to medium). Drag across tiles to act on each passed over, with press-per-tile kept for WCAG 2.5.7 (medium).
- Timeline: a playhead or "now" marker driven by a signal (small). Drag an item's edges to change its span, with keyboard route (medium). Automatic lane packing when `computeLane` is left out (small).
- Trail: several travelers at fixed spacing, a convoy (small). Progress from the page's scroll position, a helper over `progressSignal` (small).
- Typewriter: erase and retype through a phrase list (medium). Caret slot following the last character (small). Per-character weights as ScrambleText has (small).
- Wheels: flick to spin, strength deciding turns, `spin` kept as the single-pointer route (medium). Several drum reels spun together stopping one after another (medium).

## Verification left open from Part 1

`e2e/rightToLeft.spec.ts` covers Tabs, RadioGroup, Calendar, SplitPane, Menu, Sortable and Tree under `dir="rtl"`. Not yet covered, each needing a right-to-left demo first: Table (resize drag, click-to-step, Shift-arrow column move, drop markers), Clock, TagInput's hop between field and tags, Range's choice of thumb, RangeCalendar, ContextMenu, a pointer drop into a mirrored Sortable row and where its marker sits, a consumer-set `submenuPlacement` inside a right-to-left box, and flipping `dir` while the page is live.

## Verification left open from Part 2

The new pages (HoverCard, Listbox, Menubar, CheckboxGroup) and the new examples (TextInput suggestions, PIN, editable text, knob, meter, ring, month and year pickers, table of contents, copy button, cascader, richer tour, pressed toolbar) have no specs. Not yet watched in a browser: the knob's pointer drag (Range refusing the native thumb), HoverCard's Tab route, and the menubar's arrow handoff between open menus.
