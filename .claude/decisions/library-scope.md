# Decisions: library-scope

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### What the library covers, and the controls it will not get

**What the library lacks cannot be inferred from the Playground**, and reading it as the evidence for what is missing
is the trap: every control on every page and in every props panel is now a library control, so the
Playground has nothing left to say about what the library lacks.

**The library is the HTML layer, and that is what decides whether a thing belongs here at all.** The user's
statement of scope: accessibility, layout and structure — the half that Canvas and WebGL game engines neglect.
Anything that wants a drawing surface is the consumer's, and which one they reach for is theirs to choose. So a
sprite sheet, a particle system and a renderer are all out of scope by construction rather than by priority,
and a proposal that begins "the library could draw…" has already answered itself.

**Dropped by the user, so not re-proposed:** a segmented control and a rating input, each now a variant on the
Radio page, which is the whole of what it was; and the pure-paint family of `Skeleton`, `Avatar`, `Badge`, `Card`
and `Icon`, which was never a component question — the Playground already builds three of them as `Surface`
examples. None of these is an accepted limit, because none is a fault; they are simply not wanted.

What the built controls left behind as gaps is recorded in `decisions.md` rather than reopened as items: a
breadcrumb trail cannot collapse when it is too long, a tag input has no cap, no in-place editing, no
paste-a-delimited-list and no reordering, a split pane cannot collapse a pane or reset on a double-click, and a stepper draws no connector of its own
and does not enforce that a linear flow stays linear.

**_Elsewhere._** Ark UI's set is the widest of the headless libraries and is the most useful scope check
available: it has a tree view, a pagination component, a **segment group** — a segmented control as its
own component, distinct from both tabs and toggle group — and a `Field` plus a `Fieldset`. It has no
table and no data grid. TanStack Table is what that gap gets filled with, and it is a separate project
with its own release cycle, the scope check for what a data grid is.

- **Breadcrumbs is owned by at least one of them:** React Aria ships `Breadcrumbs`.
- **Pagination is owned because it is arithmetic, not paint.** Ark UI's takes `page`, `pageSize`,
  `count`, `siblingCount` and `boundaryCount`, computes the visible page range and where the gaps fall,
  and switches between buttons and links with a `type` prop. That is more than a composition of `Button`,
  which is the argument the list lost — `Paginator` is built, and where it departs from that shape is in
  `decisions.md`.
- **Worked examples of each, read on 2026-08-15**, which is what the user's ordering above was taken from:
  [TanStack Table](https://tanstack.com/table/latest/docs/overview),
  [React Aria Breadcrumbs](https://react-aria.adobe.com/Breadcrumbs/useBreadcrumbs.html),
  [Ark UI Segment Group](https://ark-ui.com/docs/components/segment-group),
  [Ark UI Splitter](https://ark-ui.com/docs/components/splitter),
  [cmdk](https://cmdk.paco.me),
  [Ark UI Tags Input](https://ark-ui.com/docs/components/tags-input),
  [Ark UI Rating Group](https://ark-ui.com/docs/components/rating-group) and
  [Ark UI Steps](https://ark-ui.com/docs/components/steps). Ark UI carries five of the eight, which is the
  scope check this item already leaned on. Two details from those pages are worth keeping: the splitter
  admits non-panel children such as toolbars and status bars inside its root, so it is not simply two boxes
  and a drag; and the tags input sets the mobile keyboard's Enter key to read "Done", which is the kind of
  thing only found by using one on a phone.

### Four components arrived from a React codebase, and all four are `Exotics`

Placed there by the user, who wrote the originals: `Satellite`, `Staircase`, `Formation` and the two wheels.
Recorded because `Exotics` had no written definition and now has four more members, so the next arrival will
look for the rule.

**Derived rather than stated, and marked as such**: the four have in common that they render DOM, hold no
user-editable value, and are not compositions of `Essentials` — which is what would separate the folder from
its neighbors if a rule were written, rather than anything about how unusual a thing looks. All four lay
elements out or turn them; none is a control, and none is a `Surface`-style assembly of other components. The
user's call was where these four go; whether that is the general test is theirs to make.

**None of the original names survived unchanged, and two could not have.** `Tree` was already taken by the
`Essentials` control, and `DecorationWrapper` would have given the library a second meaning for
"decoration" — `InteractionWrapper.renderDecoration` is the full-box overlay behind a control, which is a
different mechanism. `Staircase` was kept, `Satellite` and `Formation` chosen with the user, and `TopWheel` /
`SideWheel` first became `FlatWheel` / `DrumWheel` on the argument that "top" and "side" describe where the
camera is rather than what the object is.

**That argument was overturned by the user, and the wheel is now `OverheadWheel`.** Where the camera stands is
exactly what distinguishes these two, and "flat" named the absence of perspective rather than the view — a
property of the drawing, not of the thing. `OverheadWheel` was taken over `TopWheel` because "top" reads as
topmost or best for a moment before it reads as a viewpoint, at the price of a longer name than the library
usually carries. `DrumWheel` keeps its name: "drum" names the object and needs no viewpoint to be understood,
so the pair is deliberately mixed rather than forced into `OverheadWheel` / `SideWheel`.

**What came across as paint stayed out of the library.** The originals shipped a leaf painter with five SVG
shapes, a wedge painter, a pointer, a banner and a starfield. `Shape` and `ShapeConst.getDefaultShapePoints`
already draw the first, and the rest are the consumer's half — they live in `StyledComponents` and are what
the Playground pages are made of. Nothing was lost: every one of them is on a page and reachable from source.
