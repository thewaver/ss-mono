# Decisions: playground-api-view

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Every props row carries its own explanation, and the default comes from the field rather than from the caller

A props row now renders a circled `?` beside its label, and hovering or focusing it opens a tooltip holding
one sentence about what the row drives, with the row's default value on a line of its own beneath. It uses
the `Button` + `tooltipDefs` route the example cards' source button already uses, so nothing new was added
to the library to carry it.

**`hint` is required on `PageProp`, for the same reason `key` is.** An optional one would let the next row
arrive without an explanation, and the whole point is that every row has one. Required means the compiler
names every site, which is how all 263 of them were found rather than by grepping for `label=`.

**A knob owns its explanation, beside its range, its step, its label and its default.** `SampleKnob` gained
a required `hint`, so `PageKnobs` reads it off the knob rather than being handed one per page — the knob
records already travel by family, and a hint written per consuming page would be written several times and
drift apart. The knob records now live in the Playground rather than beside the samples — see
_"The library holds a tunable's default and nothing else"_ in `conventions.md` — and the `hint` is still required there.

**The default value is reported by the field, not written at the call site.** `useFieldReset` already
captures each field's value at mount, because that is what its reset restores; it now also reports that
value up to the enclosing `PageProp` through a second context declared beside the reset one. Writing 263
defaults by hand was rejected: half of them are expressions rather than literals, and a hand-copied number
goes stale silently the first time a starting value is tuned. Reporting it means the tooltip cannot disagree
with what Reset does, because both read the same capture.

**A field whose value outlives it is reset to the value it is told, not the one it mounted with.** A layout's knobs
are held per layout in a store, so switching layouts and back rebuilds the fields with whatever was last set, and the
capture made Reset restore that: an item height set to `0.45` stayed `0.45` after a round trip through another layout,
on InfiniteCorridor's page and on Formation's, in all four Playgrounds. `PageNumberField` and `PageCheckField` now take
a `resetValue`, read when Reset is pressed, and `PageKnobs` hands each one the layout's default; a field without one
keeps restoring its capture.

The context lives in `PageComponents/Field/Field.context.ts` rather than beside `PageProp`, which puts the
registry next to the code that already computes the value it carries.

**A row holding more than one field shows no default at all.** `Colors` is four swatches, `Cell count` is
two numbers, and the corner rows are one field per corner; with several reporters there is no single value
the label stands for, so the line is dropped rather than showing whichever mounted last. The same row with
individual corners switched off renders one field and does show its default, which is correct rather than a
special case.

**`PageKnobs` passes its default explicitly and overrides the capture.** A knob's value survives switching
away from its family and back, so what the field holds at mount is the last value it was given rather than
the knob's default — the knob record has the real one, and an explicit `defaultValue` wins over the report.

**Booleans read as `on` / `off` and everything else prints as it stands.** An empty string and an absent
value both drop the line.

**Every knob also says what it controls, in a required `controls` line between the hint and the default.** The
user's call, and the wording is theirs. Three shapes: a knob whose value reaches a prop as it stands reads
`Sets <Type>.<member>` (`Sets WheelProps.spinDurationMs`, nested paths allowed:
`Sets GlassSurfaceProps.glassDefs.noise.frequency`); a knob the example turns into something else before handing it
over gets a short sentence naming the prop it ends up in (`Sets the length of the slice of example prizes sent to
WheelProps.wedges`); a knob nothing in the component ever sees reads `Examples only prop`, the shared
`EXAMPLES_ONLY_PROP` in `Prop.const.ts`. The Playground's own panels — navigation settings, a panel's reset row —
count as the last. It is required on `PageProp` and on `Knob` for the reason `hint` is: the compiler names every
site.

**A shared knob record names the helper's option type, not the component prop it ends up in.** The user preferred the
directness of naming the component prop but took this to keep the records shared: a record such as the arc layout's
or a tracked gradient's is shown on several pages for different components, so a sentence naming one component's
prop would have to be written per page. So `PlacementLayoutKnobs.ARC_KNOBS.radius` reads `Sets ArcDefs.radius`, and
the gradient records name the type that declares the member (`GradientFalloffOpts.coreStop`) rather than the
intersection it was read through. Where one knob constant served two declaring types, it is split by a spread with its
own `controls` (`BAND_CORE_STOP_KNOB`, `SWARM_STIFFNESS_KNOB`). A record used by one page only, such as Particle
Spawner's travel knobs, names the component prop. `PagePaintPicker` takes the prop path its paint goes to
(`propPath`) and builds both of its lines from it.

**One spec locator moved.** `tileBoard.spec.ts` picked its shape select with `[data-prop][…] button` and
`.first()`, which the hint button would have answered instead; it now asks for `[role="combobox"]`, which is
what every other spec in the suite already does. This is the same trap `e2e/helpers.ts` records for the
example cards, where a source-code button beside the title is why `demo()` exists.

### A component page is two routed views, and the Docs one is read off the published type

Each component page is Docs and Examples, and which one you are on is a URL rather than component state, so a
view can be linked to and the back button walks them.

**There are three views again: Docs, API and Examples.** They were two tabs at first (Docs the description,
API the export tables), then merged into one Docs tab holding both, because the tables had become most of what a
reader learns and the Docs tab was one paragraph. The user reversed that when starting the documentation refactor
with `Button`: Docs at `/docs` is the description alone, API at `/api` is every table plus "On this page". The tab
order is Docs, API, Examples; a page with no examples still has only Docs and API, and still opens on `/docs`.
Cross-page links in "Also has everything in …" now point at `/api`. The `data-api-*` attributes keep their
name, `virtual:component-api` too, and the shared files (`DocsView.css.ts`, `.const.ts`, `.utils.ts`) keep the
`DocsView` name for now although the API view is what uses most of them; the tables are `ApiView` in Solid, with
its own `BasePageApiViewValues` in the shared half. The other three frameworks still have the merged Docs view
until ported.

**Examples is the index rather than a segment of its own.** `/button` is the Examples view and `/docs` and `/api`
are added. Giving Examples a segment would have renamed every address in the Playground and every
locator in the suite for no gain, and the bare route is what the pages already were.

**The tab bar lives in the shell, not in the pages.** `AppContent` already renders the title and the
dependency chips above the routed outlet, so the tabs go there too and no page file was touched. What did
have to change is the config lookup: it keyed off the exact pathname, so `/button/docs` found nothing and
the whole header — tabs included — disappeared on any view but the first. It resolves the base route now.

**The description moved out of the header into Docs.** The consequence is that landing on a page no longer
shows the description; reaching it is one click.

**The props table is read off the published type at build time, not written by hand.** `virtual:component-api`
is a vite plugin in the shape of the dependency one, except that it drives the TypeScript compiler rather
than a regex: a regex cannot see through `AccessorProps<{…}> & {…}`, and the checker flattens exactly that
into the property list a consumer actually has. Hand-writing the tables was rejected outright — a hundred
and twenty components' worth of prop names and types, every one of them free to drift the moment a type
changes and nothing to catch it.

**The Docs view loads only when the Docs tab is opened, and it fetches only its own component's tables.**
Imported from the shell, the tables made every page pay for them on first load, the Examples view included, which
never reads them. So the Docs route loads its view on demand in all four Playgrounds, and that view asks
`virtual:component-api` for a list of per-component loaders and calls the one it needs — about 8 KB for most
components rather than 1.5 MB for all of them. Both kinds of module come back with an empty source map: without
one, the dev server wrote a 6 MB map for 1.5 MB of generated data that points back at no file anyone could open.
How the tables get built is under _"The props tables are built beside the dev server"_, below.

**Every page loads on demand, through each framework's own router.** The route list is one static table, and
when it imported every page, the first view of any address fetched all hundred-odd pages: about 2,000 files,
where half that is enough. Solid and React wrap each page in `lazy` through a local `lazyPage` in `App.const.tsx`,
since their pages are named exports; React's routed outlet sits inside `Suspense` because its `lazy` requires
one. Vue and Svelte hand the router the import itself, `() => import(…)`, which vue-router and sv-router both
load on demand. What remains on first load is mostly the library, because every page imports it through its
single index file.

**The type column shows the type as it is written, not as the checker resolves it.** They differ because
the props sit inside `AccessorProps`, so the written side is the value a prop carries — `boolean`, `TabsDir` —
and the resolved side is `MaybeAccessor<boolean> | undefined`. The written one is also what keeps the column
readable: `role` resolves to the entire ARIA role union, some two thousand characters of it, against
`JSX.AriaAttributes["role"]` as authored.

**The accessor wrapper is stated once, beside the type rather than inside it.** A prop declared outside the
`AccessorProps` block carries its own `MaybeAccessor<…>` in the source, so taking the written text verbatim
would have printed the wrapper on some rows and not others while all of them accept the same two things.
The wrapper is unwrapped wherever it appears. A `Passing` column beside the type used to say `value or accessor`
and `required`; the user dropped it when the page width was capped (_"The left nav has an "About" link"_), so
the table no longer says which props take an accessor, and the `?` on the name is what marks an optional one.

**Shiki highlights the type expression directly.** The first version wrapped each type in a throwaway
`type X = …` on the assumption that a bare expression would come back uncoloured; it does not, and the
scaffold only had to be cut back off again, which it did imperfectly.

**The `Use` column is the prop's own documentation block, read through the mapped type.** The user's call,
over a registry in the Playground: written beside the table the prose drifts the first time a prop is
renamed, written on the property it cannot, and it reaches a consumer's editor on hover as well. The checker
resolves a documentation comment straight through `AccessorProps`, so the property the consumer sees carries
the block the author wrote on the literal — nothing had to be threaded through by hand. The rule this took
is in `CLAUDE.md` and `conventions.md`; a row with nothing written yet says so rather than showing blank.

**The table lists what the library declares, not what a type inherits.** `TabLinkProps` and its two siblings
are `JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }`, which resolves to four hundred and
sixty-four properties — the whole DOM anchor surface, most of it already carrying documentation from the DOM
typings, none of it the component's contract. A property whose declaration sits outside `components/src` is
dropped, which leaves `href` and takes the library's own total from 3,718 to 2,320.

**Documenting a wrapper fills every table built on it.** `InteractionWrapperProps` and the interaction flags
spread into every wrapped control, so two files took the documented count from 7 to 643. That is why
`conventions.md` says to document the layered props first rather than working component by component.

### The Docs view lists everything a unit exports, not only its props

Asked for by the user: a props table was half the story, and for an abstract — almost all namespaces — it was
none of it. The view now covers every export of the library entry except `.const` files and
everything under `Samples/` and `Utils/`, grouped as Props, Components, Context, Utilities, Classes and Types,
in that order, with an empty group left out.

**A type built from other named types lists only its own members, and names the rest.** The user's rule, for every
type: when `B = A & { … }`, B's table never repeats A's rows; A has its own table. So the builder reads a type alias
written as an intersection part by part — a part holding an inline `{ … }` gives rows, any other part is shown above
the table as "Also has everything in …", linked to that type's table on this page or on its own page. `AccessorProps`
and `AccessorValues` are looked through when they wrap an intersection, since each applies to every member alike, and
`Omit`, `Pick` and the other wrappers link to the type they wrap. A type with no rows of its own, such as
`BaseXProps = BaseXValues & BaseXCbs`, shows its heading and that line and no table. A bare alias of a type from
outside the library stays an alias row, so `Record<string, number>` does not become an empty table. The rule came
with the shared `Base<Component>Props`, which would otherwise have shown every prop up to three times per page.

**An export belongs to the unit its folder names**, by the same `getUnitName` the dependency map uses, so the
two agree on what a unit is. **A props type is the one exception: `XProps` goes to unit `X` when there is one.**
Folder ownership alone would have taken `SpotlightGuideProps`, `DrumCarouselProps` and the rest declared in a
shared primitive's types file away from the pages that show them; name ownership alone is what hid
`TabPanelProps`, `CalendarCompositeProps` and every other secondary props type before, because they were keyed
to units with no page. The fallback to the folder is what puts those on their siblings' pages.

**The lookup is case-insensitive.** A page whose display name differs from its props type only in case — the
Typewriter page was once labeled `TypeWriter` — would otherwise find nothing and draw the empty message.

**A type with an object shape gets a table of its fields; anything else is a row in one table of aliases.** A
union, a literal set or a function type has no members to list, so its written definition is shown instead.
An object type is listed field by field because a context type's or a props-feeding type's fields carry
their own documentation, which a one-line definition would lose.

**The `Use` column is drawn only where documentation is the rule.** Props and utility namespaces always carry
it, with _"Not written yet."_ in an empty row, because both are required to be documented. Every other table
draws it only when at least one of its rows has a block: component files, context files and most of a
`.types.ts` are not documented by rule, and a column reading _"Not written yet."_ on every row would be
announcing a gap that is not one.

**Signatures are the checker's, not the source text.** A namespace member is an arrow function whose return
type is usually inferred, so the written text has nothing to show for it; the checker prints the whole
function type, keeping the library's own alias names.

**`Generators` is included and `Samples` is not.** A generator is something a consumer calls, so its
namespace and types are its API; a sample is an example and has none. **The `SVGGradients` generator's page sits inside its own menu group.** The group of that name holds the
two sample pages, `TimedGradients` and `TrackedGradients`, and a group is not a page, so the generator had an
API with nowhere to show it. The user's call: a page of the group's own name goes first inside it, which is how
they structure such a case generally, over flattening the two sample pages up beside it.

**A table is headed by the name it is exported under, not by its symbol's own name.** `export * as
BreadcrumbsStyles from "./Breadcrumbs.css"` aliases a whole module, and a module's symbol is named after its file
path, so every `*Styles` table was headed by an absolute path from the machine that built it. The record now
keeps `exported.getName()`, which is also what a consumer types.

**Every Docs page carries an "On this page" table of contents on its right, built from the library's own
`TableOfContents`.** The user's call, for every page rather than as a trial on one. Each group is a top-level link
and each table with a heading an indented one under it; the `Components` table has no heading and gets no link.
`toDocsTableOfContents` and the two id builders live in the shared `DocsView.utils.ts`, so the ports read the same ids and
the same links from the same groups. It is left out when it would hold fewer than two links, sticks
to the top of the page column while the tables scroll, and is hidden by a container query once the docs area is
too narrow to hold both columns. It carries no visible caption, at the user's call: the list's place and its
entries say what it is. It is still named, through `ariaLabel`, because the page already holds the left menu's
navigation landmark and two unnamed ones cannot be told apart.

### The props tables are built beside the dev server, while the Playground is already in use

Asked for by the user, and every behavior below is theirs. Building the tables runs the TypeScript compiler over
the whole library: reading and parsing about 1,200 files, setting up the type-checker, then writing out 163
components' tables at about 40 milliseconds each. On a loaded machine that was 5 to 10 seconds of waiting on the
first Docs visit, and again after every save. It now happens in the background, with a strip across the top of the
page saying how far it has got.

**It runs in a worker thread, not in the dev server's own thread.** The build is one long stretch of work, and run
in the server's thread it would hold up every page request until it finished. `componentApiWorker.ts` holds the
compiler; `componentApi.ts` is the plugin, which talks to it and to the page; `componentApiBuild.ts` is the
compiler work itself, shared by both the worker and the production build. The worker is a `.ts` file started
with `--experimental-strip-types`, which Node from 22.6 accepts and later versions treat as already on, so no
compile step and no extra package was needed for it.

**It starts when the first page of a framework has finished loading in the browser**, which the page reports over
the live-reload connection the dev server already keeps open. Not when the server starts, so a framework nobody
opens never builds, and the four servers `npm start` runs do not all compete for the processor at once. A request
for the tables also starts it, which covers a first visit that lands straight on a Docs page.

**It builds one component at a time, and a Docs page asking for one moves it to the front of the queue.** The
reading and the type-checker setup have to finish first whatever is asked for; after that, the page's own
component is next. The Docs view shows its description straight away and its tables when they arrive.

**A save re-reads only the files that changed.** The worker keeps every parsed file between builds and hands the
previous program back to the compiler, so a rebuild skips the reading and pays for the type-checker and the
tables. Changes are gathered for a short interval before a rebuild starts, so a save that touches several files, or
a branch switch, is one rebuild rather than many; that number is a guess, not a measurement. A save marks every
component's tables as stale, so the next request for one waits for its fresh version rather than showing the old
one, and a component whose tables actually changed is pushed to a page already showing it.

**The strip is the library's own `Sidebar`, docked to the top edge**, which is what gave `Sidebar` its `top` and
`bottom` edges. It pushes the page down while it shows rather than covering it, collapses to nothing when the build
is done, and reads _"Building props tables: 84 of 163"_ over a fill that grows with the count, or _"reading the
library"_ before the count is known. The count is a library `Progress`, so a screen reader hears a progress bar
named for what it measures rather than a line of text changing 163 times. The X hides only the current build: the
next save brings the strip back.

**The deployed site has no strip**, because its tables are built during the production build and there is nothing
to wait for. The strip's component still ships there but never renders, since what decides it is whether the page
has a live-reload connection.

**A union in a type column can print its members in a different order depending on which page was opened first.**
The compiler prints a union in the order it first met each member, and which components get built first now
depends on what was asked for. It changes nothing but that order, and the production build always builds in the
same order.

### The API page's address follows the section being read

Asked for by the user, after two faults on the API view: scrolling away from a section left its `#…` in the address,
so a copied address opened on the section last clicked, and clicking an "Also has everything in …" link a second time
did nothing, because the address had not changed and the router ignored a navigation to where it thought it already
was. **The table of contents' `onCurrentChange` replaces the address's hash with the current section**, or drops it
above the first, and **an in-page include link handles its own plain click**: it pushes its hash, as an anchor would,
and scrolls with `TableOfContentsUtils.goToTarget`, so a second click always scrolls whatever the address says. A
modified click (new tab, new window) is left to the browser.

**After such a click the address holds the clicked section until the reader next scrolls, presses or types**, by the
same `observeNextReaderInput` the table of contents uses for its own pressed links, and then catches up with the last
section reported. Without the hold, a link to a short table near the end of its group showed the next heading's hash,
since the line that decides the current section had already reached it.

**Solid writes the address with `history.replaceState`/`pushState`, behind its router; the other three go through
theirs.** `@solidjs/router` scrolls to the element a hash names on every navigation, `scroll: false` only turning off
the fall-back scroll to the top, so each replace snapped the section under the reader to the top of the page. The
Playground already writes the address behind the router once (`restoreRootSlash`). React's router never scrolls, Vue's
has no `scrollBehavior`, and Svelte's navigates with `scrollToTop: false`; Svelte's `navigate` is asynchronous and a
newer navigation cancels an older one, so its click waits for the push before scrolling. The Docs view's table of
contents does not write the address; the user asked about the API page only.
