# Decisions: porting-components

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Porting: `PlacementBox`, `PlacementItem` and `Barrel`

- **The shared parts are `PlacementBoxUtils` and `PlacementItemUtils`**, new, holding what the Solid box's memos and
  the item's style computed: the pointer point, the arrangement, the overreach, the transition duration, the effect
  style, and `createGlideWatcher`, which replaced the Solid item's glide counter and its wait for the animations to
  finish. `PlacementBoxUtils.UNTRACKED_CONTEXT` is the inert context an item gets outside any box, shared by both
  frameworks' contexts.
- **`PlacementItemUtils.computeStyleValues` returns camelCase fields**: React spreads them as its style directly, and
  the Solid item renames the two that need it (`zIndex`, `clipPath`), since Solid's `style` takes kebab-case keys.
- **The React context keeps Solid's getter-shaped `PlacementBoxContextType`**, as the React `Label` did, with its
  value rebuilt through `useMemo` over what it hands down, so items re-render only when one of those changes.
- **A React `PlacementItem` glides when its placement object changes identity**, as Solid's `on(placement)` does. The
  change is caught during render, so the new position and its transition reach the DOM in one commit. The props
  documentation asks for the same object while an item has not moved; one built inline costs only a glide that
  finds nothing to animate and ends at once.
- **The React `Barrel`'s `renderFace` is `(item, index, face) => ReactNode`**, keyed by index as Solid's `<Index>`
  keys it, and `BarrelUtils.getRootSize` replaced the size-by-axis choice written out in the Solid root's style.

### Porting: `Popover`, `Modal`, `Drawer` and `PopupTrigger`

- **The shared parts are `PopoverUtils` and `ModalUtils`.** `PopoverUtils.computeAnchorPresence` is the rule for
  when a pinned popup gives up on an anchor that has scrolled away, and `getIsFocusKeptOnPress` the `dialog` check a
  press reads; `ModalUtils` holds the swipe-to-dismiss rules (`getSwipeDirection`, `getSwipeAxis`,
  `getIsSwipeDismissal`, `computeSwipeTransform`), the size cap and which dismissal reasons a modal honors.
- **Events cross a portal the same way in both frameworks**, so a React handler standing in for a delegated Solid one
  needs no check on where in the document the event started: Solid's delegated events follow the component tree
  through a `Portal`, and React's synthetic events do too. **Blur is the exception.** Solid's `onBlur` is a native
  listener on the element alone, React's fires for anything inside losing focus, so the React `Popover` answers
  `onBlur` only when `e.target === e.currentTarget`.
- **The React `Modal` declares its sealing effect before its auto-focus.** React runs effect cleanups in declaration
  order, so the page behind is unsealed before focus is put back — restoring first would reach for a trigger that is
  still inert.
- **`initialFocusRef` is an element value, as `anchorRef` is**, and `visibility` is a `[value, setValue]` pair.
- **A story that portals needs a full-window layer**, because a dialog portaled straight into `document.body` is only
  as tall as the body's content; each Playground's viewport supplies one.

### Porting: the form family — `Form`, `FormField`, `FormSection`, `TextField`, `BinarySwitch` and the presets over them

- **The shared parts are `FormUtils`, `FormFieldUtils`, `BinarySwitchUtils`, `CheckboxGroupUtils` and
  `TextFieldUtils`**: validity and which field an error sends focus to; `aria-describedby` resolution (with
  `FormField.utils.ts` split into framework-free `FormFieldUtils` and Solid `FormFieldSolidUtils`, as `Label` was);
  the switch role dropped while mixed and the write of `checked` and `indeterminate` onto the input; a group's
  checked-state fold and list arithmetic; a text field's padding, inset, input type, auto-sizing, spin value and
  content measurement. The Solid adornment-width observer now goes through `ElementObserverUtils.observeBorderBoxSize`.
- **A React form's contexts carry one member Solid's do not, `reportChange`** (`FormReactContextType`). A React field's
  entry getters read refs, so the field or section reports from a layout effect when its error changes, and the form
  re-renders and reads them again; a section passes the report on to the form above it.
- **A React form moves focus after the submit's render is applied, not inside the handler**, since errors that appear
  because the form now counts as submitted arrive in that render. Under Solid they are visible at once, so both land
  in the same place.
- **The React `CheckboxGroup` hands its controller over again, as a new object, whenever its checked state changes**,
  because a select-all box drawn outside the group renders before it and would otherwise stay a change behind. Its
  `register` returns its own cleanup (`CheckboxGroupReactContextType`).
- **The React `BinarySwitch` keeps its input uncontrolled, as the Solid one does**, writing `checked` and
  `indeterminate` through `BinarySwitchUtils.syncElement`, so a refused write leaves the input showing what its owner
  holds.
- **The React `TextSync` hook shows the core the text just typed until the next render.** The core writes the owner's
  value back straight after `onInput`, and under React that value is still the previous render's, so an unmasked field
  typed "Ada" came out "daA". The hook now holds the typed text for the core, forces one render, and brings the input
  in step with whatever the owner decided. One difference from Solid remains: a masked write the owner refuses is put
  back to the owner's value, where Solid leaves the masked text showing.
- **`LabelUtils.warnIfShadowed` takes the prop's name** so each framework's warning names what its caller wrote; the
  Solid one still says `getAriaLabel`, which is what `e2e/label.spec.ts` reads.

### Porting: the carousels and the wheels

- **The shared parts are `CarouselUtils` and `WheelUtils`**: the swipe rules, when a step is disabled, when rotation
  runs and stops at the end, what is announced, the drum's turn angle and the track's transform; and the wheel's
  layout, marker correction, wedge angle and transform, what counts as selected while idling, and the whole per-wedge
  pointer effect.
- **A React controller handed over through `onMount` keeps the Solid getter names and adds `subscribe`.** In React a
  getter called while rendering never re-renders its caller, so a Spin button could not follow `getIsSpinnable`; the
  getters answer with what the wheel last drew, backed by a store that ignores writes that change nothing, and one
  getter plus `subscribe` is what `useSyncExternalStore` takes. `WheelController` is the model for every other
  controller ported after it.
- **`CarouselControls` is handed out through `onMount` in React as in every framework**, since the carousel draws no
  controls of its own; see _"The carousel draws no controls; the consumer builds them on a controller"_.
- **The drum carousel's resting angle is held in React state together with the index and count it was worked out
  for**, and worked out again during render when those change, so the accumulating angle is never painted one frame
  stale.
- **A core type is reused in React where its documentation reads true for both**; `CarouselState` is redeclared on
  the React side only because its documentation names `playback`.

### Porting: the SVG generators, `Shape`, `Surface`, `GlassSurface`, `CornerHighlight` and `Glass`

- **One SVG defs record, generic in the core**: `SVGDefsOf<TElement>` in `SVGDefs.types.ts`, with Solid's `SVGDefs` as
  `SVGDefsOf<JSX.Element>` in `SVGDefsSolid.types.ts` and React's as `SVGDefsOf<ReactNode>` under the same name in the
  React package. **The plain-value description types keep the canonical names** (`SVGLinearGradientDefs`,
  `SVGSpecularLightingFilterDefs`…) in the core; Solid's accessor forms are `…SolidDefs`. That is what let
  `Glass.types.ts` stop borrowing Solid types, and `Glass` rejoined `core.ts`.
- **A filter's bookkeeping is the core's**: `SVGFilterDefsUtils.createRegistry` decides which effects are kept, what each
  is named and reads, and how far the region reaches; each framework's `SVGFilterDefsFactory`, the same class name in
  both packages, only writes the elements. The gradients' stops (`computeStops`, one flat list), the patterns' cells and
  the animation scheduler (`SVGAnimationDefsUtils.createScheduler`) moved the same way.
- **The framework owns the SMIL pattern index**, handed to the scheduler as a getter-and-setter pair whose setter must
  have written `repeatCount` before it returns, because the elements are begun again straight afterwards; React's
  `useAnimateDefs` therefore sets its state inside `flushSync`, matching Solid's synchronous signal.
- **In React a restart is owned by a key that describes the animation.** React keeps elements across renders, so
  `useAnimateDefs` returns `key = computeIdentity(defs)`, built from the duration and patterns by value: a changed
  animation rebuilds its `animate` elements and a render describing the same one leaves them running. Solid keeps its
  rule that a new defs record rebuilds.
- **A defs element that needs hooks is a component** — the React Glass sheen is a private `GlassSheenFilter`, so
  following the pointer re-renders only the filter.
- **`ShapeLayerUtils`, not `ShapeUtils`**, is Shape's framework-free half, since `ShapeUtils` is the `ss-utils`
  namespace Shape itself imports. React's `Shape` takes plain values: `computeFillDefs(size, element)` and
  `renderChildren(size, clipPath, clipPoints)`. `SurfaceUtils` holds the named-to-clockwise conversions `Surface` and
  `GlassSurface` both used to copy.
- **The samples stay Solid-only for now**; React stories build their own paint.

### Porting: the overlays — `HoverCard`, `Toasts`, `Sidebar`, `Preview`, the spotlights, `Accordion` and `Collapsible`

- **The shared parts are new `CollapsibleUtils`, `AccordionUtils`, `PreviewUtils`, `SidebarUtils` and `HoverCardUtils`,
  and extended `ToastUtils` and `SpotlightUtils`**: headings, axes and extents; single- and required-expand rules and the
  arrow walk; overflow and overlay targets; the sidebar's phase and its pointer-away watch; the hover card's hold,
  dismissal, focus return and anchor listeners; the toasts' admission, overflow trim, countdown with its pause
  arithmetic, and the F8 hotkey route; the spotlight's dismiss keys and focus hold. `Preview` now reuses
  `CollapsibleUtils.scrollIntoView` rather than a copy of it.
- **The React `HoverCard` keeps its panel element in state, not a ref**, because the panel is drawn inside `Popover`,
  which mounts it on its own fade state without re-rendering `HoverCard` — a ref was never re-read, and the bridged gap
  lost the card.
- **React views that act when a fade finishes act on a real change of `hasTransitionFinished`**, not on its rendered
  value: in the render where the flag that starts the fade flips, the fader still reports finished from before.
- **React Spotlight converts `CutoutUtils.getMaskStyle`'s hyphenated keys to camelCase** before handing them to
  `renderOverlay`.
- **Under React's development double mount, a fade's `onShow` fires twice** — show, cancel, show — since `cancel` does
  not take back an `onShow` already fired. Production mounts once. The React toasts spec asserts the arrival was
  reported rather than reported exactly once.

### Porting: the navigation controls — `Tabs`, `Breadcrumbs`, `Paginator`, `Stepper`, `TableOfContents`, `Tree` and `Sortable`

- **Keyboard decisions come back as action descriptors** — `TabsKeyStep`, `TreeKeyAction`, `SortableKeyAction` — and
  each view carries them out. Any action claims the key; `undefined` lets it through. Tree hands typeahead in as a
  `pushQuery` callback, so `*` is claimed before the buffer ever sees it. The roving index, the navigable set, the
  floater's bounds (`TabsUtils.observeSelectedBounds`), expand and collapse, the focus rescue when a branch closes
  from outside, the table of contents' target bookkeeping and the sortable marker's geometry all moved into the
  components' `.utils.ts` the same way.
- **A record that carries a tooltip is generic over the tooltip's type** — `TreeNodeRecord<T, TTooltipDefs>`,
  `SortableItemRecord<T, TTooltipDefs>` — so one set of core rules serves both frameworks, and each framework's props
  fix the tooltip to its own `InteractionTooltipDefs`.
- **`SortableUtils.createZone` builds the whole `CarrierZone` from getters**; Solid registers it directly and React
  hands it to `CarrierReactUtils.useZone`. The carry state reaches the pure helpers as explicit values, so Solid's memos
  still track the mirror signals.
- **React Tree focuses a row outside the virtualized window after it is drawn**, from a layout effect, since React does
  not draw the pinned row synchronously the way Solid does.
- **React Tabs and Tree reset the roving `focusedValue` by adjusting state during render**, and React
  `TableOfContents` remembers the value it last reported in a ref, so the development double mount never reports the
  initial one.
- **Link props include the ref**: `TabLinkProps`, `PaginatorLinkProps` and `TreeLinkProps` are the anchor's attributes
  plus `href` and an optional `ref`, and Breadcrumbs reuses `TabLinkProps` as it does in Solid.

### Porting: the text inputs — `NumberInput`, `CurrencyInput`, `SegmentedInput`, `TagInput` and `FileInput`

- **The shared parts**: `NumberInputUtils` gained the key moves, the settle-on-leave clamp and `createStepRepeater`, the
  hold-to-repeat timers; `CurrencyInputUtils.createFieldRules` holds every masked-field rule but the value's own getter
  and setter; `SegmentedInputUtils.observeSelection` holds the drag and every selection listener; `TagInputUtils` holds
  the add, remove and key decisions; and `FileInput.utils.ts` split, as `Label`'s did, into `FileInputUtils` —
  `createDropTracker`, a store plus a restartable `observe` — and `FileInputSolidUtils.trackDrop`.
- **`CurrencyInputUtils.createFieldRules` takes one getter per input, not one record.** Solid runs its updates in the
  order they subscribed; reading the digits through the whole grouping turned the old digits into an amount before the
  text was rewritten in the new decimal count, which `e2e/currencyInput.spec.ts` caught. Narrow getters restore
  Solid's order.
- **The React masked field does not watch the format.** The Solid `createField`'s third effect rewrites the text when
  the format changes; the React `useMaskedField` has no counterpart, so a caller whose spelling can change hands the new
  spelling to the text setter or calls `refresh`. The React `CurrencyInput` does the former when its grouping changes.
- **The React `NumberInput` reads its text through a ref beside the state**, because a held stepper repeats on a timer
  started in an earlier render.
- **The React `FileInput` brings the native input back in step after every change event**, counting changes as
  `TextSyncReactUtils.useValueSync` does, so a refused pick still reverts the input.
- **The React `TagInput`'s text field is a small inner component with a stable ref callback**, so the consumer's `ref`
  is not handed `null` and then the element on every render.

### Porting: the menus — `Menu`, `FanMenu`, `WheelMenu`, `Toolbar` and `Menubar`

- **The shared rules take a framework-free `MenuItemRecord<T>`**, which each framework's `MenuItem` satisfies
  structurally; the functions that hand items back are generic over the item type. A menu level's keys come back as a
  `MenuLevelKeyStep` (dismiss, claim, activate, open, close, highlight) and a toolbar's as a `ToolbarKeyStep`, as the
  navigation controls' do. The document listeners — the pointer reader, the flick, the context-menu requests — are
  `observe*` functions in `MenuUtils`; the wheel menu's band arithmetic and the fan's layout constants moved into
  `WheelMenuUtils` and `FanMenuUtils`.
- **The React menubar switches menus over two commits.** React applies a switch's close, focus and open in one commit,
  after which the old menu's focus-restore cleanup pulled focus back to the old word; so the key handler closes the menu
  and records the target, and an effect on the next pass focuses that word and opens its menu, with every cleanup run
  first. `e2e/menubar.spec.ts`' Escape-after-handover case pins it, run against both Playgrounds.
- **A React menu level resets its highlight, open submenu and covered flag during render when `isOpen` flips**, which
  is Solid's effect without a frame of stale highlight; a laid-out menu keeps its Escape from the dismisser with
  `stopPropagation` on the React event.
- **The toolbar's tab stop follows focus however it arrives.** Both frameworks now answer a focus inside the row with
  `ToolbarUtils.computeStopAt`, so a clicked or tabbed-to action is where the arrows walk on from, as the published
  toolbar pattern has it. Before, only the arrows moved the stop, and ArrowRight after clicking the fourth action went
  on from the first. Found while porting and fixed in both.

### Porting: the list controls — `Listbox`, `MultiListbox`, `Select`, `MultiSelect` and `TextInput`

- **`Listbox.utils.ts` split, as `Label`'s did**: `ListboxUtils.createCursor` is a store of the highlighted value and
  focus with its commands, `ListboxSolidUtils.createCursor` keeps the old Solid shape, and the pure pieces — navigable
  indexes, option ids and text, the combobox ARIA both `Select` and `TextInput` wrote (`computeComboboxAttributes`),
  the windowed runs and pinned rows, and `createReachEndGuard` — live in `ListboxUtils`. Two effects stay per
  framework because they follow state rather than a key: clearing the highlight when the list closes, and moving
  focus to the highlighted option in a roving list.
- **Select's records carry their tooltip type as a parameter** (`SelectOption<T, TTooltipDefs>` and its neighbors),
  defaulting to Solid's, as `Tree`'s and `Sortable`'s do.
- **The React `Select` waits for the closing fade before emptying its query**, since the React `Popover` reports the
  fade's start one commit late; the render where the list closes marks the popup unsettled itself.
- **The React end marker is keyed by a counter bumped whenever the options array is replaced**, matching the Solid
  keyed `Show` that observes each new array afresh; and a React option answers `onFocus` only for focus on itself, as
  the `Popover`'s blur does.

### Porting: `Radio`, `RadioGroup`, `Range`, `ColorArea`, `ColorInput` and `SlideButton`

- **The shared parts**: new `RadioGroupUtils` (entry order, the roving and selected entries, the key target, the floater
  bounds), `ColorAreaUtils` (the axes' percent, value text and dragged color, `syncAxis`) and `ColorInputUtils` (the two
  directions that keep a value and a color in step); `RangeUtils` gained the values, ratios, fill and thumb bounds, and
  `createThumbs`, which holds all of the old element's change-start and change-end bookkeeping, the nearest-thumb raise
  and the write-back onto each input; `SlideButtonUtils.createGesture` is a store of holding and grabbed with the drag,
  key and hold commands, replacing the Solid element's hold loop.
- **`RadioGroup`'s floater was a copy of `Tabs`'** until a third consumer arrived; both now use the `Floater`
  abstract.
- **A React radio registers again whenever its value, disabled state or reachability changes**, and the group's
  `register` returns its own cleanup (`RadioGroupReactContextType`), since the group reads those through the entry's
  getters and would not otherwise re-render to see them.
- **The React `Range` listens for the native `change` event**, because React's `onChange` fires on every `input`;
  `onChangeEnd` rides on it. Its `onInput` is handed the values the write produced, where Solid's reads the owner's
  back — they differ only when the owner refuses the write.
- **Ref callbacks on raw inputs are made once and memoized per index or axis** in the React `Range` and `ColorArea`, since
  an inline one is detached and attached on every render, and doing that while writing element state loops.
- **The React `SlideButton` keeps its progress in a ref beside the owner's value**, because its release check can run while
  the owner's state is still a pointer move behind; the React `ColorArea` decides whether focus after a press shows a
  ring from a pressed ref for the same reason.
- **React specs find an element by a `useId` id through `[id="…"]`**, since React's generated ids hold characters a `#`
  selector cannot take.

### Porting: the date and time family — `Calendar`, `RangeCalendar`, `Clock`, `DateInput`, `TimeInput` and the pickers

- **The shared parts**: `CalendarUtils` and `ClockUtils` gained each key's action (`computeKeyAction`), the move and
  pick rules, the roving day or unit, the per-cell flags and the label and announcement formatting; new
  `DateInputUtils` and `TimeInputUtils` hold what were module helpers inside the Solid files, with `parseDigits`, the
  era and meridiem rules and the time stepping; `RangeCalendarUtils` holds the half-entered range; the date-range
  split and the date-time picker's time bounds moved into their own `.utils.ts`.
- **The era and meridiem records a painter is handed are plain values in React** — `{ value, options, set }` and
  `{ value, set, toggle }` — since the painter runs again on every render and a getter would only return what the value
  holds.
- **The React `CalendarComposite` takes `anchorDay` as a value** rather than Solid's callback, since it is an effect's
  dependency for moving the highlight.
- **Calendar cells and clock options are keyed by index, as Solid's `<Index>` keys them.** Keyed by date, paging from
  the keyboard would remount every cell and drop focus before the effect moving it could run.
- **A React picker closed by Escape returns focus to its field in an effect, after the close has been applied**,
  since focusing inside the handler was undone by the popup's own focus restore as it unmounted.
- **The React `DateInput` memoizes its value in the chosen calendar and keeps its anchor date in state**, replacing it
  only when the calendar, era or year actually changes, which is what Solid's memo equality did — otherwise a new
  date object each render re-ran the masked field's value effect and overwrote a half-typed entry.
- **The React `TimeInput` steps by setting the value and the selection, and lets the masked field rewrite the text**;
  committing the text itself re-read it with the old meridiem, so 11:30 pm stepped to noon rather than midnight.

### Porting: `Table`, the mosaics, `Scroller`, `SplitPane`, the switchers, `EdgeFader`, `Progress` and `ViewportWrapper`

- **The shared parts**: `TableUtils.computeKeyCommand` is the table's whole key decision tree, returning a
  `TableKeyCommand` each view carries out, beside the resize, carry, sort and render-props arithmetic, with the column's
  non-rendering fields as `TableColumnDefs<T>`; `MosaicUtils` holds the layout, the order, `createSlotKeeper` and the
  glide; new `Progress`, `EdgeFader`, `ViewportWrapper`, `Scroller`, `SplitPane`, `ImageSwitcher` and `ImageMosaic`
  utils hold what the Solid memos and effects did; and `AudioSwitcherUtils.createSwitcher` owns the pair of `Audio`
  elements and their fades, with the binding reporting playback changes through `followPlayback`, since playback stays
  the consumer's getter-and-setter pair.
- **The React `AudioSwitcher`'s controller is `reset` plus `subscribe`**, backed by a store of the playback it last
  reported; on stop the core forgets the current source, so the development double mount can load it again.
- **The React `ViewportWrapper` provides the React viewport context** the way the Solid one provides the Solid one.
- **SplitPane's gutter is named by the pane before it**, the one it resizes and the one `aria-controls` names. Both
  frameworks had read the pane after it, so the name never reached the gutter; found while porting and fixed in both.
- **The React `SplitPane` forgets remembered collapses during render when its ratios change identity**, since an effect
  ran too late for an Enter pressed straight after an outside write.
- **The React `Mosaic` keeps Solid's model, one component per tile**, keyed by `createSlotKeeper` slots in reading order,
  each running its own glide in a layout effect, with focus restored in a layout effect when the slot order changes.
- **React table header cells are positional, as Solid's `<Index>` keys them**, so the cell at the moved-to position keeps
  focus after a Shift-arrow move; `TableHeaderSort` and `TableHeaderReorder` register during render and the cell checks
  them in its mount effect, which runs after its children's.
- **`EdgeFader` and `Scroller` skip unchanged readings in React**, so a scroll that moves nothing renders nothing.

### Porting: `Timeline` and `TileBoard`

- **The shared parts**: `TimelineUtils.computeKeyAction` holds the held-edge and resting key maps,
  `createGestureTracker` the pan, pinch and wheel with the slop before capture, and `createEdgeZone` the carrier zone
  that was written out in the view; `TileBoardUtils.computeKeyAction` holds the activation, Ctrl-Home and Ctrl-End and the
  arrow walk, and `createSweeper` the sweep state machine, the hit layers, the document listeners and the swallowed
  click.
- **The React `Timeline` keeps its view in a ref every write updates at once**, synced to what was rendered after each
  commit, since several wheel or pinch events can arrive before React renders and each would otherwise zoom from a stale
  view; the held edge is mirrored into a ref for the same reason, as `CarrierUtils.start` asks the zone for it in the
  same moment it is set.
- **The React `Timeline` attaches its wheel listener natively with `passive: false`**, since React's `onWheel` is passive
  and its `preventDefault` would let the page scroll under the zoom.
- **The React `TileBoard` registers each hit layer through a ref callback returning `addHitLayer`'s removal**, React 19's
  ref cleanup standing in for Solid's `onCleanup` inside the ref setter.

### Porting: the hierarchy charts, `Bracket`, `Formation`, `Satellite` and `Staircase`

- **One zoom clock serves `Icicle`, `Sunburst` and `CirclePacking`**: `TreemapUtils.createZoomClock`, a store of progress
  from 0 to 1 advanced once a frame, with a timer that settles it if no frames come — replacing the frame loop and backup
  timer each of the three had copied. `TreemapUtils` also holds the branch and stop resolution, the parent lookup for
  Escape, the key action and the zoom projections; `BracketUtils.computeGeometry` replaced about a dozen size memos; the
  new `StaircaseUtils` holds the step indents.
- **A React hierarchy view catches a zoom during render**, recording the level being left, the starting views and a zoom
  counter in state, and starts the clock and moves focus in a layout effect keyed on that counter — the counterpart of
  Solid's `createComputed(on(...))`, as the React `PlacementItem` catches a changed placement.
- **The React `Treemap` keys its current and leaving levels on the zoom counter**, so each zoom mounts a fresh layer as
  Solid's keyed `Show` does, and its animations cancel on cleanup, so the development double mount does not leave two
  running.
- **The React `Formation` keys items by identity**, telling repeats apart by how often each has appeared, and asks its
  layout again only when the count or the function changes; the React `Satellite` keeps one ref callback per satellite
  across renders; the React `Bracket` answers focus and blur only for the node itself.

### Porting: the animations, particles, trail, pointer effects and reveals

- **`LightCatcher`, `ShadowCaster` and `Tilter` share one `PointerEffectsUtils`** in the parent `PointerEffects` folder,
  which held no namespace of its own, since they share the resting rule and the edge falloff; its functions apply each
  component's defaults, so either view passes its props straight through. **`SliceAnimationUtils.runPasses` is the one
  pass clock** that `CellAnimation` and `ParticleField` each used to carry a copy of; `TrailUtils.run`,
  `ScratchCardUtils.createMeasureScheduler`, `ParticleFieldUtils.createRoster`, `ParticleSpawnerUtils.createEngine` and
  the new `RevealUtils` took over what the Solid views' effects did.
- **A controller with no getters gains no `subscribe`** (`ScratchCardController`, `ParticleSpawnerController`); the React
  `TrailController` has plain-function getters and `subscribe`, on the `WheelController` model.
- **A React frame loop that reads its own progress writes it through a ref at the same moment as the state setter**
  (Trail, CellAnimation, ParticleField), so the next frame does not read the previous render's value; the ref is reset
  to the rendered value on each commit, so a consumer who refuses a write still wins.
- **The React `ParticleSpawner` draws a particle from its element's ref callback**, since React mounts the element after
  the store changes rather than inside the tick, and it would otherwise paint at the corner for a frame.
- **`spawnIterationPatterns` are compared by content in React**, so an inline array does not restart the stage on every
  render; a stage is set as a fresh object, which is how one looping back to itself plays again, as Solid's
  `equals: false` gives it.
- **The particle roster clears itself when handed a different cell count**, since a cell's key then names a different
  cell.
- **The engine reads `progress` back the moment it writes it**, so each view hands it a copy that is current at once.
  React writes a ref beside the state setter, as above. Vue keeps the last value it wrote in a plain variable and
  takes the prop's value when it changes, because a bound `useModel` goes on reading the old prop until the parent
  re-renders. Svelte reads the bindable directly, which a bound write updates at once.
- **The React `ParticleSpawner` builds its particle elements in a memo over the particle list**, since an unshared
  `progress` re-renders it every frame, and React calls a ref callback written inline again on every render — each
  particle would be placed and painted twice a frame.
- **The `restart` and `scrub` effects run only on a change, never on mount**, as Solid's `defer` does: React keeps the
  last value in a ref and compares (which also survives Strict Mode's second mount), Vue uses a plain `watch`, and
  Svelte `watchChange`.
- **The spawner page's Grid and Many to one followers**: Solid, Vue and Svelte make one progress per follower as it
  mounts, and the scrubber writes every one. React cannot make state in a loop, so the wrapper holds the followers'
  values in one object keyed by spawner, an unwritten follower reads the first spawner's value, and a scrub empties
  the object so all of them read the scrubbed value.

### Porting: `Cuboid`, `Die`, `FlipCard`, `Odometer`, `RichText`, `ScrambleText` and `Typewriter`

- **`Die`, `ScrambleText` and `Typewriter` each got a store-backed core** — `DieUtils.createRoller`,
  `ScrambleTextUtils.createScrambler`, `TypewriterUtils.createPlayer` — since each runs a timer or frames over time;
  `FlipCardUtils`, `CuboidUtils`, `OdometerUtils` and `RichTextUtils.getTagTreatment` took over the rest of the views'
  arithmetic, with the rich-text default class map moved to `RICH_TEXT_DEFAULT_CLASSES`.
- **`DieUtils.createRoller` recognizes the owner's echo of a roll's result by value**, remembering the face it wrote and
  ignoring one `turnTo` of it, since React delivers the echo a render later and a flag set only during the write would
  have let it cut the tumble short.
- **The React `Cuboid`, `FlipCard` and `Odometer` work their turn state out during render when the input changes**, as
  the drum carousel does; the React `Cuboid` reads the drawn orientation before the new transform commits.
- **The React `Typewriter`'s `update(cause)` measures after the next commit**, since a consumer changes the children and
  calls it in one handler; it returns `true` when a measurement is scheduled, and cannot report an unchanged width in
  advance.
- **Only `Cuboid` and `Die` hand React controllers with `subscribe`** — the face showing, and `isRolling` — since the
  scrambler's and typewriter's controllers have no getters.
- **A React `Cuboid` drag settles back only when it rounded to no turn**, since it cannot read at once whether the owner
  accepted the new count, which the Solid one checks on release.

### Porting: `PatchBoard`, `SortableGrid` and `CardStack`

- **`PatchBoardUtils.createBoard` is one board object**: the carrier zone together with every handler, the swallowed
  click and the tap aim, since the component is two carries over one zone, so both views only attach it and draw. The
  view hands it the zone as registered, because React's `useZone` wraps the object and a carry started from the
  unwrapped one would not be recognized as its own. **`SortableGridUtils.createZone`** is the grid's zone, with the
  module-level grab record now shared by every grid on the page whichever framework draws it, and both grids reuse
  `SortableUtils`' roving, click and carry helpers instead of copies. **`CardStackUtils.createPile`** is a store of the top
  card's push and flight with its commands, holding the leave timer and the two-frame return.
- **A React command sees its own writes before the re-render**: a React grid or stack hands the value it just gave the
  owner's setter back to its own core, since `compact()` called from `onTransfer` otherwise read the items from before
  the drop and undid the move. PatchBoard's `nodes`, `links` and CardStack's `topIndex` do not yet, and
  nothing reads the new value in between today.
- **A PatchBoard socket's wrapper is `sizing="fill"`**, in both frameworks. Its width used to come from
  `patchBoardSocketHolder > *` beating the wrapper's fit-content width only by stylesheet order, and through `core.ts`
  that order flips — so the React socket was 4px wide and every cable ended off center.
- **A React `CardStack` keys its cards by their index in `cards`**, so a card coming up the pile keeps its element and
  eases into place; the Solid `For` builds every card afresh as the pile moves, since it is handed new entry objects, so
  there the cards jump. A small visible difference between the two, left as it is.
- **The React `CardStack` runs both swipe hooks and hands the pile element to only one**, since hooks cannot be called
  conditionally; the other gets an empty ref and attaches nothing. `createPile`'s `stop` puts a card in flight back at
  rest, so the pile survives the development double mount.
