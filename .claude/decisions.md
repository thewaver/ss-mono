# Decisions

Why this codebase is the way it is, component by component, so a settled argument is not had twice. Every
entry is local: it explains one control, one abstract's internals, the shape of the repo or the
Playground, and would not survive a move to another project.

**The rules that would survive such a move are in `conventions.md`**, which is the file to read first and
the only one worth carrying anywhere else. The two cross-reference each other by heading name.

Open problems are in `backlog.md`; nothing here is a task. `backlog.md`'s numbered items point at the
headings listed below for the reasoning behind what exists.

**The entries are in `.claude/decisions/`, and this file is their index.** A component's entries are in one
file named after its folder in `components/src` — `Select.md` for `Essentials/Input/Select` — so it can be
opened without looking here first. What covers the repo, the Playground, porting or several components at
once is in a file named for its topic, in lowercase. Each heading below sits under the file that holds its
entry, so a pointer written as "`decisions.md`, under _"a heading"_" is followed by finding the heading here
and opening that file.

**Read whole the file of each component a task touches**, and the topic files the task falls under. **A new
entry goes into its component's file** — a new file when the component has none, a topic file when it covers
several — **and its heading is added here in the same edit.**

## Topics

**[`controls-shared.md`](decisions/controls-shared.md)**

- The painter's object: `activation` left the flags, and only the mixed ones became `RenderProps`

**[`library-scope.md`](decisions/library-scope.md)**

- What the library covers, and the controls it will not get
- Four components arrived from a React codebase, and all four are `Exotics`

**[`playground-api-view.md`](decisions/playground-api-view.md)**

- Every props row carries its own explanation, and the default comes from the field rather than from the caller
- A component page is two routed views, and the Docs one is read off the published type
- The Docs view lists everything a unit exports, not only its props
- The props tables are built beside the dev server, while the Playground is already in use
- The API page's address follows the section being read

**[`playground-docs-pages.md`](decisions/playground-docs-pages.md)**

- A docs example's code sits below its box, and the accordion examples share one width
- A docs example puts its own controls below the component
- A docs example has no knob that exists only for the Playground
- The open/closed arrow follows the side the panel opens on
- On a docs demo, the Disabled knob is last
- A section's knob starts on the behavior the section is about
- A docs box's severity says what skipping it costs
- A docs section's text never opens with a prop name
- Six calls taken at the end of the Essentials Docs conversion
- The Essentials Docs conversion: what each page settled
- The sweep after the conversion: names, direction and the gaps the pages exposed
- The last Essentials pages: how their examples map, settled before building
- The last Essentials Docs pages: what each settled

**[`playground-examples.md`](decisions/playground-examples.md)**

- A sample knob is labeled after the prop it sets, not after what the effect does
- The Placement page is prose, and its examples live on the controls that take a layout
- Every props panel resets itself, and no page was edited to get one
- The starting value of a page prop is a named constant
- A Playground demo a visitor can move must be a demo they can put back
- Turning a page's variants into examples, settled on the four `Exotics` pages
- Every Playground page is examples now, and two things had to change to finish it
- `PageExamples` lays out on a grid, with the column width per page and a span per example
- Examples with a non-standard layout come last on their page
- `PageExamples` takes one layout switch, because the two questions turned out to be one
- An example's own knobs open from a button on its card, not from a panel inside it
- The hint example's moving buttons are bounded by a `PageMeasureBox`
- A Playground page returns a fragment, and its demos sit in a `PageMeasureBox`

**[`playground-frame.md`](decisions/playground-frame.md)**

- The Playground frame has its own command palette
- The Playground is one centered block, no wider than its parts add up to
- The left menu is one tree, and the categories are its top three branches
- Every abstract has a menu entry, and a page with no examples is a config entry rather than a file
- Primitives have a menu section, and a page with no examples has no Examples tab
- The dependency map takes a whole abstract folder as its entry when no file carries the folder's name
- `usedBy` is the same map read backwards, and the layer of the consumer decides which list it lands in
- The Playground's `Abstracts` category
- Which Abstracts a page's component uses, derived rather than curated
- The Appearance page: one row per Theme and per Skin, picked like a radio
- The gallery page: every page's first example, live, on one page

**[`playground-look.md`](decisions/playground-look.md)**

- The Playground's modals all darken the page the same way
- Playground: `progressTip`, the decoration riding the end of a progress bar's fill
- The Playground theme is an example, and carries no rationale on purpose
- The Playground's field look is one surface, and every field-shaped control wears it
- An example's own controls wear the small control look, not the Button look
- Text painted on a surface that moves is not selectable
- Color in the Playground: two rules, both the user's
- The focus ring stays above a painter's hover and press filter
- The in-field adornment painter: a label outside a button, a button's look inside one

**[`playground-source-view.md`](decisions/playground-source-view.md)**

- The Playground: an example's source is a folder view, and a sample is a file
- The source view, as built, and the four calls the mechanism forced
- The shared list of Playground files is named from the Playground's own root

**[`porting-approach.md`](decisions/porting-approach.md)**

- Porting beyond Solid: the shared logic is this library's own, not Zag's
- Porting: where each half of an abstract sits
- Porting: the three packages
- Porting: the Playground in two frameworks
- Porting: the shapes the rest of `Abstracts/` took
- Porting: how the React side reads
- Porting: how a component is carried across

**[`porting-components.md`](decisions/porting-components.md)**

- Porting: `PlacementBox`, `PlacementItem` and `Barrel`
- Porting: `Popover`, `Modal`, `Drawer` and `PopupTrigger`
- Porting: the form family — `Form`, `FormField`, `FormSection`, `TextField`, `BinarySwitch` and the presets over them
- Porting: the carousels and the wheels
- Porting: the SVG generators, `Shape`, `Surface`, `GlassSurface`, `CornerHighlight` and `Glass`
- Porting: the overlays — `HoverCard`, `Toasts`, `Sidebar`, `Preview`, the spotlights, `Accordion` and `Collapsible`
- Porting: the navigation controls — `Tabs`, `Breadcrumbs`, `Paginator`, `Stepper`, `TableOfContents`, `Tree` and `Sortable`
- Porting: the text inputs — `NumberInput`, `CurrencyInput`, `SegmentedInput`, `TagInput` and `FileInput`
- Porting: the menus — `Menu`, `FanMenu`, `WheelMenu`, `Toolbar` and `Menubar`
- Porting: the list controls — `Listbox`, `MultiListbox`, `Select`, `MultiSelect` and `TextInput`
- Porting: `Radio`, `RadioGroup`, `Range`, `ColorArea`, `ColorInput` and `SlideButton`
- Porting: the date and time family — `Calendar`, `RangeCalendar`, `Clock`, `DateInput`, `TimeInput` and the pickers
- Porting: `Table`, the mosaics, `Scroller`, `SplitPane`, the switchers, `EdgeFader`, `Progress` and `ViewportWrapper`
- Porting: `Timeline` and `TileBoard`
- Porting: the hierarchy charts, `Bracket`, `Formation`, `Satellite` and `Staircase`
- Porting: the animations, particles, trail, pointer effects and reveals
- Porting: `Cuboid`, `Die`, `FlipCard`, `Odometer`, `RichText`, `ScrambleText` and `Typewriter`
- Porting: `PatchBoard`, `SortableGrid` and `CardStack`

**[`porting-svelte.md`](decisions/porting-svelte.md)**

- Porting: how the Svelte side reads
- Porting: the Svelte components
- Porting: the Svelte Playground

**[`porting-vue.md`](decisions/porting-vue.md)**

- Porting: Vue and Svelte
- Porting: how the Vue side reads
- Porting: the Vue components
- Porting: the Vue Playground

**[`repo-layout.md`](decisions/repo-layout.md)**

- The three trees
- Layers
- One repo, three packages
- Layering
- Commands
- The root README is generated from the About page's text
- Formatting is applied on commit, by a hook
- TypeScript stays on 6 until 7.1
- `external/` is a drop-zone, and every tool is told to leave it alone
- A file in transit sits commented out, rather than excluded in config
- Breaking the API is free until 0.1.0
- Compatibility arguments cite `components/src` and nothing else

**[`samples-and-generators.md`](decisions/samples-and-generators.md)**

- Samples live in the library
- How Samples is laid out
- `Generators/` holds the code that computes things a component is handed, and `Samples/` keeps the examples
- Samples: one file per key, and the key is the file's name
- A sample reaches its host through a ref, and gets there under its own steam
- A sample registry and the machinery that runs it are separate modules
- A sample looked up by name checks the name is the registry's own, and fails loudly when it is not

**[`ss-utils.md`](decisions/ss-utils.md)**

- What goes to `ss-utils` and what stays here
- What went to `ss-utils`, and what was weighed and kept
- The fourth extraction round, and the rule it settled
- Look in `ss-utils` before writing anything general-purpose
- `EasingUtils` went to `ss-utils` whole
- `ss-utils`: the arguments behind the utilities, which their own documentation does not carry
- `Color`: `colord` reads and recognises, and does nothing else
- `Color.getContrastingColor`: the hue and saturation are kept and the lightness is solved for
- `Color.getLuminance` and `Color.getPerceivedLightness`: two numbers a palette is tuned by
- `CSSUtils.toAnimationStyle`: what a frame costs, and the three rules that came of measuring it
- `JSXTextParserUtils`: an inherited style is weighed against where the text lands, not against its own parent
- `JSXTextParserUtils`: the space a wrapped line ends on hangs, as a piece of its own that takes no room
- `Color`, and why `colord` reads strings but does not hold them

**[`verification.md`](decisions/verification.md)**

- What the verification suite cannot see
- Development warnings are checked by unit tests, not by specs

## Components

**[`Accordion.md`](decisions/Accordion.md)**

- `Accordion`, `Collapsible`, `Preview`, `Tree`: two-way state is optional
- Controls: `Accordion`, and where auto-height measurement lives
- `Accordion` in a row: `orientation`, and which way the open section moved
- `Accordion` in a row: an open width per item
- A panel built on first expansion, and why the animation survives it

**[`Anchor.md`](decisions/Anchor.md)**

- `Anchor`: a placement may fall back within its family and never outside it
- `Anchor`: the positioning half of a floating layer, extracted
- Arrows: grown on the unrounded contour, aimed by `Anchor`
- `Anchor` positions against a rect when it is given one

**[`Barrel.md`](decisions/Barrel.md)**

- `Barrel`: the drum, lifted out of the wheel so a second component can turn one

**[`BinarySwitch.md`](decisions/BinarySwitch.md)**

- Audit: the React-era `BinarySwitch`, and what of it survives here
- Controls: `BinarySwitch`, and `Toggle` / `Radio` as presets over it

**[`Bracket.md`](decisions/Bracket.md)**

- `Bracket`: a layered tree with connectors, and a knockout draw is one arrangement of it
- `Bracket`: the focused route is the focused node and everything between it and the root
- Traveling beams on `Bracket` and `PatchBoard` are Playground paint
- `Bracket`: a family is three rows the consumer frames with a view
- `Bracket`: the Playground's family example writes a view
- `Bracket`: round headers make each layer its own list

**[`Breadcrumbs.md`](decisions/Breadcrumbs.md)**

- Controls: `Breadcrumbs`, and why the last crumb is not a control

**[`Button.md`](decisions/Button.md)**

- `Button` can be named, and the label wins over the painter
- `Button` reports the pointer, and `NumberInput` repeats while held
- Controls: `Button`, and a press that waits for its answer
- Controls: `Button` refuses activation while pending, without going disabled

**[`Calendar.md`](decisions/Calendar.md)**

- Controls: `Calendar`'s `precision`
- Controls: `Calendar`, and the date value the library owns
- `Calendar` shows several months at once, and numbers its weeks
- `Calendar`: disabled days described rather than computed

**[`CardStack.md`](decisions/CardStack.md)**

- `CardStack`: the pile keeps the geometry, the consumer keeps the card
- `CardStack`: a recalled card comes back the way it went
- `CardStack`: `allowedDirections` decides which swipe tracker the stack uses
- `CardStack`: the motion helpers take getters, so only the top card follows the push

**[`Carousel.md`](decisions/Carousel.md)**

- Controls: `Carousel`, and the first component that acts without being asked
- `Carousel`: stopping at the ends is one rule, and rotation stops by writing the signal
- `Carousel`: one component, and how a slide sits is a placement rule
- `Carousel`: groups of items, and a group rests on its middle
- `Carousel`: building only what the placement draws
- `Carousel`'s concertina: an accordion's bellows seen from the front
- `Carousel`: too few slides are repeated, as far as the rule says it reaches
- One index wrapper, under the name that was already published
- `Carousel`'s Docs page: one shared bar, one picker for the looks, and no rule written by hand

**[`Carrier.md`](decisions/Carrier.md)**

- `Carrier` speaks in the consumer's words, and the zone carries them
- The carry engine stopped counting in indices, and holds a place the zone defines

**[`CellAnimation.md`](decisions/CellAnimation.md)**

- `CellAnimation`: weights as the staggering primitive
- `CellAnimation`: how a finite run stops, and why the counter runs one past the end
- `CellAnimation`: the pass is a progress signal, and the grid is always drawn at it
- `CellAnimation`: the screen wipe is an example, not a component

**[`Checkbox.md`](decisions/Checkbox.md)**

- Checkbox and Toggle draw their own text, as Radio does

**[`CheckboxGroup.md`](decisions/CheckboxGroup.md)**

- Controls: `CheckboxGroup`, and `Checkbox`'s `value` opt-in

**[`Clock.md`](decisions/Clock.md)**

- Controls: `Clock`, and why a time popup is columns rather than a list

**[`Collapsible.md`](decisions/Collapsible.md)**

- Controls: `Collapsible`, and what an accordion adds to one

**[`ColorArea.md`](decisions/ColorArea.md)**

- Controls: `ColorArea`, and the value form a picker has to hold

**[`ColorInput.md`](decisions/ColorInput.md)**

- `ColorInput` owns its picker, so there is no system color dialog to fall back on
- `ColorInput`, and a value the field cannot read

**[`CommandPalette.md`](decisions/CommandPalette.md)**

- `CommandPalette`: `Modal`, a `TextField` and a library-owned listbox
- `CommandPalette`'s Docs page

**[`CornerPin.md`](decisions/CornerPin.md)**

- `CornerPin`: four grips that pin a wrapper's corners, over an abstract that does the arithmetic

**[`CornerRun.md`](decisions/CornerRun.md)**

- Which components pass corners down, and where each run is

**[`Cuboid.md`](decisions/Cuboid.md)**

- `Cuboid`: a box of six faces, and two counts that drive it
- `Cuboid`: upright mode keeps an orientation, and the counts become a record of presses
- `Cuboid`: `turnTo` plans from the real orientation and writes the counts
- `Cuboid`: a drag follows the pointer and is recorded as presses

**[`CurrencyInput.md`](decisions/CurrencyInput.md)**

- Controls: `CurrencyInput`, and why it is not `NumberInput` with grouping

**[`DateInput.md`](decisions/DateInput.md)**

- Controls: `DateInput` and `DatePicker`, without the mask
- Date and time bounds are `minValue` and `maxValue`
- Controls: `DateInput`'s format states the order, and the mask follows from it

**[`DateRangePicker.md`](decisions/DateRangePicker.md)**

- Splits, and telling an outside clear from the echo of an inside one
- `DateRangePicker` and `DateTimePicker` under one caption: a group named by it, each field keeping its own label

**[`DateTimeValue.md`](decisions/DateTimeValue.md)**

- `DateTimeValue`, and why a missing half is no value

**[`DateValue.md`](decisions/DateValue.md)**

- The date value carries its calendar system, and every bound is asked of it
- An era is named from year 2, not from its first day

**[`Die.md`](decisions/Die.md)**

- `Die`: any convex solid of flat faces, rolled the way the wheel is spun
- `Die`: free turning, drift and dragging, through `Roller`
- `Die`: a core at the center, through `renderCore`

**[`Dismisser.md`](decisions/Dismisser.md)**

- An Escape something already answered does not also close the layer above it

**[`Drawer.md`](decisions/Drawer.md)**

- Controls: `Drawer` as a `Modal` preset, and why `AlertDialog` is not one
- `Drawer`: why swipe-to-close follows `isDismissableOnOverlayClick`

**[`DrumWheel.md`](decisions/DrumWheel.md)**

- `DrumWheel` page: three reels take one result through `computeSpinTarget`

**[`EdgeFader.md`](decisions/EdgeFader.md)**

- `EdgeFader`: a mask on the content, fixed or following the scroll
- `EdgeFader`'s Docs page: one example per feature, a knob per side

**[`ElementFader.md`](decisions/ElementFader.md)**

- The floater appears and disappears through `ElementFader`, like every other library element that comes and goes
- `ElementFader`: the frame that starts a transition needs a fallback
- `ElementFader`: the end of a transition is the browser's answer, not the duration

**[`ElementObserver.md`](decisions/ElementObserver.md)**

- `ElementObserver` is the one place that watches an element's size
- `ElementObserver`: the current-index helper
- `ElementObserver` reports a size, and the height observer is a view of it
- Measuring the element in front: a list observer, and the whole list handed to the painter
- `ElementObserver`: progress through the viewport

**[`Elevation.md`](decisions/Elevation.md)**

- `Abstracts/Elevation`: a height an element has without carrying a z-index

**[`FanMenu.md`](decisions/FanMenu.md)**

- `FanMenu`: levels that replace rather than stack, and the row that walks back

**[`FileInput.md`](decisions/FileInput.md)**

- Controls: `FileInput` and `ColorInput`, where the UA owns the activation
- `FileInput`: a limit on what the control holds is the control's

**[`FittedText.md`](decisions/FittedText.md)**

- `FittedText`: lines sized to fill their box, around a function that sat unused

**[`Flattener.md`](decisions/Flattener.md)**

- `Abstracts/Flattener`: one walk, and the counter that is what `Select` and `Tree` disagreed about

**[`Flipbook.md`](decisions/Flipbook.md)**

- `Flipbook`: a book on a spine, and three ways to turn a page

**[`FlipCard.md`](decisions/FlipCard.md)**

- `FlipCard`: the smallest thing that can turn a barrel
- `FlipCard`: `turnDirection` makes the angle accumulate
- `FlipCard`: `peekRatio` is a lean, not a turn

**[`Floater.md`](decisions/Floater.md)**

- Floaters are an `Abstract`, and follow the highlight as well as the selection

**[`FlyoutMenu.md`](decisions/FlyoutMenu.md)**

- `FlyoutMenu`: a site's navigation bar, after the W3C's fly-out menu tutorial

**[`Form.md`](decisions/Form.md)**

- Controls: `Form` moves focus to the first field in error on submit
- The form story: the library wires, the consumer validates
- A control with no native element submits through a hidden input
- `Form` hands `onSubmit` the browser's `FormData`
- `Form`'s Docs page: the submit button is never disabled, and a status line shows `isValid`

**[`Formation.md`](decisions/Formation.md)**

- `Formation` is the abstract's, and the placed box became two things because of it
- The grouped panel is every page with a sample picker, not just `Formation`
- `Formation`: positions written as fractions of the width, and nothing measured
- `Formation`: gliding between arrangements is a transition on the placed box, and the angle left `transform` to allow it
- `Formation`: items are keyed by themselves

**[`FormSection.md`](decisions/FormSection.md)**

- `FormSection`: the collecting stops at the nearest one

**[`Glass.md`](decisions/Glass.md)**

- The glass effect is a type in `Abstracts`, and the sheen stopped being a sample

**[`GlassSurface.md`](decisions/GlassSurface.md)**

- `GlassSurface`, and the two things that decide its shape
- The Playground does not use `GlassSurface` outside its own page

**[`HoverCard.md`](decisions/HoverCard.md)**

- Controls: `HoverCard` as a preset over the hover engine and `Popover`

**[`HoverIntent.md`](decisions/HoverIntent.md)**

- `HoverIntent`: the hover engine lifted out of `Tooltip`, and `Tooltip` on top of it

**[`ImageMosaic.md`](decisions/ImageMosaic.md)**

- `ImageMosaic`: no smallest to aim at, so it is given a shape to aim at instead

**[`InfiniteCorridor.md`](decisions/InfiniteCorridor.md)**

- `InfiniteCorridor`: looking down a corridor of items, walked by a progress from outside
- `InfiniteCorridor`'s tube: items lining a ring of sides, upright towards the center

**[`InteractionSettings.md`](decisions/InteractionSettings.md)**

- `InteractionSettings`: a wrapper whose settings nest, with the toast keys as its first

**[`InteractionTracker.md`](decisions/InteractionTracker.md)**

- Pointer drag: a ratio, opt-in, and captured
- The one-shot activation origin: a flag with a count, and opt-in for the same reason `trackDrag` is
- The swipe: one gesture over the drag machinery, an axis it claims, and a verdict at the end
- The hold is one function, and all three consumers call it

**[`Label.md`](decisions/Label.md)**

- Controls: `Label`

**[`Lens.md`](decisions/Lens.md)**

- `Lens`: Reveal's window the other way round

**[`LightCatcher.md`](decisions/LightCatcher.md)**

- `LightCatcher`: the lamp grid, on one element at a time

**[`Listbox.md`](decisions/Listbox.md)**

- Controls: `Listbox` exported, and where focus sits is a setting the list's state is created with
- `Listbox`, `Tooltip` and `Stepper` Docs pages

**[`LiveAnnouncer.md`](decisions/LiveAnnouncer.md)**

- `LiveAnnouncer`: the region that belongs to no component

**[`MaskedField.md`](decisions/MaskedField.md)**

- A typed sign is opt-in, and only the grouped mask has one
- Group sizes are read from the decimal point outwards, and the last one repeats
- The mask: only digits are typed, and the caret is computed rather than preserved
- A masked field shows the separator it wants next, and never deletes what it could not read
- A masked field offers the placeholder that matches its own mask
- `MaskedField`: the half every field over a typed value shares
- The masked field commits only what the reader typed, flags a value it cannot read back, and settles on blur

**[`MediaQueryMonitor.md`](decisions/MediaQueryMonitor.md)**

- `MediaQueryMonitor`: a media query as an accessor, shared per query

**[`Menu.md`](decisions/Menu.md)**

- `Menu` sections are `Select`'s groups again
- A menu paints its first item highlighted the moment it opens
- `Menu` submenus: a level per popup, focus moving between them
- `Menu`: Tab leaves for the stop after the trigger
- `Menu`: `staysOpenOnPick` is the item's to say
- `ContextMenu`: the same menu, opened by a right-click at a point
- Controls: stateful `Menu` rows, and the run that makes a radio group

**[`Menubar.md`](decisions/Menubar.md)**

- Controls: `Menubar`, a preset over `Toolbar`, and the open-follows-focus rule

**[`Modal.md`](decisions/Modal.md)**

- `Modal` has to be named, and it seals the page behind it
- `Modal`: Escape can be refused, and refusing both routes is the consumer's responsibility

**[`MorphText.md`](decisions/MorphText.md)**

- `MorphText`: two copies melting into each other under one filter

**[`Mosaic.md`](decisions/Mosaic.md)**

- `Mosaic`: one side comes from the parent, the other is what the arrangement costs
- `Mosaic`: a re-pack glides through the Web Animations API, and a resize does not
- `Mosaic`: tiles are keyed by identity, and duplicate keys are counted rather than merged
- `Mosaic`: the keyboard walk is opt-in, named, and follows what the eye sees

**[`MultiSelect.md`](decisions/MultiSelect.md)**

- `MultiSelect`, `Checkbox` and `Toggle`: Docs pages on the settled patterns

**[`Navigator.md`](decisions/Navigator.md)**

- `Navigator` is told the direction, and one observer tells everyone
- `NavigatorUtils.computeNextCell`: the two-axis walk never wraps and never clamps

**[`NumberInput.md`](decisions/NumberInput.md)**

- Controls: `NumberInput`, and the first preset that earns a codec
- Controls: `NumberInput`'s page step, and numbers read and written by locale
- The stepper handles report whether they moved

**[`OverheadWheel.md`](decisions/OverheadWheel.md)**

- `OverheadWheel` and `DrumWheel`: two presets, because a wheel cannot become a drum

**[`Paginator.md`](decisions/Paginator.md)**

- `Paginator` takes a layout, and the placed box moves into the abstract
- Controls: `Paginator`, where the arithmetic is the component
- `Paginator`: every page is its own Tab stop, and stays that way
- `Paginator` is a root and pieces, with the ready-made row on top

**[`PaintedText.md`](decisions/PaintedText.md)**

- `PaintedText`: along a path, set by the browser and slid by `progress`
- `PaintedText`: SVG text, wrapped by `Typewriter`'s utility and placed by the browser

**[`PanZoom.md`](decisions/PanZoom.md)**

- `PanZoom`: one window over content, shared by `Timeline`, `Bracket` and `PatchBoard`
- A gesture with no single-pointer route warns when the consumer holds nothing to build one on
- A view set from outside is held in by the rule for that view, not for the one it replaces

**[`ParticleDissolve.md`](decisions/ParticleDissolve.md)**

- `ParticleDissolve`: a mask and a particle field on one progress, and where the particles may come from

**[`ParticleField.md`](decisions/ParticleField.md)**

- `ParticleField`: particles that appear in place, on a grid, timed by weights

**[`ParticleSpawner.md`](decisions/ParticleSpawner.md)**

- `ParticleSpawner`: every engine shares one frame, measures first, and only while a round is in flight
- `ParticleSpawner`: `emit` sends a round alongside playback, and that is what makes a relay
- `ParticleSpawner`: a round is worked out from its progress, so it pauses and scrubs
- `ParticleSpawner`: a route is a list of stops, and modifiers move a particle after its path
- `ParticleSpawner`'s travel paths, easings and iteration patterns are library samples
- `ParticleSpawner`: a stage waits before it begins, as the SVG animations do

**[`PatchBoard.md`](decisions/PatchBoard.md)**

- `PatchBoard`: boxes placed by hand, sockets, and cables that are the data rather than a drawing of it
- `PatchBoard`, a node graph rather than a list
- `PatchBoard`: positions written as fractions of the width, like `Formation`
- `PatchBoard`: snapping is a spot-to-spot function, and an arrow key goes to the next snapped spot
- `PatchBoard`: refusing loops is a helper for `computeCanLink`, not a board rule
- `PatchBoard`: boards that share a `groupId` pass nodes between them, landing where they were held

**[`Placement.md`](decisions/Placement.md)**

- Arbitrary item placement: `Abstracts/Placement`, and `Menu` as the first consumer
- Concentric submenus: `computeLayout` learns where it is, and a submenu borrows its parent's anchor
- A wheel of wedges: sectors on the placement, and an X in the hole
- The wheel as the ring's second consumer, and the `Placement` page
- A fan is an arc that tilts, so there is no fan
- One factory per arrangement, and defaults that are nobody's example
- Layouts carry no pixels, and the box a layout is given is the consumer's
- Sized and fitted layouts are one family, and the registry lists both
- Every layout sample lives in one place, and none of them is a menu's
- The band and the arc are two placers, and `fit` was the seam between them
- The two copies of the placement center are kept in step by a test
- The arc can be flattened or stretched, and spaces its items along the curve
- The arc fills the box the width sets, and its items never move the box
- The fan places tilted boxes, not wedges
- A hover the pointer did not cause no longer moves the highlight
- A nested band's wedge is never narrower than the label it will hold
- The wedge gap holds its width rather than its angle as the bands go out
- The arc never closes, so the seam and the anchoring both stop jumping
- The ring starts from the same place at every spread, a whole turn included
- The cliff exposes one knob, because the other four broke it
- The honeycomb's unit is a cell, and a whorl clears the whorl above it
- The band's hole is a share of its radius, so nothing about it is a length
- The band places one ring and nothing else; the wheel owns its own stacking
- A placed menu walks on all four arrows, so `Escape` steps out one band
- Five more controls take a layout, and each one broke something different
- A landing mark is placed like an item, and the gap between two placements is geometry
- A column fills its width, and how wide it is belongs to whatever holds it
- Each layout family is a module of its own, and `PlacementLayoutUtils` is the one that holds the names

**[`PointerEffects.md`](decisions/PointerEffects.md)**

- `Exotics/PointerEffects`: three wrappers that restyle their content by where the pointer is

**[`PointerTracker.md`](decisions/PointerTracker.md)**

- `PointerTracker`: one reading of where the pointer is relative to one element

**[`Popover.md`](decisions/Popover.md)**

- Controls: `Popover` extracted, and `Menu` as the second consumer
- Dismissal is one stack, and `Popover` is the layer

**[`PopupTrigger.md`](decisions/PopupTrigger.md)**

- The pickers own their trigger, and `PopupTrigger` is the leaf they share

**[`Preview.md`](decisions/Preview.md)**

- Controls: `Preview`, which shortens rather than hides

**[`Progress.md`](decisions/Progress.md)**

- Controls: `Progress`, and what a non-interactive Fundamental looks like
- Controls: `Progress`'s `role`, and the name both roles require

**[`Proximity.md`](decisions/Proximity.md)**

- `Abstracts/Proximity`: an arrangement reacts to the pointer, and the reaction is the consumer's

**[`ProximityText.md`](decisions/ProximityText.md)**

- `ProximityText`: letters held at how near a point is

**[`RadioGroup.md`](decisions/RadioGroup.md)**

- `RadioGroup` and `Tabs` take a layout too, and the floater stops being measured
- A group's radios are ordered by the document, and only once every one of them has reported
- `RadioGroup` takes a floater, and both floater observers are guarded
- A segmented control is `RadioGroup` paint, and the Radio page proves it

**[`Range.md`](decisions/Range.md)**

- Controls: `Range`'s pointer seam, and `RangeUtils`
- Controls: `Range`
- Controls: `Range`'s value text, its end-of-change callback, and ids per thumb

**[`RangeCalendar.md`](decisions/RangeCalendar.md)**

- Controls: `RangeCalendar`, `DateRangePicker`, and the half-entered state

**[`Reveal.md`](decisions/Reveal.md)**

- `Reveal`: a cover with a hole where the pointer is
- `Reveal`: one Tab stop, the hole opened by keyboard focus and moved by the arrows

**[`RGBAnimation.md`](decisions/RGBAnimation.md)**

- `RGBAnimation`: `CellAnimation` by channel instead of by cell

**[`RichText.md`](decisions/RichText.md)**

- `RichText`: a tag name is what you could write after a dot in JavaScript
- `RichText`: the class map is handed over whole, and the diff example is what proves it
- `RichText`: attributes are the consumer's to allow, and a bracket that asks for one it was not given is prose
- `RichText`: `renderTag` comes before the class map, and `undefined` is how it passes
- `RichText`: the parser is linear and never recurses, and `maxDepth` guards the renderer
- Docs prose: prop names and WCAG criteria are marked, through `RichText` tags and the API builder

**[`Roller.md`](decisions/Roller.md)**

- `Roller`: the wheel's behavior with one more dimension

**[`Rotator.md`](decisions/Rotator.md)**

- `Rotator`: the behavior both wheels share, with no DOM of its own
- `Rotator`, and the difference between where a wheel is and where it is going

**[`Satellite.md`](decisions/Satellite.md)**

- `Satellite`: two elements, and a box that covers both
- `Satellite`: one list of satellites, and one padding for all of them
- `Satellite`: a badge is an example, not a component

**[`ScanlineAnimation.md`](decisions/ScanlineAnimation.md)**

- `ScanlineAnimation`: `orientation`, and why the defs are not transposed

**[`ScrambleText.md`](decisions/ScrambleText.md)**

- `ScrambleText`: the text is replaced rather than animated, and that decides the whole shape
- `ScrambleText`: `changedOnly` diffs the two texts, and a carried character must have settled to stay settled
- `ScrambleText`: the glyph set is a function of the character it will settle on

**[`ScratchCard.md`](decisions/ScratchCard.md)**

- `ScratchCard` and `Reveal`: one mechanism, two components, one folder
- `ScratchCard`: one path that grows, and why the grid it used to have is gone
- `ScratchCard` and `Reveal`: what is under the cover cannot be reached until it is uncovered

**[`Scroller.md`](decisions/Scroller.md)**

- Controls: `Scroller`, and why it renders no button of its own
- `Scroller` can keep some of the last view

**[`SegmentedInput.md`](decisions/SegmentedInput.md)**

- Controls: `SegmentedInput`, one hidden field drawn as cells

**[`Select.md`](decisions/Select.md)**

- Controls: `Select`, and who owns a floating list
- Controls: `Select` and `MultiSelect` clear slot
- Controls: `Select`'s autocomplete, and why the consumer filters
- One walk numbers the options, and both of `Select`'s rendering paths read it
- Grouping and windowing compose, and the group box is what makes it possible
- Controls: option groups, and `Select` / `MultiSelect` as presets
- `Select`: a typed-into field carries the picked text
- `Select`: what the reference libraries do
- A list the consumer has not finished handing over: `getHasMoreOptions`, `onReachEnd`, and a marker
- `Select`'s Docs page: nineteen examples into twelve sections, and the large list keeps its count and its timing

**[`Selection.md`](decisions/Selection.md)**

- `Abstracts/Selection`: the anchor is the abstract's, and the selection is the consumer's

**[`ShadowCaster.md`](decisions/ShadowCaster.md)**

- `ShadowCaster`: a wrapper, and a filter rather than a box shadow

**[`Shape.md`](decisions/Shape.md)**

- `hectogon` is the near-circle, named for what it is
- Every built-in shape with more than three corners has a `_star` version
- `Shape`: the contour is also the float area
- `Shape`: a morph is the consumer's signal read inside `computePoints`

**[`ShapeReveal.md`](decisions/ShapeReveal.md)**

- `ShapeReveal`: a change shown through a shape growing from a point

**[`SharedTooltip.md`](decisions/SharedTooltip.md)**

- `SharedTooltip`: the controls inside it share one tooltip

**[`Shortcut.md`](decisions/Shortcut.md)**

- The shortcut register: a binding belongs to a layer, and the helpers' to the page

**[`Sidebar.md`](decisions/Sidebar.md)**

- `Sidebar`: a panel that grows between two widths and never blocks the page

**[`SignalMirror.md`](decisions/SignalMirror.md)**

- `SignalMirror`, and the form wiring finished

**[`Skins.md`](decisions/Skins.md)**

- Skins

**[`SliceAnimation.md`](decisions/SliceAnimation.md)**

- The animation sample collections: `fromZones`, and why a fifth circle is not worth adding
- The animation pages give each example its own pause button and scrubber
- Slice animations: a component takes the recipe, and draws it on the graphics card when it can
- The scanline page stays a gallery of effects
- The 0..1 guarantee belongs to `computeSliceWeights`, not to each formula
- Particle and cell layers are contained, and never clipped
- A run's clock waits until there is something to draw

**[`SliceAnimationPlayback.md`](decisions/SliceAnimationPlayback.md)**

- `SliceAnimationPlayback`: which way a pass runs, and why the duration it is given is one-way

**[`SlideButton.md`](decisions/SlideButton.md)**

- Controls: `SlideButton`, and why the gesture is the only thing it owns
- `SlideButton` takes an `orientation`
- `SlideButton`: what the reference libraries do
- `SlideButton` completes part-way along
- `SlideButton`'s `mode` closes a pointer route, and never the keyboard one
- `SlideButton` describes its own gesture, through `ariaDescription` and a warning when it is missing

**[`SlotText.md`](decisions/SlotText.md)**

- `SlotText`: the columns turn the way the number is going, and the arithmetic above the barrel is the component
- `SlotText`: a split-flap is a second way to draw the same count, on `Spine`
- `SlotText`: a reel is asked per column, and it replaces the ripple rather than adding to it
- `SlotText`: an arriving slot grows in, a leaving one shrinks out, and it stays until it has
- `SlotText`: letters are columns of their own, and each turns its own way

**[`Smoother.md`](decisions/Smoother.md)**

- `Smoother`: trailing a value is measured in time, and the pointer effects ease what they paint

**[`Sortable.md`](decisions/Sortable.md)**

- The `Sortable` page's cards center on their slot rather than filling it, and its surfaces are given room
- Controls: `Sortable`, and why a drag is the least important of its three routes
- `Sortable`, and telling somebody an item can be moved before they press anything

**[`SortableGrid.md`](decisions/SortableGrid.md)**

- `SortableGrid`: an inventory board, where the space left over is the game
- `SortableGrid`: a blocked spot is a wall, and a wall is not a place to aim at from the keyboard
- `SortableGrid`: `compact()` slides, it does not repack

**[`Spine.md`](decisions/Spine.md)**

- `Spine`: faces hinged on one line, each swung out by its distance from the current one

**[`SplitPane.md`](decisions/SplitPane.md)**

- Controls: `SplitPane`, where CSS grid is the arithmetic
- `SplitPane`, and the three things a splitter was missing
- A pane does not clip its contents, so a painted pane keeps its shadow

**[`Spotlight.md`](decisions/Spotlight.md)**

- `Spotlight`'s overlay is one masked layer and one clipped layer, not a ring of eight boxes
- Spotlights stack like modals: only the top one acts

**[`Staircase.md`](decisions/Staircase.md)**

- `Staircase`: the direction is the component's, and the curve is the consumer's

**[`Stepper.md`](decisions/Stepper.md)**

- Controls: `Stepper`, where the state vocabulary is the consumer's
- `Stepper`: a layout and `renderBody` are refused together by the type

**[`Sunburst.md`](decisions/Sunburst.md)**

- `Sunburst`, `CirclePacking` and `Icicle`: Treemap's siblings, each following its D3 gallery example
- `Icicle` and `Sunburst` keep their own span walks

**[`SVGDefs.md`](decisions/SVGDefs.md)**

- `SVGStyleDefsUtils`: a computed style into fill and stroke
- A SMIL animation resets by being rebuilt, and the defs record is what says so
- `addTurbulenceFilter` emits two primitives, because a lone `feTurbulence` cannot chain
- A pixelate filter, built from an image of dots
- The SVG defs vocabulary is sample code, and the arithmetic is a file with no JSX in it
- The Playground: a paint is chosen as a kind, then a sample
- The defs registries are split by what drives a sample, not by what it looks like
- Per-sample defs: a sample is a factory, an entry is a family plus a bag, and knobs are derived
- What collapsed, and what a turned knob means for the key
- `SVGDefsFrameUtils.createClock` is the shared animation frame for samples that fade rather than follow
- The gradient and pattern registries each get a page that paints them as a fill
- Paint area: a gradient laid across a box other than the element it paints

**[`SVGDefs-sample-families.md`](decisions/SVGDefs-sample-families.md)**

- A sample key is a sentence, and its number is a color count
- A tracked sample key is a mark, then a treatment, then a color count
- Cycling the timed gradients: which color a stop takes, and why the transparent ones are concrete
- `flow` has parity across both suffixes, and banding needed its own cycling helper
- The bands leave the surface by traveling off it
- The flares are a table of ghosts, arrived at over three tries
- A radial gradient can only be a circle, so `aspect` and `angle` turn it into an ellipse
- `hand_1` is `snake_1` with the clock taken out, a third color stop, and a narrower wedge
- `hand_trail_1` is the trail machinery with a bearing frozen instead of a position
- The trails leave stamps behind and fade them where they lie
- The ripples are a wake rather than a highlight, and they spawn on distance rather than on time
- Every ripple had a banded twin, and they were deleted

**[`SVGDefs-samples.md`](decisions/SVGDefs-samples.md)**

- The gradient samples' tuning is props, composed rather than declared per sample
- A band's travel is the pointer projected onto the band's own axis, normalized
- The hand's sweep is pinned across its arc, and a fade exponent says so in its label
- The cycle time sits beside the cycle switch, and the smear has a one-color member
- A spot can hold its shape against the box, and the correction sits outside the smear's turn
- A trail sample opens one pointer tracker, not one per stamp
- A tracked gradient's defaults have one home, and the samples read from it
- A trail for the tracked patterns, and three more tracked gradient families
- `pixel_trail`: squares snapped to a grid, which is not a pattern's `trailMs`
- Patterns split into timed and tracked, the way the gradients are
- Lighting primitives: the surface is turbulence, and the light is what moves
- `spot_1`: the same idea with no filter at all
- `glass_sheen_1`, and what a pointer-driven sample looks like

**[`SVGFilters.md`](decisions/SVGFilters.md)**

- The `SVGFilters` page is the factory's

**[`Table.md`](decisions/Table.md)**

- Controls: `Table`, a grid rather than a table, and why the markup could not be `<table>`
- `Table` pinned columns
- `Table` expandable rows
- `Table` leaves filtering and in-place editing to the consumer
- `Table` columns reorder, and the carry engine became `Abstracts/Carrier` to do it
- `Table`, and why a header cell stopped being a target
- `Table`'s Docs page: ten examples into Basic and seven sections

**[`TableOfContents.md`](decisions/TableOfContents.md)**

- Controls: `TableOfContents`, where the article is the consumer's

**[`Tabs.md`](decisions/Tabs.md)**

- Controls: `Tabs` as records, and the shape a data-driven group has to take
- `Tabs` warns about a tab nobody wired to a panel
- `TabPanel`: the pairing is written on the record, and read from both ends
- `Tabs`, `Accordion`, `Toolbar`, `Breadcrumbs`, `Stepper`: a disabled item can be kept reachable

**[`TagInput.md`](decisions/TagInput.md)**

- Controls: `TagInput`, and why it is not a `TextField` preset

**[`TextField.md`](decisions/TextField.md)**

- Controls: `TextField` extracted, with `TextInput` and `TextArea` as presets
- `TextField` takes a mask transform, not a pattern

**[`TextInput.md`](decisions/TextInput.md)**

- Controls: `TextInput`
- Controls: `TextInput`'s suggestions, and why they sit on `TextInput` rather than `TextField`
- `TextInput`'s Docs page: states as knobs, one section per use

**[`TextSync.md`](decisions/TextSync.md)**

- `TextSync` is public, so the mask is a contract rather than an implementation

**[`TileBoard.md`](decisions/TileBoard.md)**

- `TileBoard`, ported from a React game, and the tiling table each shape needs
- `TileBoard`: reach and route are pure helpers on the neighbor table
- `TileBoard`: a sweep begins by leaving a tile, and the board hit-tests it itself
- Triangles that share a box: the cut tilings on `TileBoard` and in the patterns

**[`Tilter.md`](decisions/Tilter.md)**

- `Tilter`: it tracks the area, not the surface that turns

**[`TimeInput.md`](decisions/TimeInput.md)**

- The am/pm segment is a control in the trailing slot, not a slot in the mask
- Controls: `TimeInput`, and stepping the segment the caret is in

**[`Timeline.md`](decisions/Timeline.md)**

- `Timeline`: a window over a range, where the component owns the arithmetic and nothing else moves it
- `Timeline`: markers are a list of values, drawn like ticks
- `Timeline`: an item's edges are a `Carrier` carry, and `Enter` takes hold

**[`TimePicker.md`](decisions/TimePicker.md)**

- Controls: `TimePicker`, and the trailing slot carrying two controls

**[`Toasts.md`](decisions/Toasts.md)**

- Controls: `Toasts`, and a queue the consumer owns
- `Toasts`: swipe to dismiss follows the stack's edge, and the painter draws the slide
- `Toasts`: what the painter gets, and why position is not fully delegated
- `Toasts` becomes a provider, and each toast brings its own painter — decided, not yet built
- `Toasts` as a provider: what building it settled

**[`Toolbar.md`](decisions/Toolbar.md)**

- Controls: `Toolbar`, and why the overflow is the component
- Controls: `Toolbar`'s `pressedValues`, and why a toggle group is a toolbar

**[`Tooltip.md`](decisions/Tooltip.md)**

- A tooltip can be hovered, and the offset it is held clear by is bridged rather than left as dead space
- A control's hovered item stays hovered while the pointer is on that item's tooltip
- `Tooltip`: a hover waits, and a shared window lets the next one skip the wait
- `Tooltip`: handed a new anchor while showing, it glides there
- `Tooltip`: showing it drops a placeholder where it sits, and that is left as it is

**[`Trail.md`](decisions/Trail.md)**

- Playback is `playback` everywhere, and `Trail` lost its `play` and `pause`
- `Trail`: a path, one traveler, and a frame loop chosen over the CSS the platform already has
- `Trail`: followers are offsets on one clock

**[`Tree.md`](decisions/Tree.md)**

- Controls: `Tree`, and the group box that could not be a child
- `Tree`: the arrow opens, the name selects
- `MultiTree` is a checkbox tree
- A branch whose children have not arrived: `hasMoreChildren`, and where the waiting is painted
- A windowed `Tree` is flat, and that is the opposite of a windowed `Select`
- `Tree` nodes can be links, on `Tab<T>`'s terms
- A placed `Tree` draws the line to each node's parent through `renderConnector`
- A placed `Tree` can be given rings without `Tree` knowing, and what that costs

**[`Treemap.md`](decisions/Treemap.md)**

- `Treemap`: one level at a time, following D3's zoomable treemap

**[`TurnClock.md`](decisions/TurnClock.md)**

- The timing both turning abstracts share is `TurnClock`

**[`Typeahead.md`](decisions/Typeahead.md)**

- Typeahead: the text is read off the item, and `computeCustomText` is the way out

**[`Typewriter.md`](decisions/Typewriter.md)**

- `Typewriter`: erase is the same run played backwards, and the text rests hidden after it
- `Typewriter`: one progress draws every moment, whether it plays or is driven from outside
- `Typewriter`: arrival order is ScrambleText's weights over a run of `count × animationDelayMs`
- Text wrappers drive a drawer: `<Typewriter><PaintedText/></Typewriter>`

**[`Viewport.md`](decisions/Viewport.md)**

- The viewport split in two, and only the wrapper is a component
- A `Viewport` is a region, and it is terminal for everything inside it
- A nested `Viewport` with no room warns once
- The viewport is terminal, and an anchored layer tracks its anchor rather than polling for it
- A popup with no `Viewport` is fixed to the window, and its highlighted row scrolls only the popup

**[`Virtualizer.md`](decisions/Virtualizer.md)**

- A list too long to mount: `computeEstimatedOptionHeight` and `Abstracts/Virtualizer`
- A windowed row is placed with `top`, not a transform, because the highlight measures layout
- A scroll to a row is written in whole pixels

**[`Wheel.md`](decisions/Wheel.md)**

- An overhead wheel turns its picked wedge to the marker, and the marker is a prop
- A wheel's label lies across its wedge, and flips rather than reading upside down
- An overhead wheel takes presses only on its round face, and paints wherever it likes
- A drum face's turn animates and its distance from the axis does not

**[`WheelMenu.md`](decisions/WheelMenu.md)**

- `WheelMenu`: the wheel becomes a component, and `Menu` forgets it ever knew
- Hold and flick: the wheel's fast path, and the three criteria that shaped it

**[`Wraparound.md`](decisions/Wraparound.md)**

- `Wraparound`: one real copy that moves to wherever it is needed
- `Wraparound`: it drifts by itself, and one switch turns off moving it by hand
