# Decisions: porting-vue

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Porting: Vue and Svelte

The user's calls, taken one at a time before any of it was built, and asked for as an unsupervised port on the
pattern Solid and React set: `@thewaver/ss-components-vue` and `@thewaver/ss-components-svelte` beside the other
two, each over the same core, and a Playground app for each, mirroring the other two path for path.

- **Vue 3.5 and Svelte 5, with runes.** Svelte 4's syntax is legacy, and nothing argued for it.
- **The Vue library is written in `.tsx`, with `defineComponent` and render functions**, the user's call over
  `.vue` single-file components: it reads line for line like the React and Solid views, which keeps the four
  frameworks behaving the same, and plain `tsc` checks it. Naive UI and Ant Design Vue ship this way.
- **The Vue Playground is written in `.vue` files**, because its examples are the code a visitor copies, and a
  Vue user writes templates. That is why `playground-vue` carries `@vitejs/plugin-vue` and `vue-tsc` and
  `components-vue` does not. **Svelte has no such choice**: a Svelte component is a `.svelte` file, so the
  Svelte package is checked by `svelte-check` and built by `svelte-package`, and it is the one of the four
  where a port is a rewrite rather than a line-by-line copy. The specs run against every app are what catch
  the drift that invites.
- **A `render*` callback keeps its name in both.** In Vue it is a scoped slot of the same name —
  `<template #renderContent="flags">` — since Vue restricts no slot name. A slot hands its consumer one value,
  so a callback taking one argument passes it as it is, and one taking several passes a single object whose
  fields are the React parameters' names: `renderFace(item, index, face)` is `#renderFace="{ item, index, face }"`.
  In Svelte it is a `Snippet` prop of the same name, and a snippet takes several arguments, so the arguments stay
  positional. Vue cannot make a slot required at typecheck; that was weighed and accepted.
- **Two-way state is each framework's own binding under the stem name**: `v-model:value` in Vue (a `value` prop
  plus `onUpdate:value`) and `bind:value` in Svelte (a `$bindable` prop). Where the prop is optional and the React
  component keeps a value of its own, so does this one when none is bound, which both mechanisms do natively; where
  React's only reports, an unbound write goes nowhere here too. A write the owner refuses leaves
  the component showing the owner's value. The same stem is the prop's name in Solid and React, where it is a
  signal pair and a `[value, setValue]` pair (_"A prop is named the same in every framework"_ in
  `conventions.md`).
- **`ref` stays `ref`.** Svelte takes it as a `$bindable` prop, so a consumer writes `bind:ref`, as Bits UI does.
  Vue reserves the name, so a consumer's `ref` on a component reaches the component and its `$el` is the element
  the other frameworks' `ref` points at, as Reka UI does.
- **An `on*` callback stays a prop in Vue**, not an emitted event: it is the same name in all four, and Vue turns a
  template's `@change` into an `onChange` prop, so a Vue consumer can write either.
- **The Vue app routes with `vue-router`; the Svelte app with `sv-router`**, the user's call over a router written
  in the app, over `svelte-spa-router`, whose addresses are hash-only and would break the specs and the switch, and
  over SvelteKit, a whole app framework whose file-based pages would stop the app mirroring the others.
- **The halves are named as React's are**: `<Subject>Vue.utils.ts` exporting `<Subject>VueUtils`, and
  `<Subject>Svelte.utils.svelte.ts` exporting `<Subject>SvelteUtils` — the second `.svelte` in the name is what lets
  a TypeScript module use runes.
- **The Theme is not tied to the framework** — the user's call: every app starts on `DEFAULT_THEME` in
  `NavSettings.const.ts`, the Themes named after frameworks are to be renamed as more arrive, and the Theme select in
  the nav settings is in all four apps. The landing page still colors each link from the theme of that name.
- **The framework switch knows every app's address, not just one other's.** `VITE_PLAYGROUND_URLS` replaced
  `VITE_OTHER_PLAYGROUND_URL`: one address per framework, `/solid/`, `/react/`, `/vue/` and `/svelte/` in the site,
  and each app's standalone port by default (`playground/vite/playgroundUrls.ts`). `npm start` serves the four under
  their prefixes on 8082 to 8085; `start:vue` and `start:svelte` serve one alone on 8086 and 8087.
- **Every new app's Vite server refuses the other frameworks' packages** through
  `playground/vite/refuseFrameworks.ts`, as the React one refuses Solid's.

### Porting: how the Vue side reads

Derived when `Utils/`, every abstract, `Primitives/`, `Composites/` and `Generators/` were ported, on Claude's judgment
under the unsupervised port the user asked for; the rest of the components should keep to it. Everything named here is
in `components-vue/src/Utils/` unless a folder is given.

- **`setup` holds what React's hooks hold, and the render function holds React's body.** A component is
  `defineComponent((props, ctx) => { …composables… ; return () => …JSX… }, { name, props, slots })`. Whatever React
  works out afresh each render — defaults read with `??`, class lists, styles, the flags object — is worked out inside
  the returned render function, which Vue runs again whenever anything it read changes, so it reads line for line like
  the React body. What React keeps across renders is made once in `setup`: `shallowRef` for `useState`, `computed` for
  `useMemo`, a `use*` composable for a hook. `props` is never destructured, since it is Vue's reactive proxy. Ids come
  from Vue's own `useId`.
- **Props are declared at runtime with `declareProps<XProps>({ … })`**, one entry per member of the props type:
  `Boolean` for a member holding a boolean, `null` for anything else. The compiler refuses a missing, extra or wrongly
  kinded entry, so the `.types.ts` stays the one description of a prop. A `Boolean` entry is
  `{ type: Boolean, default: undefined }` underneath: a bare attribute in a template means `true`, and a prop left out
  reads `undefined` as in React, so the default from `.const.ts` still applies. The helper's result is typed as the list
  of names — the one form under which `defineComponent` keeps a generic component generic for its consumers — though at
  runtime it is the object. A generic props type is declared with `unknown` for its parameter,
  `declareProps<BarrelProps<unknown>>`. A key that has to be quoted (`"onUpdate:value"`) makes the house format quote
  every key of that object, and every member of a type literal holding one. **A union props type is declared as it
  is** — `ModalProps`, whose two arms ask for exactly one of `ariaLabel` and `ariaLabelledBy`, `ToolbarCompositeProps`,
  whose arms carry different members: the declaration takes every member of every arm once (`PropName`), each kinded by
  what the arms hold together (`PropValue`), so an arm's `?: undefined` does not ask for `Boolean`. No call site wraps
  its type in `Omit<X, never>` or casts `props` to one arm to reach a member.
- **A `render*` callback is a scoped slot of the same name, typed in `<Component>Slots` beside `<Component>Props`** in the
  component's `.types.ts`, its members documented as props members are. `children` is the `default` slot. React props
  types that mixed data and render callbacks under a `*Slots` name are split, because a Vue reader takes `*Slots` to
  mean slots: the data half is `CarouselContentProps<T>` and `WheelContentProps<T>`, and a back face a preset requires
  is a slot type of its own, `CarouselBackSlot<T>` and `WheelBackSlot<T>`.
- **Inside the component, slots come through `SlotsContext<XSlots>`** as `setup`'s second argument, every slot read as
  possibly missing, **and are always drawn through `callSlot(slots.x, value)`**, which draws nothing for a slot the
  consumer left out. The options carry `slots: Object as SlotsType<XSlots>` so a consumer's template is typed; a generic
  component writes `SlotsType<XSlots<any>>` there, since the options object cannot see the type parameter.
- **A component hands slots to another as a children object, `{{ renderX: (value) => … } satisfies XSlots}`.** Vue's
  JSX types do not check children, and the `satisfies` is what types the arrows' parameters and checks the names.
  Passing a consumer's slot on is `renderContent: slots.renderContent`; one left out arrives as absent. **The object
  is written in place, never handed in as a variable** (`{layer.slots}`): the JSX transform then arrives at the child
  as no slot at all, silently — `ParticleDissolve`'s particles rendered empty until it was inlined.
- **A render function inside a defs prop is not a slot**, and takes one object in the shape of the slot it feeds:
  `InteractionTooltipDefs.renderContent` is handed `{ visibilityTarget, transitionDurationMs, placement, flags }`.
- **Two-way state is `useTwoWay(props, "value", initial)`**, over Vue's own `useModel`: one writable ref, reading the
  consumer's value when they bound `v-model:value` and a value of the component's own, from `initial`, when they did
  not. A write the owner refuses leaves the ref reading the owner's value. `value` and `onUpdate:value` are both members
  of the props type and both declared; a pair React requires (`TextField`'s `value`, `Spotlight`'s `visibility`) is a
  required prop. **A two-way prop is never spread onward**, because whether it is bound is read off the props a
  component was handed: a component passing one on hands the inner one its own ref's value and a setter.
- **The component keeps a value of its own only where the React one does.** React keeps one through
  `SignalMirrorReactUtils.useOptionalState` or a `useState` fallback, and there `useTwoWay` keeps one too. Where React
  only reports — reads `props.x?.[0]` and writes `props.x?.[1](next)`, so an unbound write goes nowhere — the call is
  `useTwoWay(props, "x", undefined, { keepsOwnValue: false })`: the ref always reads the prop, and a write only reaches an
  `onUpdate:x` if one was given, so a Vue consumer who binds nothing sees what a React one sees. That covers `Table`'s
  `sort`, `widths`, `order` and `selection`, `Range`'s `value` and `range`, `Menu`'s and `ContextMenu`'s `checked` and
  every preset handing it on (`FanMenu`, `WheelMenu`, `Menubar`, `Toolbar`), `Toolbar`'s `pressedValues`, and
  `Select`'s and `MultiSelect`'s `query`. Whether the prop was bound is not decided by its value, which a bound
  `v-model:sort` starting `undefined` would get wrong; a check written in the component against the prop's value is kept
  only where React makes the same one (`Menu`'s write under `props.checked !== undefined`, `Toolbar`'s pressable buttons).
- **`forwardProps(props, Inner)` stands for React's `{...props}` onto an inner component.** It picks the props `Inner`
  declares and drops the ones left out, since anything else would land in `Inner`'s attributes and be written onto its
  root element. Its result is typed as the whole outer set, so a required member stays required and a union props
  type stays a union on the way in, and no call site casts it.
- **Whatever the component sets on the inner one beside the forwarded set goes inside the same object literal, after
  the spread**: `{...{ ...forwardProps(props, BinarySwitch), onChange: handleChange }}`, or a `menuProps` object built
  the same way. Vue's JSX merges a spread and the attributes beside it with `mergeProps`, which joins two handlers of one
  `on*` name into a list rather than letting the later one win as React does, so an `onChange` written as an attribute
  beside a forwarded `onChange` ran the consumer's handler as well as the component's own — and a component calling
  the prop directly was handed the list, and threw. Inside one literal the later key replaces the forwarded one. Two
  spreads side by side merge the same way, so they are one literal too. The rule is written for every key that could
  collide, two-way pairs included (`"value"` and `"onUpdate:value"` of the `TextField` presets), not only the ones that
  do today.
- **`on*` callbacks are props.** A template reaches `onChange` with `@change`, and a two-word one with a hyphen —
  `onMouseEnter` is `@mouse-enter` — since `@mouseenter` compiles to `onMouseenter`, which is another name.
- **Composables take `MaybeRefOrGetter` inputs and hand back refs.** `use*` inside `<Subject>VueUtils`, named as React's
  hooks are; an input is a ref, a getter reading props (`() => props.isOpen`) or a constant, read with `toValue` where it
  is needed, and every result is a `shallowRef` or `computed` under React's field name (`fader.isVisible.value`). **A
  function is never a `MaybeRefOrGetter` input**, since `toValue` calls it: a callback is a plain function the composable
  calls when the moment comes, written by the caller to read the prop then (`onShow: () => props.onShow?.()`), and a
  function whose presence the core reads is handed as a getter of it (`getComputeMaskedText`, `getComputeSpinDefs`).
  Two-way state a composable writes is a writable `Ref`, as in `HoverIntentVueUtils.useHoverIntent(anchorRef, shown,
…)`. `useLatest` and `useElement` have no counterpart: a prop read at call time is always current, and a template
  ref is already reactive.
- **A store is read through `useStore(store, select)`**: a `shallowRef` fed by the subscription and let go by
  `onScopeDispose`, changing only when the selected part does.
- **An element is a `shallowRef<HTMLElement>()` handed to `ref=`**, or set from a function ref through
  `toElement(target)`, which answers the element whether the ref sat on an element or on a component (its `$el`). Vue
  calls a function ref again on every render with the same element, which changes nothing a `shallowRef` holds; a ref
  that does work guards itself, as `VirtualizerVueUtils.useRowWindow`'s `measureRow` measures an element once per
  index. A list of elements is followed through `useStableList(getList)`, a `computed` that hands back the previous
  array while its entries are the same.
- **Every effect is `watchAfterRender(sources, effect)`, standing for both `useEffect` and `useLayoutEffect`.** The
  sources are React's deps, as getters or refs compared entry by entry; the effect runs once the component has mounted
  and again after any update in which a source changed, sees the document as that render left it, and may answer a
  cleanup that runs before the next run and on unmount. Only the sources are tracked, so the body reads props and state
  as they stand without subscribing to them, which is what `useLatest` did for React. Vue runs it after the DOM is
  written and before the browser paints, so the split between the two React effects has nothing to map onto. Cleanups
  run in the order their effects were declared, as React's do, so an ordering rule like `Modal`'s — unseal before focus
  goes back — carries over as written.
- **A watcher on several sources fires on every trigger once any source is a `shallowRef`**, even when every value
  compares equal, so a source that should only fire on a change of one field is read through `useStore(store, select)`
  rather than taken off a ref of the whole state. Found when `PaintedText`'s letter boxes, re-sent to the letter
  registry on every layout change, fed `ProximityText` a new strength, which relaid the letters and looped; Svelte's
  equivalent was an effect reading one field off the whole layout state, mended the same way with `readStore`.
- **`VirtualizerVueUtils.useRowWindow` takes up its scroller only once a render has been written, and `isLive` turns
  `true` at that moment.** The window read the scroller's height as soon as the scroller was found, in the effect that
  runs before Vue renders, while the spacer inside it was still the height of an empty list — so it took the box to be
  a few pixels tall. Opening then scrolled to the first option against that box and left the list 82px down, the first
  option mostly out of sight, and the scroll left the virtualizer in its "user is scrolling" state long enough that an
  End pressed straight after opening was placed from the last row's estimated height rather than its measured one. A
  correction the virtualizer re-tries once the spacer has grown was also re-tried before the spacer had grown, and
  undid the virtualizer's own follow-up scroll. Between them the last row sat about 60px below the box for two frames,
  which `select.spec.ts`'s End case caught about half the time; the fault predates the Vue port's later work and was
  found on the last commit too. Taking up the scroller after the render — on mount and on every render of the
  component that owns the window, as React's window does in a layout effect — reads the real height and runs that
  re-try at the right moment. `isLive` waits for it too, because Vue runs a component's post-render watchers before its
  `onUpdated` hooks: `Listbox`'s scroll-to-highlight watcher, keyed on `isLive`, would otherwise ask for its scroll
  before the window was following anything, and a list reopened onto a selection far down would stay at the top.
- **The other React shapes map one to one.** `useEffect(fn, [])` is `watchAfterRender([], fn)`; an effect that is only a
  cleanup (`useEffect(() => x.stop, [x])`) is `onScopeDispose(x.stop)`; an effect with no deps list is `onMounted` plus
  `onUpdated`. State adjusted during render when an input changes — React's `if (x !== previous) setState(…)` — is a
  `watch` on the input at Vue's default timing, which runs before the render that reads it (`PlacementItem`'s glide,
  `Mosaic`'s capture of the focused tile), or a `computed` reading its own previous value (`Carousel`'s accumulated
  turn). A change that must not act at mount, like a wheel's target index, is `watch(…, { flush: "post" })`.
- **`ref` reaches the element through `$el`.** A consumer's template ref on a component is handed the component, and
  its `$el` is the element React's `ref` points at. Where that is not the component's root — `InteractionWrapper`'s
  control, the inputs of `TextField` and `BinarySwitch`, a leaf rendering a fragment — `exposeElement(expose, () =>
element.value)` points `$el` at it, the approach of Reka UI's `useForwardExpose`. A leaf is therefore attached with
  `ref={setElementRef}` whether it is an element or a component, and React's `ref` members are gone from the Vue props
  types. Element-valued props (`anchorRef`, `elementRef`) stay plain props, as in React.
- **A context is `provide` and `inject` under an `InjectionKey`**, in the same `.context.ts`: `provide<Name>Context(value)`
  stands for React's `<Name>ContextProvider`, and `use<Name>Context()` answers the fallback when nothing is provided. The
  provided object is made once in `setup` with getters over `computed`s, so what reads it follows it without being
  handed a new object. The `Viewport` fallback is the window with its size in a module-level `shallowRef` kept current on
  resize, as Solid's is, so `AnchorVueUtils.usePortalPosition` needs nothing standing for React's resize re-render.
- **A portaled component renders `<Teleport to={viewportContext.getPortalRef() ?? document.body}>`** and declares
  `inheritAttrs: false`, since a teleported root cannot take a consumer's fall-through attributes.
- **`class` and `style` are Vue's.** A class list is an array with falsy entries, `class={[a, isX && b]}`; a style is an
  object with camelCase keys and `assignInlineVars` spread in, or an array where objects combine. Vue adds no `px` to a
  number, so every length is a string, as the core's style helpers already return them. Native attributes take Vue's
  names — `tabindex`, `readonly`, `autocomplete`, `inputmode`, `onKeydown`, `onMouseenter`, `onCompositionstart` — and SVG
  presentation attributes their hyphenated ones, `stop-color`, `flood-color`, `fill-rule`, which Vue's JSX types check.
- **A controller handed through `onMount` has no `subscribe`.** Its getters read the component's `computed`s, so a
  consumer's template or `computed` calling `controller.getIsSpinnable()` follows it, as a Solid consumer's accessor
  does. `WheelController` is the model.
- **A type identical to the core's is imported and re-exported rather than declared again** — `CarouselState`,
  `BinarySwitchCbs`, `BinarySwitchState` — so the Vue barrel needs no explicit re-export to settle a clash.
- **A render function handed to a slot in its value is made once in `setup`**, not inside the render function:
  `Menu`'s `renderItems`, `SelectComposite`'s `renderOptions`, `TextInput`'s `renderSuggestions`, `Carousel`'s
  `renderStep` and `renderPick`. A consumer passing it on as a prop to a component of their own then sees the same
  function each time rather than a changed prop on every render. One made per entry is kept in a `Map` under the entry's
  key, as `Clock`'s column renderers are.
- **Focus moved back after something closes is deferred with `void nextTick(() => …)`.** A child's effects and their
  cleanups run after its parent's in Vue, where React runs the child's first, so a picker focusing its field the moment
  its popup closes would be undone by the popup's own focus return, which runs afterwards. `DatePicker`, `TimePicker`,
  `DateRangePicker`, and `Toolbar` moving between a menubar's menus, defer the focus by one tick for that reason.
- **Focus that must be heard from inside is `onFocusin` and `onFocusout`.** React's `onFocus` and `onBlur` bubble;
  Vue's are the native, non-bubbling ones.
- **A key pressed inside a teleported popup does not reach the elements it was teleported out of**, where React's
  portal passes its events up the component tree. `Toolbar` as a menubar therefore listens on the document while one of
  its menus is open, and acts only on keys from a layer it owns.
- **A consumer's link component is a Vue `Component` drawn with `h(props.linkComponent, { href, …, onClick }, { default:
() => content })`** — `Tabs`, `Tree`, `Paginator`, `Breadcrumbs` — and is handed the same props React's is.

**Where the Vue side departs from React, accepted:**

- `MaskedFieldVueUtils.useMaskedField` takes the core's `MaskedFieldDefs` getters as they are, since Vue reads them
  reactively, where React's hook takes this render's values. Like React's, it commits from the text's setter and does not
  watch the format.
- `TextSyncVueUtils.useValueSync` keeps React's hold on the text just typed until the owner's answer is applied, since
  Vue applies it in its next update as React does in its next render. A refused write puts the owner's text back.
- `SVGAnimationDefsVueUtils.useAnimateDefs` attaches each `animate` element through the element hooks `onVnodeMounted`
  and `onVnodeBeforeUnmount`, since Vue has no ref cleanup, and writes `repeatCount` onto the attached elements itself
  inside `setPatternIndex`, since Vue has nothing standing for `flushSync`.
- The split composables answer writable refs named for the stem: `DateTimeValueVueUtils.useSplit` returns `date` and
  `time`, `SignalMirrorVueUtils.useSplit` `first` and `second`. `SignalMirrorVueUtils.useOptional` reads its source once,
  where React's re-reads its presence every render; a two-way prop uses `useTwoWay` instead.
- `Popover`'s `onBlur` answers the native element-only `blur`, so React's check that the event started on the popup
  itself is not needed.
- A generic component's slots are typed at `any` for the parameter in a consumer's template, where its props keep it.

### Porting: the Vue components

What each Vue component does differently from its React counterpart, and why. Everything not named here behaves as
React's does; the patterns every component shares are in _"Porting: how the Vue side reads"_.

- **`RichText`'s `renderTag`**: a slot that draws nothing leaves the tag to the class map, where React's callback does
  that only for `undefined` and draws nothing for `null`. A template slot cannot answer `undefined` — an empty one
  answers a list of comments — so `undefined`, `null` and an empty result all mean "use the class map", and a tag the
  consumer wants gone is answered with an empty fragment.
- **`Odometer`'s `renderDigit` and `renderFixed`**: a slot that is given always draws, even when it draws nothing,
  since a template slot never answers `undefined` for React's `??` to fall back from. The character stands in only when
  the slot is left out.
- **`Typewriter`'s `controller.update`** measures after `nextTick`, once Vue has written the new text, where React
  queues the cause for its next layout effect.
- **`Cuboid`, `Die` and `Trail`** hand controllers with no `subscribe`, their getters over `computed`s, as every Vue
  controller is.
- **The private animation components of `Samples/`** take the animated value's name as `valueName`, where React's take
  `vName`: Vue's JSX reads an attribute starting `v` and a capital as a directive. The exported functions keep `vName`.
  The pointer tracker there takes a getter of the element, since there is no `useElementRef`.
- **`CheckboxGroup` and `RadioGroup`** provide a context of the Vue shape, made once, whose `register` answers its own
  cleanup; a checkbox registers once, where React's re-registers whenever the context's `register` changes identity.
  `CheckboxGroup`'s controller is handed once, with getters over its state.
- **`Form`** has no `reportChange`: the Vue `FormField` and `FormSection` register entries whose errors the form reads
  through getters, reactively, so nothing has to make it render again as React's version counter does. `FormField` and
  `FormSection` provide their contexts from the private components `FormFieldControl` and `FormSectionContent`, which
  wrap only what React's providers wrap: a Vue component's `provide` reaches everything it draws, caption and message
  included.
- **`ColorInput`'s `renderPopup`** is handed `hsv` as a writable `Ref`, where React's is handed the `[hsv, setHsv]` pair.
  `ColorInput` and `TextInput` draw a fragment — the field and its popup — so they declare `inheritAttrs: false` and
  point `$el` at the field.
- **`TagInput`**'s field is an `<input>` drawn in place, so there is no `TagInputFieldElementProps`.
- **`Table`'s `renderHeader` and `renderCell`** stay plain functions on the column records rather than slots, since each
  column carries its own; `renderCell` is handed one object, `{ row, renderProps }`.
- **`TileBoard`** attaches its hit layers through one function ref per tile, made once, and removes a layer when its
  tile unmounts, since Vue calls a function ref on every render and has no ref cleanup.
- **`Bracket`**'s nodes follow focus with Vue's native `onFocus` and `onBlur`, which do not bubble, so React's check
  that the event started on the node itself is not needed.
- **`Sidebar`** declares `onUpdate:expanded` and never calls it, as React's never writes `expanded`: only the owner
  expands or collapses it, from a button of their own.
- **`Collapsible`, `AccordionSection`, `Preview`, `Menu`, `FanMenu` and `WheelMenu`** point `$el` at their trigger, the
  element React's `ref` points at.
- **`Toolbar` as a menubar** listens for keys on the document while one of its menus is open, and acts only on a key
  from a layer it owns, since a key pressed in a teleported menu does not reach the bar's element. Moving from one open
  menu to the next is deferred one tick, so the closing menu's focus return does not undo it.

### Porting: the Vue Playground

How `playground-vue/` is written, derived while porting the frame, `PageComponents/` and `ButtonPage` as the pattern the
other pages copy. Taken on Claude's judgment under the unsupervised port.

- **A React file holding one component becomes one `.vue` file of the same name; a file holding several becomes one file
  per component, named after the component**, as in the Svelte app. `Field.tsx` is `PageNumberField.vue`,
  `PageTextField.vue` and the rest; `Examples.tsx` is `PageExamples.vue` and `PageExample.vue`; `App.tsx` is `App.vue`,
  `AppContent.vue`, `PageDependencies.vue` and `EmptyPage.vue`. A value a React file exported beside its component is
  exported from a plain `<script>` block of that `.vue` and imported by name beside the default
  (`import StressItem, { STRESS_ITEMS } from "./StressItem.vue"`).
  `pageColorPickerSlots` is the exception: a template cannot spread an object of slots onto a component, so its three
  render functions are three components in `ColorPicker/` — `PageColorPickerArea`, `PageColorPickerHue` and
  `PageColorPickerPanel` — each written into its own slot of `ColorInput`.
- **The router is made in `src/index.ts`**, with `createWebHistory(import.meta.env.BASE_URL)`, since `app.use` is where a
  Vue app is given one. `/` is `AppContent.vue`, whose `<RouterView>` draws the page; `App.vue` draws the root and hands
  `AppContent` the viewport anchor through the outer `<RouterView>`'s slot. A page with no examples redirects to its
  `/docs`, which is React's `<Navigate replace>`. `route.path` has the base taken off, as React's location does, so
  nothing calls `toRoutePath`. The helpers and tables `App.tsx` kept at module scope, which several of its split
  components and the route table need, are `AppUtils` in `App/App.utils.ts`, the one file with no React twin.
- **`App.const.ts` registers a page as a component reference**, `component: ButtonPage`, imported from the page's `.vue`
  at its real path. Every page React registers has a file there; one not yet ported is `<template></template>`.
- **A page's demos are named slots of `<PageExamples>`, each named after its example's `key`.** `ExampleDefs` keeps
  `key`, `name`, `span`, `path` and `readout` and drops `component`: the page writes
  `<template #decorated><DecoratedExample :is-pressed="toggleOn" @click="toggleOn = !toggleOn" /></template>`, which
  is how a Vue page draws markup for a child to place. `VariantDefs` and `<PageVariants>` work the same way. State is a
  `shallowRef` in the page's `<script setup>`, `readout` is a closure reading `.value`, so it stays live, and
  `EXAMPLES_ROOT` and `path` name the real `.vue` file. `ButtonPage` is the model.
- **An example is `type Props = XExampleProps; const props = defineProps<Props>();`**, keeping React's props type from
  the page's `.types.ts`. A callback stays a prop, reached from the page with `@click` or `@copy`; a render callback of
  the library is a `<template #renderX="…">` slot; a render function inside a defs object, such as
  `tooltipDefs.renderContent`, is written with `h()` in the script, since it is a value rather than a slot.
- **The field adapters keep React's props**: `value` plus `onInput` or `onChange`, written `:value` and `@input`, so a
  page's knobs read as React's do. **Where React takes a `[value, setValue]` pair, Vue takes `v-model:<name>`**, a
  `<name>` and an `onUpdate:<name>` in the props type, read with Vue's `useModel`: `PageColorChannels`' `hsv`, the
  calendar captions' `month`, `PagePlaybackScrubber`'s `playback` and `progress`, the nav settings' three.
- **What React takes as `children` is the default slot**: `PageProp`, `PagePropsPanel`, `PageExampleKnobs`,
  `PageMeasureBox`, `PageLayer`, `PageControlRow`. `PageExampleKnobsButton`'s `renderKnobs` is a slot. A slot drawn from
  a template hands its consumer one object, so `StressTest`'s are `#renderLabel="{ configIndex }"` and
  `#renderItem="{ configIndex, itemIndex }"`.
- **Contexts are `provide<Name>Context` and `use<Name>Context`** over an `InjectionKey`: `Layer`, `PropsPanel`,
  `ExampleKnobs` and `Field`'s two registries, the last read through `useFieldReset(value, apply)`, which registers on
  mount as React's effect does.
- **A library component's `ariaLabel` is written `ariaLabel` in a template, not `aria-label`.** Vue hands either to the
  prop at runtime, but `vue-tsc` reads `aria-label` as the native attribute and refuses it where the prop is required
  (`Modal`, `Tree`), so one spelling is kept everywhere. A native element keeps `aria-label`.
- **A template does not look an imported constant up by key; the script does.** `WEEK_START_LABELS[day]` inside a
  template arrow, or `DROP_ZONE_REASON_TEXT[reason]` inside an interpolation, failed `vue-tsc` with "Property 'value'
  does not exist on type 'Record<…>'", and the Vue build stopped on it (the type checker is part of the build). The
  lookup moved into the script as a small function or a `computed`, and the template calls that.
- **Vue turns a line break between text and a tag into a space**, so a caption and the control beside it, or a name and
  its `?`, are written with no gap (`{{ label }}<Button …>`). React's `onBlur` on a container is `@focusout`, since
  React's bubbles and the native `blur` does not.
- **`PageViewTabLink` does not pass `replace`.** A tab click runs the strip's `onSelectionChange`, which pushes, and then
  the link's own navigation; `vue-router` cancels a navigation still pending when another starts, so a replace second
  would leave the history one entry short of React's and Back would skip the page. Two pushes to one address end where
  React's push-then-replace does.
- **The docs plugins read the Vue package.** The Vue config passes `componentApi` `{ slotsSuffix: "Slots" }`, so a
  `<Name>Slots` type is drawn in the props group straight after `<Name>Props` rather than among the types; and an
  export made with `defineComponent(setup, …)` is listed by its setup function,
  `<T>(props: TabsProps<T>, slots: TabsSlots<T>) => VNode`, rather than by the type `defineComponent` returns. The
  Solid and React output is byte for byte what it was. `componentDependencies` needed nothing, the package being `.tsx`.
- **The source view globs `.vue` files and highlights them with shiki's `vue` language**, loaded into the shared
  highlighter from the app's own `SourceView.utils.ts`, and keys a split `PageX.vue` inside folder `F` by the stem
  `F/F`, as the Svelte app does, so it shares a tab with `F.types.ts` and `F.css.ts`.
- **A case only the Vue app can pass is tagged `@vue`**, and the root config's other projects leave the tag out. The
  first is the docs table's slots row beside the `@solid`, `@react` and `@svelte` cases.
