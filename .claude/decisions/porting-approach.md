# Decisions: porting-approach

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Porting beyond Solid: the shared logic is this library's own, not Zag's

The user's call, with Solid and React as the first two targets. The library is to work in more than one
framework, and the part that decides how a component behaves — keys, focus, open and closed, selection — is
written once in plain TypeScript with no framework in it, with a thin Solid view and a thin React view each
drawing markup from it. Zag.js was the starting proposal and was weighed in both of its layers.

**Zag's components were rejected on what they would overwrite.** Zag covers roughly twenty-five of the
Essentials and Primitives here and none of Exotics, Generators or Placement, which is the half that makes
the library distinct. Where it does cover a control, its behavior replaces the one argued out in this file:
`aria-disabled` on every disabled control, a one-second typeahead reset, `Tree` stopping rather than
wrapping, the `F8` toast hotkey, `hasAutoActivation` on `Tabs`. It also leaves one view per framework to
write regardless, since it hands back attributes and handlers rather than markup — so it removes none of
the per-framework work, only the behavior, which is the part worth keeping.

**Zag's engine alone (`@zag-js/core` with its per-framework bindings) is the fallback, not the plan.** It
would supply the Solid and React bindings ready-made, which is the largest cost of doing this without it.
Against it: Zag documents consuming its machines, not authoring new ones, so it would mean building on an
undocumented surface that has already changed shape once, at 1.0. If the binding layer turns out to be
the expensive part once a first component is ported end to end, this is the option to reopen.

**The shared logic follows Zag's shape even without Zag**: state and behavior in, attributes and handlers
out, with each framework's view spreading them onto its own elements. That keeps a single Zag machine
adoptable later for one control where it wins, without the rest of the library changing shape to fit.

**Anything a framework package holds that touches no framework belongs in the core**, even when only the framework
views call it: a measurement, a string builder, a default context value, an equality check. The user's call, taken
on DRY grounds after a sweep found such helpers copied into all four framework packages — `Bracket`'s connector
geometry, `Label`'s and `FormField`'s default contexts, the element observers' equality helpers and empty results,
and `Wraparound`'s tile keys. The test is what the code reaches, not where it is used: only a line that renders,
reacts or reads a framework's context stays behind.

**A component's private constants live behind `@thewaver/ss-components/internal`, as `<Component>Const`.** The user's
calls. About 380 constants declared at the top of component files — `ROW_SIZING`, `EMPTY_SELECTION`, a sample's
timings — were identical in every framework that had them. Exporting them from the core's index was rejected because
every framework package re-exports that index, so each would have become public API, and several names collide
across components. So the core has a second entry, `src/internal.ts`, built and type-declared beside `index.ts` and
listed in the package's `exports` as `./internal`; framework packages import from it and do not re-export it. Each
component's constants sit in a namespace named for it with the suffix `Const` (`RadioConst`, `HandTrail1Const`), in
`<Component>.internal.const.ts` beside its other core files — one file per sample folder for the samples. Every place
that maps `@thewaver/ss-components` to source (each `tsconfig.json` and each Vite and Vitest alias) maps the
`/internal` path too, listed before the bare name, since the bare-name alias points at a file and would swallow the
subpath.

**Constants repeated across components are merged only where they are one mechanism.** The user's call over
merging every repeat or none. Merged: the tracked gradient samples' `NO_FADE`, `RENDERED_ELSEWHERE` and
`FULL_AGE_RATIO` (`TrackedGradientSampleConst`); the trail-stamp timings shared by the hand trails, spot smears and
spot trails (`TrailStampConst`); the pointer-following spots' resting point and motion step (`SpotConst`); each
numbered sample family's shared numbers (`HandTrailConst`, `SpotRippleConst`, `SpotSmearConst`, `SpotFlareConst`);
and the "placed entries fill, unplaced ones fit" sizing of the six controls that take a layout (`PlacementConst`).
Left with their component, because only the numbers agree: `NOTHING`, `NEXT`, `HALF`, `PERCENT`, `NO_PROGRESS`,
`EMPTY_SELECTION`, `DEFAULT_MARGINS`, each timed pattern's `CELL_COUNT`, each sample's `COLOR_KEYS` and `DEFAULTS`, and
comet's and swarm's settle values. Merging those would tie together tunings that only happen to match. The few
constants typed with a type declared inside a sample file (`NO_STAMPS` and its stamp types) stayed in the sample.

**What already crosses frameworks unchanged is the styling**: vanilla-extract compiles to plain class names
and a stylesheet. What does not is `Abstracts/`, several of which create Solid signals at module scope
(`Navigator.utils.ts`'s direction version, for one) — pulling those out of Solid is the first work.

**Three packages, and `@thewaver/ss-components` becomes the core rather than being retired.** The user's
call: repurpose the name rather than abandon it. `ss-components` holds the framework-free logic and the
stylesheet; `ss-components-solid` and `ss-components-react` hold the views and depend on it, so a consumer
installs only their framework's package and never the core by hand. Effector publishes the same way
(`effector`, `effector-react`, `effector-solid`). The package boundary is the point of the split: the core
has no `solid-js` or `react` to import, so it cannot drift into either, which one package with framework
subpaths could only enforce by discipline. Weighed and accepted: a consumer upgrading from the Solid-only
0.0.x finds no components under the old name, which is a sharper break than a rename but free before 0.1.0
(_"Breaking the API is free until 0.1.0"_); the core's README and npm description point at the framework
packages. The existing `components/` folder stays the core, and the Solid views move out of it.

**The tree as it stood before the port is published as the last Solid-only release** of both
`@thewaver/ss-components` and `@thewaver/ss-utils`, stable, from the user's other machine. That is what
softens the break above: a consumer pinned to it keeps a working Solid library indefinitely, and moves to
`ss-components-solid` when they choose to rather than when an upgrade forces it. No port work lands in the
package manifests until that publish is pushed and pulled here, so the version bump and the restructure
never touch the same lines on two machines.

**A component's core holds its own state and announces changes to whoever subscribes.** Taken on Claude's
recommendation — the user said plainly they had no view of their own, so this is the one of the porting
calls most open to being reopened on evidence. Each core object keeps its state, runs its own timers,
observers and document listeners, cleans them up, and calls its subscribers when anything changes; React
reads it through `useSyncExternalStore`, Solid through a signal fed by the same subscription. TanStack
Virtual's `virtual-core` is built this way. The pure arithmetic inside — `computeNextPosition` and its
kind — stays as plain exported functions, so their tests carry over untouched.

Two alternatives were weighed. Pure functions with each framework holding the state was rejected because
everything that runs over time — a toast's timer, `HoverIntent`'s delay, the `dir` observer — would be
written once per framework and its cleanup could drift between them. A standalone signals library in the
core was rejected as a dependency every consumer carries, and as a second reactive system running beside
Solid's inside every Solid app. **The known cost of the chosen shape is Solid's granularity**: a snapshot
that changes as a whole reruns everything reading it, so a Solid view reads narrow slices of the state
rather than the whole of it.

**React is checked by automated tests until a React Playground exists, and that Playground is one app with a
framework switch.** The user's call on both halves. The target is the existing Playground with a Solid/React
switch, every example in both, and the e2e specs run once per setting, so a divergence between the two
frameworks surfaces as a red spec; a second, separate React app was rejected because nobody browses it and it
falls behind. That work was postponed as a large task of its own, so in the meantime the React
views are covered by automated tests alone — which means the user's usual check, running the Playground and
looking, does not reach them.

**Those tests are Playwright component tests against a bare React page, not `jsdom`.** `jsdom` was proposed
first and is ruled out by _"Unit tests: `vitest`, colocated, and only for functions"_ in `conventions.md`: if it
renders, it is a spec, because a DOM with no layout engine answers every geometry question wrongly — and Tabs'
floater alone is geometry. Playwright, already the suite's runner, mounts components through its own `mount`
fixture onto a gallery page the project serves itself, with story files naming each scenario; it needs no
package beyond `@playwright/test`, only the page and a Vite server able to compile React. Vitest's browser mode
would do the same through a second runner and more packages, for nothing Playwright does not already give. The
gallery is a test fixture rather than a demo: nobody is meant to browse it, which is what keeps it from being the
separate React app the paragraph above rejected.

**The gallery is gone, retired whole.** Once both Playgrounds existed the plan was to delete its specs one at a
time as the Playground specs, now run against both apps, came to cover each; the user threw the lot out at once
instead — `components-react/gallery`, `e2e/react`, the `react` Playwright project and the dev server it ran on. The
React views are tested through the React Playground from here on. **One thing went with it:** the gallery ran on a
development server under `StrictMode`, so every React effect was set up, torn down and set up again under test. The
React Playground renders under `StrictMode` too, but the specs run against its production build, where React does
not do that.

**The port starts from `Abstracts/`, bottom up, rather than from a component.** The user's call, over a first
port of `Tabs` — which turned out to reach twenty-three folders and about 6,400 lines, because it sits on
`InteractionWrapper` and that sits on `Tooltip`, `Popover`'s positioning and `Viewport`. Starting at the bottom
means nothing ported has to be undone, and every Solid component keeps working on top of each converted abstract,
so the Playground and `e2e/` check each step. What it gives up is a second framework shaping the core from the
start, which is why `Navigator` and `ElementFader` were converted first **with** their React side and tested on the
gallery, before the rest follow the same shape.

### Porting: where each half of an abstract sits

Derived when `Navigator` and `ElementFader` were converted, and meant to be copied by the rest.

- **`<Subject>.utils.ts` exporting `<Subject>Utils` is the framework-free half**, and it keeps the name it always
  had, so `NavigatorUtils.computeNextPosition` did not move. Pure functions stay as they were; stateful parts
  become factories returning a store plus commands — `NavigatorUtils.createDirectionWatcher`,
  `ElementFaderUtils.createFader`.
- **`<Subject>Solid.utils.ts` exporting `<Subject>SolidUtils` is the Solid half**, in `components-solid/src` under
  the same folder path. It keeps the old Solid-facing signature, so each call site changed one identifier and one
  import. Each package's folder holds one namespace, as _"One namespace per folder"_ in `conventions.md` asks.
- **`<Subject>React.utils.ts` exporting `<Subject>ReactUtils` is the React half**, in `components-react/src`
  under the same folder path. Its hooks are `use*` and hand back plain values rather than getters, because that
  is what a React component reads. Names are distinct across all three so that a framework package re-exporting
  the core can never hit `TS2308`.
- **`Store` and `StoreUtils` are in `ss-utils`**, because a value with a subscribe needs nothing but the language
  (_"What goes to `ss-utils` and what stays here"_). Each framework reads one through a single helper of its
  own: `accessStore` in `components-solid/src/Utils/storeUtils.ts`, beside `access` and `accessSignal`, and `useStore`
  in `components-react/src/Utils/storeUtils.ts` over `useSyncExternalStore`. Both take a `select` so a component
  follows one field, which is the answer to Solid's granularity cost recorded above.
- **`components/src/index.ts` is the framework-free barrel.** Both framework packages' TypeScript paths and Vite
  aliases point `@thewaver/ss-components` at it. **The React Playground's Vite build refuses any `solid-js`,
  `@solidjs/*` or `ss-components-solid` import outright**, which the package boundary makes redundant for the core
  but keeps catching a slip inside `components-react` itself.
- **`components-react/src` and `components-solid/src` follow `components/src`'s comment rules**: `*.utils.ts` and `Utils/` documented,
  everything else bare.

**What a core takes, and what it leaves to the binding.** A function the core calls when it needs an answer —
`getTransitionDurationMs`, `getRef` — stays a function, since both frameworks can supply one (React through a
ref it keeps current). A value whose _change_ is the event — the fader's `isVisible`, the element to watch — is
not taken by the core at all: the binding reacts to it in its own way and calls the command (`show`, `hide`,
`observe`).

**Two things the React side found, both now true of every core.**

- **A core object has to survive being stopped and started again.** React's `StrictMode` runs every effect,
  tears it down and runs it again on mount, and the React Playground renders under it for that reason. So nothing is
  disposed for good: `observe` returns a stop and can be called again, and `ElementFader`'s `cancel` rolls a
  pending fade back to the target already committed and leaves the fader usable. A one-way `dispose` left the
  remounted fade stuck, half-open, with its request already spent.
- **A core that reads the DOM straight after changing its own state reads it too early under React.** React
  applies a store change in a microtask, not inside the write, so `ElementFader` looking for running animations in
  the same breath found none under React and fell back to the stated duration — the timer-only mode its own
  documentation calls a guess. It now looks one microtask later, which under Solid, whose writes apply at once,
  changes nothing but the moment. The rule for the rest: **anything a core measures after its own write waits a
  microtask for the binding to apply it.**

### Porting: the three packages

The layout the user chose — the core repurposed, one package per framework on top — as it was carried out.

- **`components/` is `@thewaver/ss-components`, the framework-free core**: every `<Subject>Utils`, every `.css.ts`,
  `.const.ts` and framework-free `.types.ts`, the generators' arithmetic and the sample data that builds no markup.
  It has no `.tsx`, no dependency on `solid-js` and no Vite Solid plugin. Its `index.ts` lists every file of it that
  the old barrel listed, the sample data included, with each `.css.ts` as a `<Stem>Styles` namespace.
- **`components-solid/` is `@thewaver/ss-components-solid`**: the views, `*Solid.utils.ts`, `*Solid.types.ts`,
  contexts, `Utils/`, and the samples that build Solid markup (`Samples/SVGDefs`'s timed and tracked gradients and
  named tilings, `Samples/Bracket`'s connectors), each of which has a React twin in `components-react/src/Samples`. Its `index.ts` begins with `export * from "@thewaver/ss-components"`, so a Solid consumer imports
  everything from one name, as before the split. `llms.txt` moved here, because it documents the Solid components.
- **A Solid file imports the core by package name, never by a relative path across the trees**, in one
  `import { ... } from "@thewaver/ss-components"` per file, a style namespace arriving as `XStyles as styles`. So each
  view still reads `styles.tabsRoot` and nothing inside it changed.
- **A `.types.ts` was split by what its declarations reach.** Any declaration naming something from `solid-js`, from
  a Solid file, or from a declaration already moved — followed to a fixed point — went to `<Stem>Solid.types.ts`
  beside it, and the rest stayed. Where a framework-free core needed a record whose Solid form carried Solid-typed
  tooltip definitions, the core owns a `*Record` with the tooltip type as a parameter (`SelectOptionRecord`,
  `TreeNodeRecord`, `MenuItemRecord`, `SortableGridItemRecord`), and the Solid type is that record with Solid's
  tooltip type filled in. With that done the React typecheck loads no file from `solid-js`.
- **The Playground imports `@thewaver/ss-components-solid` only.** Its docs plugins read both trees: the dependency
  graph resolves a name imported from the core package to the core file that exports it, and the export tables take
  a component from the Solid tree and follow its props into the core.
- **The samples' shared helpers split the same way as an abstract.** `SVGDefsUtils` in the core holds everything
  about the samples that is arithmetic or color — the stops, the fades, the random split values — and the frame
  clock as a store with `retain` and `keepAwake`. `SVGDefsSolidUtils` holds the two things that are not: the blur
  filter, which is markup, and the clock read as a signal. The React side is `SVGDefsReactUtils`.
- **The React samples keep Solid's names and arguments, with plain values for getters.** `computeSVGDefs(id,
interactionFlags, element, defs)` runs during the host's render, so it calls no hooks; where a sample needs one,
  `renderDefsElement` returns a small component of the sample's own that holds it. `SVGAnimations` does the same
  for every function, because React's animation schedule is a hook. A pointer-following sample with a trail draws
  its head and every stamp from one component, so it has one pointer tracker, one clock consumer and one render
  per frame; the stamp defs keep their ids and draw nothing, as `SVGDefsUtils.getSharedFilter` does. A tiling
  rolls each cell's random values once, through `SVGDefsReactUtils.useSplitValues`, because a React sample is
  drawn again on every render of its host and a fresh roll would restart every cell; a change of colors or cell
  size therefore keeps the rolls, where Solid, rebuilding its defs, rolls again.
- **Every package builds on its own and imports the others by name.** Each package's Vite build lists the other
  `@thewaver/*` packages, its framework and TanStack's `virtual-core` as external, and bundles
  `@vanilla-extract/dynamic` into `_external/` as the core always did. The React package's library build is
  `vite.lib.config.ts`, a name kept from when a `vite.config.ts` beside it served the test gallery. React is a peer at `^19`, the
  version everything was written and tested against. Versions and lifting `private` are
  the user's, and the user handed them over for the first release: the core and `ss-utils` step one patch past
  what the registry already holds (the last Solid-only release took `ss-utils` to 0.0.25 and the core to 0.0.4
  from the other machine, so a manifest still reading 0.0.24 and 0.0.3 cannot be published), and the four
  framework packages start at 0.0.1 with `private` lifted and `publishConfig.access` set to `public`, because a
  new scoped package is otherwise published as restricted. Each carries its own `LICENSE`. The order is forced: the core reads `StoreUtils` from `ss-utils`, so `ss-utils` goes out first, then
  the core, then the two framework packages.
- **Each framework barrel starts with `export * from "@thewaver/ss-components"`.** Where the React package
  declares its own type under a name the core also exports — fourteen of them, mostly callbacks typed with React's
  events, and `DateInputEra` and `TimeInputMeridiem`, which carry values where the core's carry getters — the
  React barrel names its own explicitly, which TypeScript lets win over both star exports. A React type identical
  to the core's is not redeclared: the React file imports the core's and re-exports it.
- **The Solid package's own tests are the ones that run Solid** — `vitest` in each of the two packages, the core's
  run with no Solid on hand.

### Porting: the Playground in two frameworks

The user's calls, taken one at a time before any of it was built: two separate Playground apps rather than React
examples mounted inside the Solid one; the Playground split in three the way the library is; one site, whose root
is a landing page where a visitor picks a framework, with the Solid app under `/solid/` and the React app under
`/react/`; a switch on every page that opens the same page in the other framework; and the React test gallery kept for a
while, then retired whole (_"The gallery is gone"_, above).

- **`playground/` is `@thewaver/ss-playground`, private, and has no barrel.** It holds every file of the
  old Playground that reaches nothing Solid — the stylesheets, the page data and knob settings, framework-free
  types, the assets, `shiki.ts`, the virtual-module declarations in `global.d.ts` — at the same path it had, plus the
  Vite plugins both apps load (`vite/`: the docs plugins and the `?source` loader) and the library-tree script.
  Its `exports` map is `"./*": "./src/*"`, so an app imports one file by its path,
  `@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css`. A barrel would have had to invent names: the
  Playground's files export `styles`-shaped modules and page constants whose names were only ever unique per folder.
- **Which files are shared was decided by what they reach**, as for the library: a `.tsx`, a context, or anything
  importing `solid-js`, the Solid router, a Solid-only library name, or another Solid file, followed to a fixed
  point, stayed Solid. So a page's `.types.ts` built on `AccessorProps` is Solid, and the React app writes its own.
  **A file that reaches a framework package only for names the core also exports is shared**, importing them from
  `@thewaver/ss-components`: the rule above read the package name rather than what was taken from it, and so left
  seventeen `Knobs/` files copied into all four apps, identical but for that import line. All seventeen moved, on the
  user's call that keeping one copy matters more than the lines it saves; five of them could follow only once the
  sample names they type against left the framework packages (_"`SVGDefsSamples` is data, `SVGDefsSampleConfigs` is
  drawing"_). No app has a `Knobs/` folder of its own now. The small unions a moved file needed went to the shared
  half beside their page (`PaintKind.types.ts`, `SVGDefsSourceSizes.const.ts`,
  `SVGGradientsPaintKind.types.ts`, `SatelliteBadgeCorner.types.ts`, `ToastOptions.types.ts`,
  `TypewriterTextEffect.types.ts`), and each app's own `.types.ts` re-exports them so its other importers are untouched.
- **The menu's descriptions are written once**, in `playground/src/App/MenuDescriptions.const.ts`, keyed by the
  entry's name, which is unique across the whole tree. Each app's `MENU_CONFIGS` keeps only names, nesting and page
  components, and the Gallery's section text and the Docs view's lead read the description by name. The four copies
  had already drifted once: `SlotText`'s text was updated for letters in Solid and left describing digits only in the
  other three, though all four turn letters.
- **An app file that shares a path with a shared-half file carries its framework's name**: `ButtonPageReact.types.ts`
  beside the shared `ButtonPage.types.ts`, as the library's Solid package writes `XSolid.types.ts`. The source view keys
  both folders by path, so two files at one path collide and one hides the other. The user accepted it as imperfect
  but acceptable when the Playground's constants and types were de-duplicated, which renamed 577 app files at once.
  Example props follow the library's `Base…Values` / `Base…Cbs` shape, and Solid examples read every value through
  `access(…)`, never by calling the prop. `MenuBranchConfig`, `MenuNodeConfig` and the Gallery types stay per app,
  the user's call: they differ only by the page component's type, and sharing them would add a type parameter to
  every use.
- **An example's name is written once too**, in its page's shared `<Page>.const.ts` as `EXAMPLE_NAMES`, keyed by the
  example's key, and every app's examples list reads `name: EXAMPLE_NAMES.<key>`. The object is per page because keys
  are unique only within a page. A mistyped or missing key is a compile error in every app.
- **`playground-solid/` and `playground-react/` mirror each other path for path**, so the switch between them only
  swaps the prefix, and a spec written against one finds the same page, example and `data-*` keys in the other.
  The React app's Vite server refuses `solid-js`, the Solid router and `@thewaver/ss-components-solid`.
- **The source view follows both folders.** It globs the app's own `src` and the shared one, keys both by the path
  the file had before the split, and resolves an import of the shared package as it resolves a relative one, so the
  code panel shows the same files it showed before. The code it shows now spells shared files by package path.
- **The React Playground routes with `react-router`**, the user's call for consistency with the Solid one on
  `@solidjs/router`. It is a dependency of `playground-react` alone; no library package takes a router.
- **Each app reads its own prefix from the build and is told the other's.** The router's base comes from
  `import.meta.env.BASE_URL`, and `VITE_OTHER_PLAYGROUND_URL` names the other app — `/react/` and `/solid/` in the
  site build, the other preview's port in the test builds, the other dev server's port by default. The switch is the
  heading above the sidebar's search field, "ss-components for <Framework> ▾", painted as a link and built from the
  library's `Menu` as a button with a radio item per framework; it moved there out of the settings popover at the
  user's request. It marks the app's own framework, and picking another opens that address plus the current route.
  The viewport anchor stays in the settings popover as a dropdown, also at the user's request.
- **The left nav has an "About" link above the component tree, and "/" is the About page.** The root route used to
  render nothing. The page's text and its per-framework differences (package name, peer dependencies, how two-way
  state is handed in, the usage sample in that framework's syntax) are written once in
  `playground/src/App/Pages/AboutPage/AboutPage.utils.ts` and each app only draws the blocks, so the four cannot
  drift. It is lazy-loaded because it pulls in the highlighter. The link is a real link to "/" and is selected only
  on the root route, so it takes an exact match rather than the prefix match a router link defaults to.
- **A page's text, header, docs and About content are all capped at one width, `PAGE_CONTENT_WIDTH` in `App.css.ts`.**
  The user's call, after About wrapped at 720 and Docs at 960: one number for everything, with code boxes
  scrolling sideways rather than widening the page, and the docs table losing its `Passing` column to fit. A root-relative link a page draws itself, such as the rich-text
  sample's, goes through `toOwnAppHref` so it stays inside its own app.
- **The site is assembled by `npm run build:playground`**: the Solid app built with base `/solid/` into `dist/solid`, the
  React app with `/react/` into `dist/react`, and `playground/landing/index.html` — plain HTML, two links, as
  bare as the user asked — at the root. `vercel.json` serves each app's `index.html` for its own routes and sends
  every older address, from before the apps moved under a prefix, to the same page under `/solid/`.
- **The two routers report the address differently, and the shared helpers absorb it.** React's `useLocation`
  gives the route with the `basename` already taken off; Solid's gives it with the `base` still on. So every Solid
  read of the address goes through `toRoutePath` before it is matched against a route, and the React side reads it
  as it comes.
- **The React frame's links are a small adapter, `PageRouterLink`, rather than `react-router`'s `Link`.** The
  library hands a `linkComponent` an `href`, where `Link` takes `to`, so something has to translate either way; the
  adapter renders a plain `<a>` and takes `useHref` and `useLinkClickHandler` for the in-app navigation.
- **The tree page's radial example writes its own layout on purpose.** A radial tree is the one arrangement the
  shared layouts cannot supply, because it needs more than an item count: every node has to know its parent before
  it can be given a slice of the turn. So it stands as a worked example of a layout of one's own — a function from a
  set of defs to boxes in fractions of the arrangement's width — giving each node the slice of its parent's turn its
  siblings leave it, depth by depth.
- **`npm start` runs the site the way it is deployed**, asked for by the user: `playground/scripts/startSite.mjs`
  starts the Solid app on 8082 under `/solid/`, the React app on 8083 under `/react/`, and a Vite server for the
  landing page on 8080 that passes `/solid` and `/react` through to them, live-reload connections included, and
  opens the browser there. So in development the addresses, the switch and the landing page are the deployed ones.
  `start:solid` and `start:react` still run one app alone at its root. The script is plain JavaScript because the
  Node in use does not run TypeScript files directly.
- **The library-tree script counts `components/src` and `components-solid/src` merged by path**, which is what
  `components/src` held before the split, so the Treemap, Icicle, Sunburst and Circle Packing demos keep drawing the
  same library. Counting the core alone moved the arcs far enough that `sunburst.spec.ts`'s click on "Exotics" landed
  on the middle button. It is plain JavaScript, `libraryTree.mjs`, because the Node in use does not run TypeScript
  files, and the commit hook runs it.
- **The library tree is a file of its own, `playground/src/App/LibraryTree.generated.ts`, generated whole and
  exporting `LIBRARY` and nothing else.** The user's call, after a commit lost Treemap's page constants. The tree used to be
  the top of `TreemapPage.const.ts`, with hand-written constants below it that the script had to find and carry
  over; on a checkout with Windows line endings it failed to find them and wrote the file without them, silently,
  and a fix that put them above the tree lost them again because the script rewrites that part from its template.
  A file the script owns outright has nothing to preserve, so nothing hand-written may ever be added to it. The
  label formatter, `formatLines`, sits beside it in `LibraryTree.utils.ts`, and Treemap's page constants stay in
  `TreemapPage.const.ts`; no page imports from another page's folder for the tree. The file says so twice, both the
  user's call: the `.generated` suffix, which no other file in the repo carries, and a one-line comment at its top
  naming the script and warning that changes are wiped on commit. That comment is the one sanctioned exception to
  `playground/src`'s comment ban; the script writes it, so it cannot be removed by hand for long anyway. JSON was
  weighed and turned down: it would have needed `resolveJsonModule` in five configs, lost the `TreemapNode<string>`
  annotation, and dropped out of the source view, which follows only script files.
- **A Playground case that only one framework can pass exists once per framework, tagged `@solid` or `@react`**,
  the user's call over teaching a spec to branch on the framework. Each Playground's projects leave out the other's
  tag. The two so far: the docs table's type text (`JSX.Element` against `ReactNode`), and `Label`'s warning (`getAriaLabel` against `ariaLabel`). The no-frames placement is not one of
  them: every framework opens an anchored layer on its anchor with frames withheld, for the reason given under
  _"`Anchor`: the positioning half of a floating layer, extracted"_, so `noAnimationFrames.spec.ts` asserts it once
  for all four.
- **The builds the tests run are served at the root**, so the specs keep navigating to `/tabs`; only the deployed
  builds carry the `/solid/` and `/react/` prefixes, and each app reads its own from the build.

### Porting: the shapes the rest of `Abstracts/` took

Every abstract is now split along the lines above; these are the recurring shapes, so the components and
`Generators/` can copy them rather than re-derive them.

- **A watcher or tracker is a store plus `observe(element)` returning a stop**, restartable, as `Navigator`'s
  direction watcher set out: `MediaQueryMonitor`, `PointerTracker`, `FrameRateMonitor`, every tracker in
  `InteractionTracker`. Where the state is only the latest reading and nothing else holds time, the core is just
  `observe*(element, callback)` returning a stop, and the Solid side keeps the reading in a signal —
  `ElementObserver`, `Anchor`'s content size. **A core observer reports only when its reading changes**, which is
  what the old signals' `equals` did, with one exception kept for parity: the per-frame viewport rect is reported
  every frame, because the old observer wrote it every frame and consumers' own signals decide what a repeat means.
- **A tracker whose state a painter reads skips writes that change nothing.** `InteractionTracker`'s element
  tracker compares field by field before notifying, as the Solid store it replaced did; without that, every key
  press re-reading the focus ring would hand every painter a fresh flags object.
- **Module-level shared state is a store in the core and one Solid signal mirroring it**, subscribed once at
  module load rather than through `accessStore`, which needs an owner: `Elevation`'s registered layers,
  `PointerTracker`'s presence, `Carrier`'s carry in flight. A Solid getter that must re-run when that state changes
  but computes through the core reads the mirror first and then calls the core function —
  `ElevationSolidUtils.getBase`, `CarrierSolidUtils.getIsTargetAllowed`.
- **A framework's batching is passed in, never assumed.** `Carrier` commits a move between zones as two writes the
  consumer must see as one; the core's `end` and `dragFromPointer` take `opts.batch`, and the Solid side hands
  over Solid's `batch`. React batches on its own and needs nothing.
- **A consumer-owned value the core writes is a getter-and-setter pair in its defs**, never a store the core owns:
  `Selection`'s selection, `HoverIntent`'s open state, `Rotator`'s target index. Where the core has to know that
  such a value changed from outside, the binding reports it — `HoverIntent`'s `reportShown`, `Rotator`'s
  `turnToTarget` — because the core cannot watch a value it does not own.
- **A reactive chain of pure calculations becomes the pure calculations, and the chain stays each framework's.**
  `Anchor`'s positioning is `computePortalPlacement`, `computePortalPosition` and `getIsAnchorOnScreen`, and the
  Solid side keeps the same memo per step, so what re-runs when is unchanged.
- **Stopping a gesture tracker's listeners is not forgetting the gesture.** `InteractionTracker`'s drag and swipe
  trackers take `reset` separately from `observe`'s stop, and the Solid side calls it only when the element changes
  or the control is disabled — the two cases the old code reset in. A first version reset on every stop, and
  `ColorArea`, whose listeners are attached again mid-drag, then took the press and dropped every move after it;
  `e2e/colorArea.spec.ts` caught it.
- **A Solid cleanup that writes to a core store is registered before the signals reading it**, so it runs after
  they have unsubscribed — Solid runs an owner's cleanups last-registered first. `Rotator`'s `stop` is the case.
- **Types that name Solid go in `<Subject>Solid.types.ts`**: `MaskedFieldHandle`, `RotatorDefs` and the
  `Virtualizer` row window's. A core `.types.ts` imports nothing from `Utils/typeUtils`, because the React
  typecheck would then load Solid's types — which is how the check is run: `tsc --listFiles` in
  `components-react` lists no `solid-js` file.

**Five places kept most of their Solid half, each for a stated reason.**

- **`SignalMirror`** exists to shape Solid signals, and most of it goes to the Solid package as it is. The one
  rule in it that is not about Solid — telling an outside clear of a composite value from the echo of the
  component's own, which is what lets a time be picked before a date — was extracted as
  `SignalMirrorUtils.createSplitter` once React needed the same split, and the Solid half became
  `SignalMirrorSolidUtils`.
- **The `Viewport` and `ColorExtractor` contexts** are each framework's by nature. `Viewport`'s context type was
  loosened to plain function types so `ViewportUtils` and every core that takes a viewport stay framework-free;
  `ColorExtractor`'s loading moved into `ColorExtractorUtils.createExtractor`, and the context calls it.
- **`MaskedField`'s wiring.** Its three effects depend on exactly which reads are tracked and which are not — a
  value change must not re-commit the digits, a format change must not rewrite the text — and those choices are
  the behavior. So the rules moved out as pure functions (`computeHasIssue`, `computeTypedValue`,
  `computeText`), and the wiring stayed in `MaskedFieldSolidUtils.createField`, calling them.
- **`Virtualizer`'s row window** was first a layer over `@tanstack/solid-virtual`, and only the scroller search moved
  (`VirtualizerUtils.findScrollParent`). It is now built on TanStack's framework-free `virtual-core`, the same package
  the React side uses, by folding in exactly what `solid-virtual`'s own wrapper did: options recomputed inside a
  `createComputed`, `_didMount` and `_willUpdate` on mount, and the visible rows kept in a store reconciled by row
  index so a row that stays on screen keeps its element. The ref-timing and scroll-margin fixes recorded under
  `Virtualizer` sit outside that wrapper and were not touched; `measureRow` still defers to `onMount`. One TanStack
  package serves both frameworks, and `solid-virtual` 3.13.40 was itself on `virtual-core` 3.17.11, so the version
  under the Solid lists did not change.
- **The Solid and Svelte row windows report `getIsLive` once they are following their scroller, not once it is
  found.** The two are a step apart: an effect finds the scroller, and the window takes it up only when its options
  are worked out again — Solid's `createComputed`, Svelte's `$effect.pre` — after that effect pass has finished.
  `Listbox`'s scroll-to-highlight effect runs in the same pass as the search, so it saw the scroller found and asked a
  window that was following nothing; TanStack had nowhere to scroll and nowhere to schedule its retry and dropped the
  request, and nothing the effect reads changed afterwards, so a list opened onto a selection far down — `Route 26` in
  the Playground's windowed `Select` — opened at the top with the highlighted row thousands of pixels below the box.
  The window now records whether it is following each time it updates, in the same two places `_willUpdate` already
  ran, and `getIsLive` reads that. Where `_willUpdate` runs is unchanged, and so is `measureRow`'s deferral to
  `onMount`. It is the Solid and Svelte half of what Vue's `isLive` waiting for the render does. `select.spec.ts`'s
  reopening case covers it in all four apps.
- **The Solid and Svelte row windows measure the scroller's box again just before scrolling to a row.** They take up
  the scroller before the rows' spacer is drawn, so the box they first measure is a few pixels tall, and TanStack only
  hears of the real size from a resize observer once the page has been laid out. The scroll to a reopened selection
  comes in between, so it was aligned against the tiny box: in Solid the picked row was painted for one frame about
  100px above the list with only its bottom edge showing, and in Svelte the same misplacement was there at the start of
  the frame but corrected before paint. `VirtualizerUtils.remeasureClientRect` re-runs the report
  `observeClientRect` makes, through TanStack's own callback, and `scrollToRow` calls it first. Moving the take-up after
  the render, as Vue does, was tried in Solid and rejected: Solid ran the after-render effect before the window had
  been handed its new options, and even with that patched the box was still measured before the spacer was drawn, so
  it halved the error rather than removing it — and it changed the timing these windows were built on. React and Vue
  already painted the row in place and were left alone.
- **`Glass`'s filter builders** return markup through `Generators/SVGDefs`, which is JSX; they moved to
  `GlassSolidUtils`, and the geometry and ids stayed. `Glass` was at first left out of `core.ts`, because its
  description type borrowed Solid-flavored gradient types from `Generators/SVGDefs`; it rejoined once the generators
  were split (_"Porting: the SVG generators, `Shape`, `Surface`, `GlassSurface`, `CornerHighlight` and `Glass`"_), and
  `GlassReactUtils` is the React side of the builders.

**Every abstract has its React side, written ahead of the components that will use it.** The user's call,
reversing Claude's first one, which was to write each when a React component first needed it. They are in
`components-react/src/Abstracts`, and are tested through the React Playground's components that use them.
`Glass`'s filter builders are the one gap, since they return markup through `Generators/`, which has no React
side yet.

### Porting: how the React side reads

Derived from the `Navigator` and `ElementFader` pilot and applied to every abstract; the components should keep to
it.

- **Hooks take plain values and `RefObject`s, and return plain values.** `useX` inside `<Subject>ReactUtils`, the
  React counterpart of Solid's `create*` inside `<Subject>SolidUtils`. A hook that follows an element reads it
  through `useElement(ref)` in `components-react/src/Utils/refUtils.ts`, which turns the ref into state after every
  commit so an effect can depend on it — the counterpart of an accessor ref in Solid.
- **A framework-free object is made once, in `useState`'s initializer, and reads this render's props through
  `useLatest`.** Its callbacks are functions over that ref rather than captured values, so a new callback or
  duration takes effect without the object being made again. Where a core reads an optional function's presence
  at event time — `HoverIntent`'s focus delay, `TextSync`'s mask — the object passed in uses a getter, so the
  presence follows the prop too.
- **Two-way state is a `[value, setValue]` pair under the bare stem**, the name Solid's signal pair carries too:
  `selection`, `targetIndex`, `value` (_"A prop is named the same in every framework"_ in `conventions.md`). Where
  the consumer may leave it out, the hook
  keeps its own, as `SignalMirrorReactUtils.useOptionalState` does.
- **Lists of elements are compared entry by entry** through `useStableList`, so a list built inline each render
  does not re-run the effect that watches it.
- **A reading that has not changed leaves the state alone**, through an updater that hands back the previous value,
  so a measurement repeated every frame re-renders nothing. The per-frame rect's report-every-frame parity with Solid
  does not carry over: in React a repeat would be a render, and nothing depends on one.
- **`useEffect` for listeners and timers, `useLayoutEffect` for anything written into the DOM or measured from it**
  before paint: tab order, `touch-action`, sizes, the text sync.
- **A controlled input's text is committed from its setter, not from an effect watching it.** `MaskedField`'s React
  side commits the typed value inside the setter the input calls, so a keystroke and the value it makes arrive in
  one render; the value-from-outside direction stays an effect, as in Solid.
- **The `Viewport` context has a React twin** in `components-react/src/Abstracts/Viewport/Viewport.context.ts`, falling
  back to the window when no provider is above, which is what every viewport-space measurement reads. Since the
  fallback's size is read during rendering, `usePortalPosition` re-renders on window resize.
- **`Virtualizer`'s React row window is built on TanStack's `virtual-core` directly**, the way `@tanstack/react-virtual`
  builds itself — options set during render, `_didMount` and `_willUpdate` in layout effects — declared as a
  dependency of `components-react`. It was already on disk as a dependency of `@tanstack/solid-virtual`, so nothing
  new was fetched; the Solid side has since moved onto it too. **A change `virtual-core` marks as needing to land
  at once is flushed at once**, as `@tanstack/react-virtual` does, so a jump to the far end of a long list lands in
  one step instead of showing an in-between layout for a frame or two — found by `select.spec.ts`'s End case, which
  reads the rows the moment the highlight lands and saw one row over another. The flush is skipped when the change
  arrives from inside React's own work (a row measured as React attaches it, the mount and update effects), where
  React refuses to flush and says so; there the change waits for the next render as before. Row measuring needs none of the Solid side's deferral, because React attaches a ref only after
  the element is in the document.
- **A component that records its items' elements as state takes a detach and reattach of the same element as no
  change.** `Tabs` hands each tab's element through the consumer's `linkComponent`, and a router's link typically
  gives its element a new ref function on every render, so React detaches and reattaches it each time. Recording
  that as two writes left a new array with the same entries, which counted as a change, rendered again and looped.
  `Tabs` now keeps the latest elements aside and only replaces its state when the list, once every ref of the commit
  has run, differs. `Toolbar`, `Range` and `Satellite` record elements the same old way, but only from refs of
  their own that never change, so they cannot loop; they were left as they are.
- **`CarrierUtils.end` needs no batch under React**, which batches the two writes of a move between zones on its
  own.

### Porting: how a component is carried across

Settled when `InteractionWrapper`, `Button`, `Tooltip` and `Label` were ported by hand as the pattern for the rest.
Taken on Claude's judgment, since the user asked for the components to be ported without supervision.

- **A React component keeps the Solid component's name and its props' names**, adapted the way the abstracts' hooks
  are: plain values instead of accessors, a `[value, setValue]` pair where Solid takes a signal pair, `render*` callbacks handed plain values
  and returning `ReactNode` (`renderContent(flags)` rather than `renderContent(getFlags)`), React's own event types,
  `className` for `class`. A prop that means the same thing is spelled the same in both, which is what the eventual
  Playground switch needs. `Tooltip`'s `anchorRef` is the case that shows the limit of it: it is an element value in
  both frameworks, not a React `RefObject`, because that is what the name means in the Solid component.
- **Logic that is not about the framework moves into the component's own `.utils.ts` and both views call it**, as the
  abstracts' logic did. `TooltipUtils.describe` — adding a tooltip's id to its anchor's `aria-describedby` and taking
  it back out without disturbing anyone else's — is the first; `LabelUtils.resolveAriaLabel` and `warnIfShadowed`
  the second, which split `Label.utils.ts` into a framework-free `LabelUtils` and a Solid `LabelSolidUtils` exactly as
  the abstracts were split.
- **Styles, defaults and types reach both framework packages through the core's `index.ts`.** Every `.css.ts` is exported as a namespace
  named after its file stem plus `Styles` — `TooltipStyles.tooltipRoot` — because the class names are the contract
  both frameworks share and a flat export would collide (`Tooltip` and `HoverCard` both declare `bridgeTopVar`). Every
  `.const.ts` and every `.types.ts` is exported whole, and holds nothing Solid since the split
  (_"The three packages"_). React never imports a Solid props type: each React component declares its own in its own
  `.types.ts`.
