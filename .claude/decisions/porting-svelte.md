# Decisions: porting-svelte

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Porting: how the Svelte side reads

Derived while porting `Utils/`, every abstract, the primitives, the composites and the generators, and applied to all
of them; the components ported after should keep to it. Taken on Claude's judgment, as the port was asked for
unsupervised. The shapes are Solid's more often than React's, because runes are fine-grained the way signals are.

- **A helper keeps the Solid helper's name, arguments and return shape: getters in, getters out.**
  `ElementFaderSvelteUtils.createFader(getIsVisible, opts)` returns `getIsVisible`, `getTransitionTarget` and the rest,
  as Solid's does, because a Svelte helper runs once while its component is being set up, and a plain value handed in
  or out would be read that once. The file is `<Subject>Svelte.utils.svelte.ts` when it uses a rune and
  `<Subject>Svelte.utils.ts` when it does not (`SelectionSvelteUtils`, `GlassSvelteUtils`, the gradients and patterns).
  One helper was renamed rather than copied, because its Solid name carries the mechanism:
  `NavigatorSvelteUtils.createDirection` for `createDirectionSignal`. A defs type that is Solid's `AccessorProps` block
  becomes explicit getters in Svelte (`RotatorDefs.getStepCount`), the shape the core's own defs already use.
- **A store is read through `readStore(store, select)`** in `Utils/storeUtils.ts`, over Svelte's `createSubscriber`. It
  answers a getter that subscribes while an effect, a `$derived` or markup reads it and answers the current value
  without subscribing anywhere else, and it compares the selected part with `Object.is` before waking anyone. It needs
  no component, so the module-level state Solid mirrors into a signal — `Elevation`'s layers, `Carrier`'s carry, the
  pointer's presence — is a module-level `readStore` in Svelte, with nothing subscribed until something reads it.
- **An element is `$state` filled by `bind:this`, handed to a helper as `() => element`.** That is why the Svelte
  `Utils/` has no `refUtils`: `useElement` exists because a React ref is not state, and `bind:this` already is;
  `useLatest` exists because a React component's props are this render's, and a Svelte component's `props` object is
  read lazily, so a closure made once always sees the current ones; `useStableList` exists because an effect's
  dependency list compares arrays, and a Svelte effect tracks the state a list was built from instead. `bind:this`
  writes `null` when the element goes, so helpers test for an element rather than for `undefined`.
- **Where a helper or a wrapper needs the caller's element, it hands out an attachment rather than a ref setter.**
  `AnchorSvelteUtils.createPortalPosition` returns `attachContent`, `VirtualizerSvelteUtils`' `measureRow(index)` is an
  attachment, and `InteractionWrapper`'s `renderControl` snippet is handed `attachElement` as its first argument, to go
  on the interactive element with `{@attach}`. So the Svelte `InteractionControlProps` carries `attachElement` where
  React's carries `ref`: it is the wrapper's hold on its leaf, which a consumer never reads, and `ref` is kept for the
  element a consumer does.
- **`ref` is a `$bindable` element**, bound with `bind:ref`. A component that needs its root only as an element binds
  `ref` straight to it and reads it from there (`PlacementBox`'s `bind:this={ref}`); a wrapper writes it from its
  attachment, and a preset over a wrapper passes it through with `bind:ref`.
- **Two-way state is a `$bindable` prop under the stem, and the fallback is the uncontrolled case.** Optional ones take
  their initial value there — `Carousel`'s `index = $bindable(0)` and `playback = $bindable(true)`, `Wheel`'s
  `targetIndex` and `autoSpin` — and required ones take none (`TextField`'s `value`, `Spotlight`'s `visibility`). Handed
  on to a core or a helper, it is a `ValuePair<T>`, `[() => value, (next) => (value = next)]`, built where it is passed.
  A bound prop reads through the owner's getter on every read, so a write the owner refuses — a function binding
  `bind:value={get, set}` whose setter drops it — leaves the component reading the owner's value; a control holding a
  native value still has to put the element back, which `BinarySwitchUtils.syncElement` and `TextSync` already do. A
  prop with a fallback cannot be bound to `undefined` (Svelte throws), so a prop whose meaningful value may be
  `undefined` takes no fallback.
- **`SignalMirrorSvelteUtils` keeps only what `$bindable` does not cover**: `createMirror` and `createValueMirror` for
  an inner copy, `createSplit` for one value edited as two, and `createOptional` for a helper whose pair may be missing.
  `createPassThrough` has no Svelte half, since a `ValuePair` already is one.
- **A `render*` prop is a `Snippet` taking React's plain arguments**, drawn with `{@render props.renderContent(flags)}`.
  Svelte hands a snippet its arguments lazily, so a plain value stays live inside it, as Solid's getters do.
  `children` is the `children` snippet. A snippet the component builds and hands to its consumer inside a record —
  `CarouselControls.renderStep` — is a top-level snippet of the component, referenced from the script. A component that
  adapts a snippet's arguments declares a snippet of its own inside the child's (`InteractionWrapper`'s tooltip,
  `Carousel`'s controls).
- **Markup held as a value is `SvelteMarkup`, drawn by the `Markup` component in `Utils/`.** Wherever React returns a
  `ReactNode` from a function — the gradient, pattern and filter builders, `Glass`, a defs record's `renderDefsElement`
  — Svelte returns `markup(Component, props)` or `{ snippet }`, a list of those, or nothing. It is never a function, so
  a parameter taking markup or a function producing it (`computeLinearGradient`'s `custom`) still tells them apart. The
  generator is a private component (`SVGLinearGradient.svelte`, `SVGFilterElement.svelte`) and the namespace keeps
  React's name and arguments (`SVGGradientDefsSvelteUtils.computeLinearGradient(defs, custom)`, `SVGFilterDefsFactory`),
  so a sample ported later reads line for line. Drawn again with the same component, markup updates in place rather than
  mounting afresh. `SVGDefs` is `SVGDefsOf<SvelteMarkup>`. A component whose root is an SVG element outside an `<svg>`
  of its own file declares `<svelte:options namespace="svg" />`.
- **An SVG animation restarts by `{#key}`**: `SVGAnimationDefsSvelteUtils.createAnimateDefs(getDefs)` returns `getKey`,
  the record's identity, and `getAttributes`, whose attachment key does the scheduling, as React's key and attributes
  do. The pattern index is written inside `flushSync`, for the reason React's is.
- **`useEffect` and `useLayoutEffect` both become `$effect`, which runs after the DOM is updated and before the browser
  paints.** `$effect.pre` is for what must land in the same update as the change that caused it: what Solid does in
  `createComputed` or `createRenderEffect` and React during render — `PlacementItem` starting its glide, `Spotlight`'s
  placed flag, `TextSync`, the virtualizer's options, `Mosaic` noting where focus was before its tiles move. A cleanup
  with no condition is `$effect(() => stop)`. Solid's `on(source, fn, { defer: true })` is `watchChange(getValue,
onChange)` in `Utils/effectUtils.svelte.ts`, with `isBeforeRender` for the `$effect.pre` form.
- **An effect reads what it depends on, then calls the core inside `untrack`.** Svelte tracks every read made while an
  effect runs, the core's own included — a getter over a prop, a store the call writes and reads back — and a call that
  writes what the effect has read reruns it. So the shape is
  `$effect(() => { const ref = getRef(); if (!ref) return; return untrack(() => core.observe(ref)); })`.
- **A core object is made once in the component's script and reads the props through closures.** The script runs once,
  so nothing stands in for `useState`'s initializer or `useLatest`. Where a core reads an optional function's presence
  at event time, the defs object carries a getter for it (`get computeSpinDefs() { return props.computeSpinDefs; }`),
  as React's does.
- **Props are read as `props.x`, with the bindables destructured beside them**: `let { value = $bindable(), ...props } =
$props()`. Defaults are `$derived(props.x ?? DEFAULTS.x)`. A local is never named `state`, `effect` or `derived`,
  because `$state` then reads as a store subscription to it and the file stops compiling.
- **A generic component declares `<script lang="ts" generics="T">`**, or `generics="TExtra extends object = {}"`, and
  the type is inferred from the props at the call site; a snippet's parameters may name it.
- **A context is Svelte's `createContext`**, and each `.context.ts` exports `set<Name>Context` and `get<Name>Context`,
  the getter answering the same fallback the React hook does (`hasContext() ? getContext() : fallback`). The window
  fallback of `getViewportContext` reads `svelte/reactivity/window`, so its size is reactive where React re-renders on
  resize. `ColorExtractor`'s context holds getters, as Solid's does; `createColorExtractor(context?)` and
  `getColorExtractorContext()` are React's `useColorExtractor` and `useColorExtractorContext`. A context file that
  uses a rune is `.context.svelte.ts`.
- **A portaled layer is `attachPortal(target)` on its outermost element, and that element is the only node of its
  `{#if}`**, since Svelte removes a block's nodes by walking from its first to its last, and a moved element's new
  neighbors would otherwise be walked too. Svelte also listens on the document, so the element's own handlers fire
  wherever it was moved to. **The move puts back every scroll position inside the element.** The attachment runs after
  the effects of what the element holds, and taking an element out of the document resets the scroll of everything
  in it, so a popup's highlighted row revealed the moment it mounted — a menu opened on its last item, `Clock`'s
  selected hour — was shown and then scrolled away again as the popup moved. React, Solid and Vue build a portal's
  content in its target and never meet this.
- **Styles are strings.** `style:property` for what the markup names, and `toStyle(...)` in `Utils/styleUtils.ts` for a
  record — what the core's style helpers and `assignInlineVars` return — hyphenating camelCase keys and leaving a
  custom property's name alone. Classes are `class={[a, isB && b]}`.
- **`useId` is `$props.id()`.**
- **A controller's getters read runes, so they are live in an effect, a `$derived` or markup**, and it carries no
  `subscribe`: that was React's addition for `useSyncExternalStore` (`WheelController`).
- **Relative imports are fully specified** — `.js` for a `.ts` or `.svelte.ts` module, `.svelte` for a component —
  because `svelte-package` emits the tree as it is rather than bundling it. **The commit hook formats no `.svelte`
  file**, having no parser for one, so those are written in the house format by hand, import order included.
- **An object or array written to a `$bindable` prop comes back as a copy, and `createHeldValue` in
  `Utils/bindableUtils.svelte.ts` answers the value written.** Svelte wraps a plain object or array in a watched copy
  when the component writes it to a prop nothing is bound to, and so does a consumer's `$state` bound to it, so a
  component that later finds the value by identity — the option it picked, the node it zoomed into, the rows it selected
  — finds nothing. Every component that writes such a value and then compares it holds the prop through
  `createHeldValue([() => value, (next) => (value = next)])` and reads and writes the pair instead of the prop: the
  hierarchy charts' branch or focus, `Table`'s selection, `Accordion`'s and `Tree`'s expanded lists and `Tree`'s value,
  `Menu`'s and `ContextMenu`'s checked lists, `Toolbar`'s pressed values, `Listbox`, `MultiListbox`, `Select`,
  `MultiSelect`, `RadioGroup` and `CheckboxGroup`. A value only read for its fields — `ColorArea`'s channels, `Range`'s
  pair, a date range, `Table`'s sort and widths, the sortables' items, which are found by key — needs nothing. The
  helper compares with `Object.is` rather than `===`, because a development build rewrites `===` in a Svelte module to
  warn whenever a copy meets its original, and that meeting is the helper's whole job. It mends only what the component
  reads: the consumer's own `$state` still holds the copy, which is why the charts' docs still ask for `$state.raw`.
- **Where Svelte's accessibility checker objects only to where a handler sits, the handler is attached instead**, as
  `{@attach (element) => on(element, "click", handleClick)}`, and the markup stays React's. The checker reads handler
  attributes: a `click` on an element with no key handler, a `keydown` on an element with no role, an interactive role
  holding a handler but no `tabindex` in the source (because a leaf's `tabindex` is written at mount by
  `InteractionWrapper`). `on` from `svelte/events` runs in order with Svelte's delegated handlers, so the order of
  events does not change. Only the handlers the checker names move; the rest of an element's handlers stay attributes,
  as `Tree`'s `onfocusin` does. The checks that ask for different markup are left firing, since the markup is React's: a
  non-negative `tabindex` on an element with a non-interactive role (`EdgeFader`, `ContextMenu`'s region, `Reveal`,
  `CardStack`, and the tiles, arcs and circles of `Treemap`, `Sunburst` and `CirclePacking`), an `aria-*` attribute the
  role does not list (`aria-disabled` on the sortables' lists and items, `aria-required` on `Range`'s slider,
  `aria-invalid` on `ColorArea`'s group and `ColorInput`'s field button, `aria-haspopup` and `aria-expanded` on
  `ContextMenu`'s group), a `<button>` with `role="separator"` in `SplitPane`, and `CellAnimation`'s hidden `<img>`,
  which carries `aria-hidden="true"` and no `alt`. A literal `tabindex="-1"` is written as a string, which renders the
  same, since the checker reads an expression as possibly non-negative.
- **React's bubbling `onFocus` and `onBlur` are `onfocusin` and `onfocusout`**, since Svelte's `onfocus` and `onblur`
  are the native events, which do not bubble. Where React's handler checked `e.target === e.currentTarget` to keep only
  the element's own focus, the Svelte one is plain `onfocus` and needs no check.
- **An id composed from a prefix is `$props.id()` plus a suffix**, so the generated text differs from React's while
  every `aria-*` reference still points at the right element.
- **Elements a component collects are held two ways.** A `Map` or a plain array filled from `bind:ref={getter, setter}`
  when they are only read in handlers (`Sortable`, `TileBoard`, `Timeline`, `Accordion`); a `$state.raw` array or record
  replaced by a setter wrapped in `untrack` when an effect has to follow them (`Tabs`' indicator, `Toolbar`'s overflow,
  `Toasts`' measuring), since the setter runs inside the binding's own effect and would otherwise subscribe it to the
  list it writes.
- **A snippet cannot answer nothing, so a `render*` React falls back from when it returns nothing falls back only when
  the prop is left out** (`Clock`'s `renderColumn`, `Odometer`'s `renderDigit` and `renderFixed`). Where the fallback is
  what the consumer wants for some calls only, the snippet is handed it: `RichText`'s `renderTag` gets a fourth
  argument, `renderDefault`, to render for a tag it leaves to the class map.
- **A two-way value handed to a snippet is a `ValuePair`**, `[() => value, (next) => …]`, which a consumer passes to a
  function binding as `bind:hsv={hsv[0], hsv[1]}`: `ColorInput`'s `renderPopup` channels and the date pickers'
  `renderPopup` month.
- **A context the React component provides around its children is set by a private component**, since a Svelte context
  is set while a component is being set up and a snippet has no setup of its own: `FormFieldControl` and
  `FormSectionContent`.
- **Text beside an element is written with no whitespace between them where React's JSX has none**, since a Svelte
  template keeps the space a line break leaves and JSX drops it.
- **`readStore`'s listener wakes its readers untracked**, since a store can be written from inside an effect Svelte is
  running — a field blurred as its block is torn down writes the focus store there.

**Divergences from React that were accepted.**

- **An event inside a portal does not reach the handlers of the components around where it was declared.** React's and
  Solid's events follow the component tree through a portal; Svelte's follow the document. Nothing ported so far relies
  on it; a component that does will need the handler on the portaled element itself.
- **The private leaves are files of their own** — `BinarySwitchElement`, `TextFieldElement`, `CarouselControl`,
  `MosaicTile`, `GlassSheenFilter` and the generators' components — because a `.svelte` file holds one component. Their
  props types sit in the parent's `.types.ts` as React's `BinarySwitchElementProps` does, including the two React
  declares inline (`MosaicTileProps`, `GlassSheenFilterProps`). `Surface`'s `SurfaceSVG` and `SurfaceDiv` became the two
  branches of one component.
- **`Tooltip`, `Shape`, and the `Label` and `FormField` contexts and helpers were ported ahead of the rest of
  `Essentials/` and `Exotics/`**, because `InteractionWrapper`, `TextField`, `BinarySwitch`, `PopupTrigger` and the
  surfaces are built on them.

### Porting: the Svelte components

Where a Svelte component behaves differently from the React one, and why. The mechanisms these rest on are in
_"Porting: how the Svelte side reads"_; this is the list by component, for a reader comparing the two Playgrounds.

- **An optional two-way prop that React only reports through keeps the Svelte component's own value.** `Table`'s `sort`,
  `Range`'s `value` and `range`, the checked lists of `Menu`, `ContextMenu`, `FanMenu`, `WheelMenu` and `Menubar`, and
  `Toolbar`'s `pressedValues`. Left out in React, the pair is missing, so the component shows nothing picked and the
  reader's changes go nowhere: the rows never sort, a `Range` given neither prop does not move, a checkbox item never
  checks. In Svelte a prop nobody bound and a prop bound to `undefined` read the same, so the component keeps what the
  reader did. The only thing that tells them apart is the setter Svelte's compiled props object carries for a binding,
  which is the compiler's internals and not an API, so the difference was accepted rather than built on it. `Table`'s
  `widths`, `order` and `selection` are not affected: React already treats their absence as the feature being off, and
  the Svelte table checks for `undefined` the same way and never writes them when they are left out. For the same
  reason, a prop React requires as a pair and a Svelte consumer passes without `bind:` is read once and then kept by
  the component.
- **`DateInput` and `TimeInput` rewrite their text when their spelling changes**, as they do in every framework: a new
  `format`, `calendar`, `isTwelveHour` or `hasSeconds` shows the same value in the new form. The React and Vue fields get
  there by calling `refresh` themselves, since their masked field does not watch the format; the Svelte one watches it
  inside `MaskedFieldSvelteUtils.createField`. That commits the value from the text's setter, as React's hook does,
  rather than from an effect watching the text: an effect sees a change of rules before the text is rewritten, so it
  read the old text under the new rules and committed a value nobody typed — `13:00` became `01:00` when a twelve-hour
  field went to twenty-four hours, and `12.345` became `123.45` when a currency field lost a decimal. Solid keeps its
  effect and reads the rules inside it untracked, which answers the same fault; see _"`MaskedField`: the half every
  field over a typed value shares"_. The
  rewrite follows the value, so a field that started empty picks up a change made after something was typed into it.
  It is written through the same setter as typing, so `CurrencyInput` commits the value its new spelling shows, as
  React's does, and needs no watcher of its own. With no value and a half-typed entry, React's `CurrencyInput` clears
  the entry when its grouping changes and the Svelte one leaves it.
- **`Form`'s `renderContent` is handed one state object for the form's life**, whose `isValid` and `hasSubmitted` read
  the current state, where React's is a fresh snapshot each render.
- **`Menubar` switches menus by closing the open one, flushing the update with `flushSync`, focusing the next item and
  then opening it**, where React sets a pending switch that an effect carries out; the reader sees the same thing. While
  a menu is open over a portal it listens for keys on the window, since a key pressed inside the portaled menu reaches
  the document and not the menubar's element.
- **A menu level stops Escape with `stopImmediatePropagation`**, as the Solid one does, where React calls
  `stopPropagation`: Svelte, like Solid, delivers the key from the document, where the outer levels' dismissers listen
  too, and only the immediate form keeps the key from closing them as well.
- **The link a `Tabs`, `Breadcrumbs` or `Paginator` draws is a Svelte `Component`** of the same `*LinkProps`, and the
  element reaches the navigator through an attachment in those props, which the consumer's link spreads onto its
  anchor with the rest.
- **`Reveal`'s and `ScratchCard`'s `renderCover` is handed the mask as a style string**, since styles are strings on
  this side, where React hands a style object.
- **A `Cuboid` drag settles on release by Solid's rule**, checking whether the owner accepted the new count, where the
  React one settles back only when the drag rounded to no turn.
- **`AudioSwitcher`'s controller is the core's, `reset` alone**, with no `subscribe`: the playback it would report is
  the `bind:playback` prop, which a consumer already follows.
- **In `Samples/`, a gradient or pattern that follows state is a `.svelte` component** whose module script exports the
  builder and draws itself, and a timed one is a `.ts` builder returning markup. A pattern whose id changes is updated
  in place rather than drawn afresh, and its rolls are keyed by cell id. `hand_1`, `spot_flare_2` and `spot_flare_3` are
  one component each, told which part to draw by a `part` or `ghost` prop, where React draws two.

### Porting: the Svelte Playground

How `playground-svelte/` is written, derived while porting the frame, `PageComponents/` and `ButtonPage` as the pattern
the other pages copy. Taken on Claude's judgment under the unsupervised port.

- **A React file holding one component becomes one `.svelte` file of the same name; a file holding several becomes one
  file per component, named after the component.** `SourceView.tsx` is `SourceView.svelte`; `Field.tsx` is
  `PageNumberField.svelte`, `PageTextField.svelte` and the rest, `TabContent.tsx` is `PageTabContent.svelte`,
  `PageTabFloater.svelte` and so on. `App.tsx` is `App.svelte`, `AppContent.svelte`, `PageDependencies.svelte` and
  `EmptyPage.svelte`. A value a React file exported beside its component — `STEP_GLYPHS`, `getPoints`/`getViewBox`, `INDENT_PER_DEPTH`/`LEAF_MARKER`,
  `pageColorPickerSlots` — is exported from that component's `<script module>` and imported by name beside the default.
- **The source view keys a split file by the React file it came from.** A `PageX.svelte` inside folder `F` belongs to the
  stem `F/F`, so it shares a tab with `F.types.ts` and `F.css.ts` exactly as `F.tsx` did, while the sections list the
  real file names. `.svelte` files are highlighted with shiki's `svelte` language, loaded into the shared highlighter
  from the app's own `SourceView.utils.ts`, so the shared `shiki.ts` did not change.
- **Routing is `sv-router`, created once in `App/App.router.ts`**, the one file with no React twin: `sv-router` hands
  out `navigate` and `route` from `createRouter`, so the route table has to live in a module the frame imports. It is
  built from `App.const`'s registry — each page's route maps `/` to its page and `/docs` to `DocsRoute.svelte`, and a
  page with no examples maps `/` to `DocsRedirect.svelte`, which is React's `<Navigate replace>`. `route.pathname`
  already has the base taken off, as React's location does, so nothing calls `toRoutePath`. `navigate` is typed for
  literal paths, so a computed one is cast to `RoutePath` from `App.types.ts`.
- **`index.ts` mounts the app in a microtask.** `sv-router` reads the address in a microtask of its own and again when
  `<Router>` is created; the second read happens while the page column is being drawn, and Svelte does not re-run the
  block that is drawing when it writes state that block read. So the first render showed no title or tabs on a page
  reached by its address, and only a click fixed it. Mounting after the router's own microtask means the address is
  right before anything reads it.
- **`sv-router` answers every same-origin link click in the document, not only the frame's.** A page whose example
  draws plain `<a href>` links — breadcrumbs, a mosaic, rich text — has them followed inside the app unless the example
  prevents the default, where React leaves them to the browser. `PageRouterLink` navigates itself and prevents the
  default, so `replace` needs no `data-` attribute on the anchor.
- **A page is a `.svelte` file whose examples are snippets.** State is `$state` in the page's script; `examples` is an
  `ExampleDefs[]` whose `component` is a top-level `{#snippet}` of the same file drawing the example, and whose
  `readout` is a closure over the state, so it stays live. `EXAMPLES_ROOT` and `path` name the real `.svelte` file.
  The page ends in `<PageExamples items={examples} />`. `ButtonPage` is the model.
- **An example is a `.svelte` file reading `type Props = XExampleProps; let props: Props = $props();`**, keeping React's
  props type from the page's `.types.ts`. A render prop is a child snippet of the component; a snippet inside a defs
  object, such as `tooltipDefs.renderContent`, is a top-level snippet with typed parameters, referenced by name.
- **The Playground's field adapters keep React's props**: `value` plus `onInput` or `onChange`, not `bind:value`, so a
  page's knobs read as React's do. `PageExampleKnobs`, `PagePropsPanel`, `PageProp` and `PageMeasureBox` take
  `children`. What takes a pair from a library snippet takes a `ValuePair`: `PageColorChannels`' `hsv`, the calendar
  captions' `month`. `PagePlaybackScrubber` takes `bind:playback` and `bind:progress`, since both are the page's own
  state and nothing arrives as a pair.
- **Contexts are `set<Name>Context` and `get<Name>Context`**: `Layer`, `PropsPanel`, `ExampleKnobs` and `Field`'s two
  registries, the last read through `useFieldReset(getValue, apply)`. `getLayerClass()` in
  `StyledComponents/Layer/Layer.context.ts` returns a getter and is used as `$derived.by(getLayerClass())`.
- **A record compared by identity is held in `$state.raw`.** `$state` wraps what it holds in a proxy, so a menu config
  kept in expanded-node state would no longer be the object the `Tree` was handed and nothing would read as expanded.
- **Svelte turns a line break between two tags into a space**, so inline siblings whose text must run together — a
  prop name and its `?`, a styled label beside its badge — are written with no gap.
- **Some styled components must sit inside an `<svg>`**: `PageSunburstArc`, `PageCirclePackingCircle`,
  `PageCirclePackingLabel`, `PagePatchCable` and `PageTrailTrack`. `PageFilterStage.renderDefs` returns `SvelteMarkup`.
- **The docs plugins read the Svelte package.** `componentApi` gives the TypeScript program a declaration for each
  `.svelte` module, made from the `$props()` annotation of its instance script: `Component<Props>`, or a generic function
  over the `generics` attribute, so the Components table lists each with its props type. `componentDependencies` also
  collects `.svelte` files, reads indented imports and resolves a `.js` specifier to its `.ts` file. Neither changes what
  the Solid and React apps produce.
- **A case only the Svelte app can pass is tagged `@svelte`**, and the root config's other projects leave the tag out.
  The first is the docs table's `Snippet` type text beside the `@solid` and `@react` cases.
