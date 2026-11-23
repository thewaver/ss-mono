# Decisions: repo-layout

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The three trees

`@thewaver/ss-components` is a SolidJS component library plus a Playground app documenting it.
Vanilla-extract for styles, Vite for both builds. It shares this repo with `@thewaver/ss-utils`; see
_"One repo, three packages"_ for why and for what that changes.

- **`utils/src`** — `@thewaver/ss-utils`, published separately and depended on by the other two. Its
  own conventions travel with it, including the documented exports; see _"`ss-utils` is the opposite"_
  in `CLAUDE.md`.
- **`components/src`** — the published library's framework-free core, `@thewaver/ss-components`, with
  `components-solid/src` and `components-react/src` beside it holding each framework's views
  (_"Porting: the three packages"_). These are the trees with a support contract (see _"Compatibility arguments"_).
- **`playground-solid/src` and `playground-react/src`**, over the shared **`playground/src`** — the demo app,
  once per framework (_"Porting: the Playground in two frameworks"_). What follows was written of the one Solid
  Playground and holds for each. `App/StyledComponents` holds paint and nothing else, mostly
  consumer-side painters named `<LibComponent>Content` after the shell whose slot it fills, with the
  playground-wide `Page` prefix: `PageButtonContent`, `PageCheckboxContent`, `PageTooltipContent`.
  `App/PageComponents` holds everything that behaves: the playground's own furniture (`PageVariants`,
  `PageExamples`, `PageCodeBox`) and every composition that wires a library control up (`PageNumberField`,
  `PageCalendarCaption`, `PageSidebarToggle`).

**The line between the two folders is paint versus behavior.** Stated by the user, replacing an earlier
rule that drew the line at the library — "anything that dresses a library component belongs in
`StyledComponents`" — under which `Field`, `ColorChannels` and `CalendarCaption` had been moved in. The reason
for the new line is what `StyledComponents` is for: it is meant to grow theme subfolders that can be swapped
wholesale to change how the whole Playground looks, so it may hold only what a different look would replace —
markup, classes, the mapping from props to classes, and the layer read (_"Layers"_ below). Anything that changes
what a control does lives in `PageComponents` and composes the paint: value wiring, resets, event handlers,
focus management, wrapping a library control. Where a moved component had paint of its own, the paint stayed
behind as a component of its own — `PageEraCycleContent`, `PageMeridiemToggleContent`,
`PageScrollerButtonContent`, `PageNumberInputStepperContent`, `PageSidebarToggleButton`, `PageTabPanelContent`,
`PageCalendarCaptionFields` — and the behavior half renders it. `pageColorPickerSlots` moved to
`PageComponents/ColorPicker` because it renders `PageColorChannels`.

**A borderline file is split by purpose, not by mechanism.** The user's call, with the individual cases left
to judgment: code whose only job is producing a look stays in `StyledComponents` even when it uses signals,
memos or timers, because a different brand replaces it along with the styling. So `Ripple` keeps its timers,
`ToastContent` its pile transforms, `SortableGridContent` and `SVGFiltersContent` their memos, and the sidebar
toggle's paint picks its own arrow. `ToastContent` also keeps its close `Button`: it forwards the `onDismiss` it
is handed and decides nothing. `NumberInputStepper` did not qualify, because it decides when each button is
disabled and binds the stepping handlers.

**`StyledComponents` imports from `PageComponents` in exactly one place**, `Layer/Layer.context.ts`, which
reads the layer context. Everything else runs the other way. The `<LibComponent>Content` naming is for slot
painters only; the rest keep the name of the thing they are.

### Layers

**A control paints from the layer it sits on, and never guesses.** The user's design. Before it, every
styled component picked its own fill and text color — `"black"`, `surface.dark`, `currentColor` at some
alpha — on the assumption of what would be behind it, and the assumption was wrong as soon as the control
appeared somewhere else (a calendar inside a popup, a field inside a modal). The theme now carries one pair
per layer, `color.layers.level0` to `level2`, each a full family — `dark`, `main`, `light` and `contrast` — so a
container can paint itself from its level as well as hand it to its controls.

**A container is one level above where it sits, and wears that level itself** — the user's design, replacing three
fixed levels. Level 0 is the page background. A container (an example, variants or docs box, a gallery tile, a Skins
column, the left menu, a modal, a drawer, a sidebar, a popover, a hover card, a toast, a tooltip, a spotlight popup)
takes one more than the level it sits on and stops at 2, the last level the Themes define; so a popover opened from
an example box is at 2, and one opened from the page at 1. **The container's own element wears its level** as well as
handing it to its contents: before, a box painted from the fixed `surface` colors while handing its controls a level,
so the settings popover and an example box looked alike yet held controls in different colors. **A popover that opens
from an input** (select, multi-select and autocomplete lists, the pickers) carries its input's level and is not a
container. Two places keep a fixed level: the nav preview, which shows a page at 1, and a docs example's code box,
which drops to 0.

**The Playground sets the level, not the library.** `PageLayer` in `PageComponents/Layer` provides it — with no
`level`, one above its parent's — and each container puts it inside its root and the next-level class
(`useNextLayerClass`) on its root, or wraps its root in it where the root is a separate painter (the menu popups,
toasts). The level reaches a portalled container through context, which every framework keeps across the move to the
end of the page. `PagePopoverSurface` sets nothing, because it serves both kinds of popup and takes its level from
wherever it is mounted.

**Every styled component reads the level itself.** Also the user's call, over the alternative of letting
the containers switch the colors and keeping components unaware: reading the context is one of the few
pieces of logic a theme is expected to own, because a different theme may not use layers at all. So each
painter calls `useLayerClass()` and puts the returned class on its root. **The class only names the level; only a
Skin turns it into paint** — the user's design, so that no painter assumes the Theme has three background levels.
Nothing outside the Skins reads a color by level (`Skins.md`, _"Skins"_): what used to now wears a Skin entry, derives
from the surrounding text color, or takes a fixed color (`Skins.md`, under the custom-layout rule).

**`PageLayer` also marks the level on the page, through `PageLayerScope`**, a `display: contents` element
carrying the same class, and the Skin's root counts as level 0, so `<html>` and anything portalled to the end of the
page have the level-0 values. That is what reaches paint no component owns: a page's
own stylesheet, text typed into a library input (styled through `computeTextStyle`, which is a plain
function), and anything a library control renders between a provider and a painter. It takes no part in
layout, and the library measures its own wrappers rather than what a slot returns, so nothing positioned
sees it.

**Where a surface sits decides its paint, not what it is.** The user's rule. Anything page-level — on the
page background or in a top-level portal of its own: the example box, the left menu, modals, drawers, toasts,
spotlight popups, tooltips — takes the `surface` gradient. Anything contained in an example box
takes a solid fill of its level: a sample's frames and panels wear `panel` (the Preview box and the Spotlights tour strip are plain black, the user's pick), unless the frame has a Skin entry: `Table`'s frame is `panel`, and the `Toolbar` and `Menubar` bars are `dropZone`. The one exception is
`PageSidebarSurface`, which paints exactly the left menu's gradient, since it is a sample of that same
furniture; a solid fill was tried and reverted by the user. The page's own ground, read straight from `color.layers.level0`, is off-limits to all of it. Where a solid fill takes away the difference between neighboring tiles or cells, their
separators become the 25% stroke, since a separator painted in the fill itself disappears.

**A control's own stroke is `contrast` at 25%.** The user's rule; 50% was tried first and read too strong.
A state that strengthens the stroke — a sortable item or grid cell picked up or blocked — goes to 50%. A
line that divides parts of something — table rows, a tab row's gutter, a docs table, a form section's rule,
a grid's cell lines — is not a stroke and keeps its own alpha. Alphas stay on 25, 50 and 75, with 10, 35
and 65 where a step is needed.

### One repo, three packages

`ss-utils` used to be a separate clone next door, and the cost of that was not theoretical: a fix that
belonged in the parser had to be parked here commented out, a utility that qualified for the move was left
behind because the other repo was not on the machine, and `EasingUtils` was written to this repo's rules
while waiting to be copied across by hand. The user's call to merge them, and `ss-utils` came across with
its history rather than as a copy, so `git blame` on a `utils/` file still reaches its original commits —
under its old path, since the files moved.

**Both packages stay separately publishable.** `utils` and `components` each own a `package.json` with its
own version, `files: ["dist"]` and export map, and each is published on its own with `npm publish -w`. The
root `package.json` is `private` and exists only to hold the workspace list, the shared tooling and the
scripts. `playground` is a third workspace, also private, so that its dependencies are declared rather than
borrowed from whatever the library happened to install.

**A release is prepared by `npm run pre-publish`** (`:minor`, `:major`; patch by default), in
`scripts/prePublish.mjs`. It steps all six published packages together, rewrites the `^` ranges between them,
refreshes the lockfile and runs `npm run build`, and stops there: the user asked for no publish commands to be
printed, and the publishing itself is theirs. **The new version counts up from what npm holds, not from the manifest** —
the user's call — so running it twice before publishing lands on the same versions, at the price of needing the
network; a package npm has never seen keeps its manifest version. Three scripts rather than a flag because
`npm run x --minor` is read by npm as its own config, not passed to the script. Every package is stepped, not only
changed ones, since at `0.0.x` a new core already forces new versions of the four framework packages.

**Npm workspaces and nothing else.** No pnpm, no Lerna, no Nx, no Turborepo: npm links each package into
the root `node_modules` by itself, and the build order is one `&&` in one script. A task runner earns its
place when the graph is too big to write down, and three packages in a line is not that.

**The Playground depends on both packages at `"*"`; `components` depends on `ss-utils` at a real range.**
npm links a workspace package only when its `version` satisfies the range asking for it, and otherwise
fetches the published copy from the registry without a word — and at `0.0.x` a caret range is an exact pin,
so every publish used to need the Playground's two ranges bumped by hand or the next install would swap the
link for a stale download. The Playground is private and never published, so its ranges have no job but the
link, and `"*"` always satisfies it. That was the user's call. `components`' `peerDependencies` and
`devDependencies` entries for `ss-utils` stay real, because they ship with the package and tell a consumer
which `ss-utils` it needs; bumping `utils`' version still means bumping those two in the same change.

**The Playground imports the library the way a consumer does**, through `@thewaver/ss-components`, rather
than by reaching into `components/src` along a relative path as it did when both were one tree. The point
is that the export list is now load-bearing: a component missing from `index.ts` breaks the Playground
instead of going unnoticed. The user's call, taken with the cost below on the table.

**There is no alias into `components/src` any more.** `@components/…` existed for one reason: twenty
`SliceAnimationWeights` samples and one `CellAnimationZones` const reached `CellAnimationUtils` as a leaf module
rather than through `index.ts`, because their unit tests run in plain Node and loading the whole library there
calls Solid's `delegateEvents` at module scope and dies without a `window`. Moving the samples into
`components/src` made that an ordinary relative import inside one package, so the alias, its three definition
sites and the DOM-test-environment question all went away together. See _"Samples live in the library"_.

**Everything except the publish build resolves `ss-utils` from source.** The Vite dev server, the Vite
Playground build, both Vitest configs and both `tsconfig.json` path maps point `@thewaver/ss-utils` at
`utils/src`, so editing a helper shows up in the Playground on save with nothing rebuilt. The library's own
Vite build is the exception and deliberately so: `ss-utils` is listed in `EXTERNAL_PACKAGES` there, is never
bundled into `components/dist`, and the emitted `.d.ts` still imports from the package by name. `tsup`'s
declaration pass does read `utils/dist`, which is why `npm run build` builds `utils` first.

**Aligning `utils` with `verbatimModuleSyntax` was the price of that**, and it was checked rather than
assumed. Pointing the components `tsconfig` at `utils/src` puts this repo's stricter compiler options on
that package's source, which raised twelve `TS1484` errors — imports of types that were not marked
`type`. They were marked, `utils/dist` was rebuilt, and the output is byte-identical to the build before
the change, so nothing about the published package moved.

**Vite's root is pinned in each Playground's `vite.config.ts`** (`playground-solid/`, `playground-react/`). `vite preview` is started from the repo root by
the Playwright config, and without an explicit root Vite takes the working directory rather than the config
file's folder, which sends it looking for `dist` at the repo root rather than the Playground's. `root` is set from
`import.meta.url` so the config means the same thing wherever it is invoked from.

**`conventions.md`, `backlog.md` and `brief.md` moved to the repo root**, beside `CLAUDE.md`. They were in
`src/Lib` when that was the only tree with anything to say; they now describe three packages and a test
suite, so sitting inside one of them would be wrong.

### Layering

`Abstracts/` renders no DOM (namespaced utils, hook-like factories). `Essentials/` renders DOM.
`Primitives/` also renders DOM but holds only the shared bodies other components are built out of, which
are not meaningful on their own. `Composites/` combines Essentials. `Essentials/Input/` groups the controls
carrying a value the user edits — `Checkbox`, `Toggle`, `Radio`, `RadioGroup`, `TextInput`, `Label` — by what they
are for rather than what they are built from, so `Button`, which has no value, sits in `Essentials/Buttons/`; the
shared bodies they are built from (`BinarySwitch`, `TextField`, `InteractionWrapper`) are in `Primitives/`. The other
purpose groups are listed under _"A group is a folder named for what its members are for"_ below. `components/src/index.ts` enumerates every export path individually — not a
barrel. **Its blocks run in order of what is built on what** — `Abstracts`, `Primitives`, `Essentials`,
`Exotics`, `Composites`, then `Samples` and `Utils` — with the paths inside a block still sorted, and a
`Generators` block straight after `Abstracts`. The
user's call, taking structural precedence over the alphabetical block order it used to have. It is also the
order the stylesheet is emitted in, so a foundational sheet now lands before the things that override it.

**Which layer a unit belongs to is settled by imagining its Playground page.** The user's test: suppose a
page had to be built for component X — does X render and have a use by itself, or would the page need
another of the library's components, or something local, that renders X **inside** it? The direction is the
load-bearing half. A `FormField` page needs a control in it, but the control does not use the field, so
`FormField` is an `Essential`; a `Barrel` page needs something to move the angle, and that something renders
the barrel, so `Barrel` is a `Primitive`. The test also reads off evidence rather than opinion, since every
page that exists is a verdict somebody already reached. **The test it replaced was _is anything built out of
it_, and that one over-catches**: `Calendar`, `Clock`, `Collapsible`, `ColorArea`, `DateInput`, `DatePicker`,
`Menu`, `Modal`, `Range`, `RangeCalendar`, `Select`, `TimeInput`, `TimePicker` and `Tooltip` are all rendered
inside another component and none of them is a body.

**Where the page test leaves a unit borderline, the tiebreaker is whether the component knows what it is.**
`Popover` is told whether it is a listbox, a menu or a dialog; `BinarySwitch` whether it is a checkbox or a
radio; `TextField` whether it is an input or a textarea; `Barrel` is told what to call a face, and then face
by face what its label is and whether a screen reader should be shown it. In every case the consumer supplies
the component's own accessible identity, which is the mark of a body rather than a finished control.
`Modal`'s `dialog`/`alertdialog` is not the same hole — it knows it is a dialog and is asking how urgent, and
`ButtonType` is form behavior rather than identity. This is what keeps `Barrel` out of `Essentials`, since a
barrel with a slider beside it would scrape through the page test on its own.

**`Popover` is a `Primitive` on both tests, and it was the only `Essential` with no Playground entry at all.**
Six controls render one inside — `ColorInput`, `DatePicker`, `DateRangePicker`, `Menu`, `Select` and
`TimePicker` — and its props are an assembly kit: the consumer owns the open state and the anchor element,
declares which of three widgets it is impersonating, and supplies a render function handed the transition's
visibility target and duration to wire the animation. It reads the viewport context, which used to be an
upward reach into `Exotics` and no longer is — see _"The viewport split in two"_.

**`PlacementBox` and `PlacementItem` are a folder each under `Primitives/`, and `Abstracts/Placement` keeps
the arithmetic.** Both carry `role="presentation"`, which is a component saying in its own markup that it is
nothing; the shape of the arrangement arrives as a layout function from outside and the items arrive from
outside. A folder each was chosen over one `Primitives/Placement/` folder because `Abstracts/Placement` still
exists and two folders of one name in different layers is the confusion a tab read out of context cannot
resolve, and over a `Placement/` family folder because two components never used apart do not need the extra
level. The cost is that the one stylesheet became two, the rule reaching into an item's children going with
the item.

**With those gone, `Abstracts/` renders no structural DOM again.** What it still produces is the contents of
an SVG `<defs>` block from `Glass`, which paints nothing and take no space until
something references them by id, and `LiveAnnouncer`'s live region, which is built in JavaScript and attached
to the body rather than placed by a consumer. Neither is a component anybody renders.

**`Primitive` is a role, not a rank.** The user's framing, and it corrects how the layer had been described
here: an engine is a primitive of a car and is still far more complex than a bicycle, which is a primitive of
nothing. So nothing in `Primitives/` is claimed to be simpler, smaller or more foundational than what sits
above it — `Popover` is more machinery than most of `Essentials` and belongs where it is only because nothing
ever ships one alone. **This is what the page test measures**, which is why it asks whether something is a
part and never asks how big it is.

**Being a part constrains what a unit is, not what it may reach for.** A primitive may render a finished
component, the way an engine uses a bought-in sensor that is also sold on its own, so `InteractionWrapper`
rendering `Tooltip` is not a fault and is not an inversion. What the layers still forbid is a cycle: an
`Essential` built out of a `Primitive` built out of that same `Essential`. **No unit may take part in an
import cycle**, and the graph is walkable from `components/src` to check it.

**`Primitives/` was split out of `Essentials/`, and `Fundamentals/` was renamed to make room for it.**
Three components render DOM but mean nothing on their own: `BinarySwitch` is the shared body of `Checkbox`,
`Radio` and `Toggle`; `TextField` is the shared body of `TextInput`, `TextArea`, `NumberInput`,
`CurrencyInput`, `DateInput` and `TimeInput`; `InteractionWrapper` sits inside twenty-seven other units.
Two of the three were already half-private — only `BinarySwitch.types` and `TextField.types` ship — so the
folder records a split that `index.ts` had already made. Primitives were at first left out of the Uses and
Used by lists, as names a reader could do nothing with; they now have pages and a group of their own in both
lists — see _"Primitives have a menu section, and a page with no examples has no Examples tab"_.

**The rename was the price of the name.** `Primitives` beside `Fundamentals` says nothing about which sits
under which — both are claims about level — so the other layer had to be named by kind instead. `Essentials`
against `Exotics` is the ones you need against the ones you might want, and it makes no claim to be the
bottom of the stack, which leaves `Primitives` underneath it uncontested.

**`CornerHighlight` is an `Exotic` rather than an `Essential`.** Nothing in the library uses it — the five
Playground pages that draw it are painters of the Playground's own — so the shared-body test that sent the
other three to `Primitives` does not catch it. It renders DOM and it is public, which rules out `Abstracts`
too. What it is, is a decoration with a look of its own, which is what `Exotics` holds. The user's call, and
it took a page with it.

**It was `Corners` until `CornerPin` arrived.** The user renamed it to `CornerHighlight` once the two sat side by side
in `Exotics`: a bare `Corners` read as the general case of anything to do with corners, and the new name says what it
draws them for. Its props, styles and Playground page took the new name with it; `QuadCorner` belongs to neither and
lives in `Abstracts/QuadWarp`.

**`AudioSwitcher` renders nothing and is still an `Essential`.** It returns null — not a wrapper, not an
empty box, no elements at all — so it fails the page test twice over: there is nothing to look at, and the
track buttons and play control on its page are the page's own, which is the "something local that renders it
inside" case. It is not an `Abstract` either, since those are namespaces and factories. The user's ruling is
that it is a component by any other name — no DOM, but a lifecycle, state, props and everything else a
component has — and that the taxonomy does not need a fourth word for it. **Recorded so the question is not
reopened by the next pass over the layers**, which will find it the same way this one did.

**`AudioSwitcher` plays every source it is handed except the first, which waits to be asked.** Handing it a
source has always meant "play this", and that is wanted — a switch of track should sound without a second
instruction. The one that arrives at mount is the exception, because nobody has asked for anything yet: it
starts a sound on arrival, which a browser then refuses and warns about, and where autoplay is permitted it
simply plays uninvited. `shouldAutoPlayOnMount` is the exception's name, and it is optional and falsey by
default, so silence on arrival is what a consumer gets without saying anything. An explicit playback signal
still wins: a switcher told it is playing plays whatever it is first handed.

**`should*` is a prefix this library already uses**, on `shouldMakeUnique` and `shouldNormalize` in
`Samples` and on `shouldPadChildren` and `shouldClipChildren` in the Playground. Recorded because a review of
the prefix table in `conventions.md` suggested otherwise and was wrong: the table covers reactive data,
factories, events, JSX producers and signal pairs, and says nothing about booleans, which do not all take
`is*` or `has*`.

**`AudioSwitcher` has a page because the demonstration is audible rather than visible.** It renders nothing —
the track buttons, the play control and the start-over button on its page are the page's own — and what there
is to experience is the crossfade between two ten-second loops, which no amount of markup would convey. The
two loops sit beside the knight images in `playground/src/App`, supplied by the user.

**A page that needs a picture of the knight uses `knight_profile.webp`, not `knight.webp`.** Stated by the user,
after the Lens page was built on `knight.webp`: that one has a transparent background and is kept for the specific
places that want the figure cut out, so as a general photo it shows the page through it. `knight_profile.webp` is
the full picture with its own background, and is the default.

**`AudioSwitcher`'s playback signal reports what is true rather than only what it was told.** It used to be
written by the consumer and never by the component, so a switcher that started playing on its own — which it
does the moment it is given a source — left the signal saying stopped, and any control painted from it said
"Play" while sound was coming out. Pressing it then did nothing, because the effect saw an element already
playing. Now the component writes `true` when a `play()` actually resolves for the element that is current,
and `false` when the browser refuses one. The signal is the component's account of itself, so a control
painted from it is right under either autoplay policy.

**`FormSection` went the same way as `FormField`, for the same reasons.** Nothing in the library renders one
either, it is exported whole, and it had something no page showed: it opens a form context of its own while
registering with the one around it, so fields report to their section and a form hears one answer per section
rather than one per field — and sections nest, so that verdict can travel up more than one level. The Form
page's `Sections` example moved onto it, since that example's subject was the section rather than the form.

**`FormField` is not a `Primitive`, and the test that settled it was whether anything extends it.** Nothing
does: no component in `components/src` renders a `<FormField>`, and the seven that looked as though they did
are importing `FormField.utils` and its context. What it offers is its own — the frame round a control the
consumer supplies, the message id handed down so the control inside points `aria-describedby` at it, and the
registration that lets a `Form` know one of its fields is in error. It is also exported whole, where
`BinarySwitch` and `TextField` ship only their types. So it sits beside `Label` and earned a page instead of
a folder move.

**A family is a folder, in the library and in the Playground alike.** `Carousels`, `Wheels`, `Mosaics`,
`Accordions` and `Spotlights` each hold their members side by side rather than one folder per component at the layer's top
level, and `playground/src/App/Pages` mirrors that. The user's call, and the reason is that the members were
sharing a page: splitting them into a page each without a folder would have scattered constants and a
ten-knob panel across sibling directories with nothing saying they belonged together.

**Four bases went to `Primitives` with the first three.** `Carousel`, `Wheel`, `Mosaic` and `Spotlight`
turned out to be exactly the `BinarySwitch` shape — unexported shells with presets built on them, shipping
only their types and utils — so `Carousels`, `Wheels`, `Mosaics` and `Spotlights` hold only the presets, and
the shells sit beside `BinarySwitch`, `TextField` and `InteractionWrapper`. `Accordions` is the odd one out and keeps both its
members, because `Accordion` composes `Collapsible` rather than extending it and both are exported whole.

**A group is a folder named for what its members are for, and it is not a family.** `Input` was the first;
the user chose the rest, member by member:

- `Essentials/Buttons`: `Button`, `SlideButton`.
- `Essentials/Overlays`: `Modal`, `Drawer`, `Tooltip`, `HoverCard`, `Toasts`, the `Spotlights` family whole,
  and `Sidebar`.
- `Essentials/MediaSwitchers`: `AudioSwitcher`, `ImageSwitcher`.
- `Exotics/Particles`: `ParticleDissolve`, `ParticleField`, `ParticleSpawner`.
- `Exotics/Charts`: `Treemap`, `Sunburst`, `Icicle`, `CirclePacking`.
- `Exotics/Diagrams`: `Bracket`, `PatchBoard`, `Timeline`.
- `Exotics/Perspective`: `FlipCard`, `Die`, `Cuboid`.
- `Exotics/Animations`: `CellAnimation`, `ScanlineAnimation`, `RGBAnimation`.
- `Exotics/Text`: `ScrambleText`, `Typewriter`, `Odometer`, `RichText`.
- `Exotics/Arrangements`: `Formation`, `Staircase`, `Satellite`.

What separates a group from a family: a family's members share a page and a base, so
`playground/src/App/Pages` mirrors the folder. A group's members have a page each, so the pages stay flat
exactly as `Input`'s do. Only the left-hand nav mirrors the group, in all four apps. Routes are built from
the page's own name, so no URL changed. A family can sit inside a group, the way `Spotlights` sits in
`Overlays`, and the nav nests one level deeper for it.

The reasoning behind each name and member list:

- **`Charts`, not `Data`.** `Table` and `Tree` show data too, and a folder called `Data` would claim them
  while holding neither. All four `Charts` members size an item by its value.
- **`Bracket` is a diagram, not a chart.** It draws a tree like the four charts do, but it places nodes by
  how they connect rather than by how large they are, which is what `PatchBoard` and `Timeline` share.
- **`Text` takes `RichText`.** The user asked for a name wide enough to hold it beside the three animated
  ones. Others could take `Text` for a component name, but no more than `Input`, and `Input` has caused no
  confusion.
- **`MediaSwitchers` over `Media`.** A bare `Switchers` could be read as a toggle. `Media` would leave room
  for a later player, but the user chose the specific name, because widening a group later costs almost
  nothing.
- **`Sidebar` sits in `Overlays`.** It never comes and goes the way the rest do, and when it pushes content
  aside it is plain layout. It went in anyway, because it can grow over the content and anyone looking for
  it looks beside `Drawer`.
- **`Perspective` names a technique, not a purpose.** It is the user's own word for the three. `Volumes`
  would read as loudness next to `MediaSwitchers`, and `Solids` would read as SolidJS.

**Left alone for now, by the user's choice.** The proposed `Navigation` and `Layout` groups were not taken: a
menu is not necessarily navigation, and `EdgeFader` is not quite layout. A `Boards` group (`TileBoard`,
`SortableGrid`) was not taken either.

**A layer's name must be a category word that could never name a component.** Stated by the user, against
`Staples`, which was the front-runner until they pointed out that a staple is an object and a component
called `Staple` is arguable. `Staples/Staple` reads as a mistake whether or not it is one, and the
dependency scanner takes unit names straight from folder names, so it would sit in the graph as a thing
named after the layer holding it. Every other layer already passes the test — nobody will build an
`Abstract`, a `Composite`, an `Exotic`, an `Essential`, a `Primitive`, a `Sample` or a `Util`.

**`Utils/typeUtils.ts` holds type transformers and nothing else.** Stated by the user: it is for things in
the shape of `Omit`, `Exclude` and `Pick` — generics that take a type and give back another one. Everything in
it qualifies (`MaybeAccessor`, `AccessorProps` and the three predicates behind them), as does `ss-utils`'
own `TypeScript/typeUtils.ts`, so nothing had to move. **Recorded because the next lone type has to land
somewhere else**: a union naming domain vocabulary is not a transformer, and putting one there would make the
file a miscellany rather than a category.

**`Abstracts/Anim` is gone, and `AnimDirection` with it.** One union, `"in" | "out"`. `Abstracts/` is things
that render no DOM but do something — namespaced utils and hook-like factories — and a lone type is neither, so
the folder was a home of convenience. Its consumers did mean the same thing by it, which was the argument for
keeping it shared somewhere; the user's call went the other way, and each consumer names its own —
`AudioSwitcher` holds a module-private `FadeDirection`. **Naming it rather than repeating a bare union is what
keeps the cost at zero**: where a consumer's handler needs the type, the component exports it under its own
name, which was the only thing the shared version was buying.

**An `Abstract` is named for the thing that does the work, not for the activity.** The user's call, and a
breaking change taken deliberately while the library has one consumer. `Dismiss`, `Navigation` and `Rotation`
are `Dismisser`, `Navigator` and `Rotator` — folder, files, namespaces and the types hanging off them, so
`DismissStack` is `Dismisser`, `NavigationGrid` is `NavigatorGrid` and `Rotation.createRotation` is
`RotatorUtils.createRotator`. Renaming the type family too is what keeps a folder readable: a `DismissReason`
sitting beside a `Dismisser` reads as two things rather than one, and the rule is worth more than the
sentence that one type name loses.

**The last two outliers took a suffix, and one of them turned out to deserve it.** `FocusUtils` is
`FocusManager`: it holds a module-level restore depth, decides whether a restore is in progress, traps focus
in a subtree and moves it on mount — state plus policy, which is an agent rather than a bag of functions, and
"focus manager" is the term the rest of the field already uses. The earlier verdict that it was a collection
was made without opening the file.

**What that argument no longer decides is the suffix.** Both namespaces are `FocusManagerUtils` and
`InteractionTrackerUtils` now, in `.utils.ts` files, because `Utils` marks a namespace with no type of its own
name rather than a claim that the thing inside is stateless — see _"One namespace per folder"_ in
`conventions.md`. The subjects keep the names argued for here; only the suffix came back.

**`InteractionUtils` is `InteractionTracker`, and the arithmetic that made the name a lie went to
`ss-utils`.** Most of it tracks — `trackHold`, `trackDrag`, `trackAxialSwipe`, `trackPageHidden`, and
`wrapElement`, which attaches listeners to report hover, press and focus flags. The four `computeSwipe*`
functions did not, so `GestureUtils` in `utils/src/Abstracts/gesture.ts` has them, along with `SwipeAxis` and
`SwipeDirection`. **The name is `Gesture` rather than `Swipe` on the user's call**: a package this small
should not gain a file per gesture, and pinch and drag arithmetic would otherwise each arrive asking for one.
`InteractionDragRatio` did not travel — the moved signatures take `Point2d`, which `ss-utils` already owns and
which that type was structurally identical to.

**The type family stayed on `Interaction`.** Unlike `Dismiss` → `Dismisser`, the subject noun here _adds_ a
word, so following the family through would have produced `InteractionTrackerSwipeDirection`. The line taken
instead: a flag or a reason belongs to the interaction, not to the thing watching it, so `InteractionFlags`,
`InteractionDragRatio` and `InteractionDragEndReason` keep their names. Recorded because it is a deliberate
exception to the rule directly above it, not an oversight.

**An acronym is not a subject either, so `FPS` went too.** It is `FrameRateMonitor`, and its factory is
`create` rather than `createMonitor`, which would have said monitor twice. The user's call between that and
`FrameCounter`: nothing the thing returns is a count — `{ current, average }` are both rates — so counting is
the mechanism rather than the subject, and `create` names what the code already called its own product. The
acronym left the signature with it: `getFPS` is `getFrameRate`, since keeping it would have left the thing
the rename was removing sitting in the return value. The Playground's on-screen label still reads `FPS`,
which is a display string and not an API.

**It briefly stopped being a `.utils.ts`, and that half was later reversed.** The argument at the time was
that `FPSUtils.createMonitor` returns reactive state, which a bag of functions does not, so the file became
`FrameRateMonitor/FrameRateMonitor.ts`. That reading of the suffix no longer holds — see _"One namespace per
folder"_ in `conventions.md`, where `Utils` marks a namespace with no type of its own name rather than a
promise of purity — so the file is `FrameRateMonitor/FrameRateMonitor.utils.ts` and the namespace is
`FrameRateMonitorUtils`. **The renaming of the subject stands**; only the file suffix moved back.

**The rule reaches the abstract, not the components that use it.** A `Carousel` still has `getIsRotating`, and its
controller's `getIsPlaying` and `setIsPlaying`, because those are the carousel's own vocabulary for what
it does rather than references to the abstract. `RotationUtils` in `ss-utils` keeps its name for the same
reason from the other side: that package names a namespace `<Subject>Utils` and the subject there is the
arithmetic, not an agent.

**`Composites/` ships; `BinarySwitch` does not.** The composites were held back on the argument that a
composite demonstrates how Essentials combine rather than owning a contract, so shipping one freezes a
composition the consumer is better off writing, and that `Surface` being reachable from the Playground's
source was its whole audience. **The user reversed it**, so `Surface` and `SurfaceProps` are enumerated in
`index.ts` like anything else. What has not changed is the inside: `SurfaceSVG` and `SurfaceDiv` stay
unexported, because the wiring a composite assembles is not part of what it offers. `BinarySwitch` is still
internal because `Checkbox`, `Toggle` and `Radio` are its presets; only `BinarySwitch.types` ships. Stated
because a missing export reads as an oversight — it has been reported as a bug once.

### Commands

```bash
npm start # dev server for the Playground
npm run build # utils first, then the components library: vite lib build + tsup .d.ts emit
npm run build:playground # all four Playgrounds plus the landing page, into dist/
npm run build:playground:solid # one Playground alone; also :react, :vue, :svelte
npm run build:all # the library, then build:playground
npm test # vitest in all three packages
npm run verify:dom # playwright: build the playground, then drive it in a real browser
npm run verify:dom:webkit # the same specs in Safari's engine, Solid Playground only, run only when asked
npm run update:readme # regenerate the root README from the About page's text
npm run format # prettier, 4 spaces, 120 cols, import sorting
npm run typecheck -w components # also -w utils, -w playground
```

Every script above is run from the repo root. A package's own scripts are reachable with `-w`, as in
`npm run dev -w components`, which is the watch build for anyone consuming `components/dist` directly.

### The root README is generated from the About page's text

The user's condition for a root README was that it stays in step with the Playground's About page, so neither
is written by hand twice. The wording both share — what the library is, the headless paragraph, the philosophy list,
how a component works — lives as plain strings in `playground/src/App/Pages/AboutPage/AboutPage.const.ts`.
`AboutPageUtils` builds the page from it, and `playground/scripts/readme.mjs` (`npm run update:readme`) writes
`README.md` from it, with a warning atop saying so. The package table, the site link and the browser-only line are
the script's own, since the About page has no equivalent.

**Why a data file and not the page's own utilities.** `AboutPage.utils.ts` imports shiki and loads languages the
moment it is read, which a plain Node script cannot do. The data file imports nothing but a type, so Node loads it
directly with `--experimental-strip-types` (Node 22), no bundler involved — which is why it must stay free of
anything but strings, links and `import type`. The script is not run by the hook or the build: an edit to the
shared wording is followed by running it by hand, as `update:library-tree` is.

### Formatting is applied on commit, by a hook

`husky` owns a `pre-commit` hook at `.husky/pre-commit` that runs Prettier over the files a commit is about to
carry and stages the result, so the house format is applied at the moment it matters instead of depending on
anybody remembering `npm run format`. The root `prepare` script is `husky`, and npm runs `prepare` after every
install, so a fresh clone has the hook working after `npm install` with no setup step — `prepare` is what
points git's `core.hooksPath` at `.husky/_`. The package is current and maintained; nothing has superseded it.

**The hook formats the whole tree and stages only what was staged.** It runs
`prettier --write --ignore-unknown .`, then `git add`s the list from `git diff --cached --name-only --diff-filter=ACMR`
back — so every file ends up formatted, and only the commit's own files are pulled into it. The first version
formatted the staged list alone, to keep a commit from touching unrelated working-copy files; it broke on Windows,
where `npx` goes through `cmd.exe` and its 8191-character command line, once a commit carried a few hundred paths.
The user's call was the whole tree: it is fast enough, and the case it risks — reformatting someone's unstaged
work in progress — does not arise, because the user never commits while another worker is active. The filter
drops deletions, which have no file left to `git add`. `--ignore-unknown` lets a lockfile, image or `.gitignore`
pass untouched, and Prettier reading `.gitignore` on its own account keeps `node_modules`, build output,
`external/` and `.scratch/` out of it without a second list. The `git add` list is passed NUL-separated and in
batches under that command-line limit (`xargs -s 7000`), so a path with a space survives and a large commit does
not fail.

**A file staged in part is the cost.** Where a file has some changes staged and others not, the closing
`git add` stages the whole file and the unstaged half rides into the commit. Avoiding that needs a second
package — `lint-staged`, which stashes the unstaged half for the duration of the hook — and the hook is four
lines without it, so it stays as it is. Anyone splitting a file across two commits should format it themselves
first.

### TypeScript stays on 6 until 7.1

Every other dependency in the repo tracks its latest release; TypeScript is held at 6 deliberately, and the
user's condition for moving is the 7.1 release rather than 7.0. So an update pass brings everything else
forward and leaves `typescript` alone, and `npm outdated` reporting it as behind is the expected state rather
than something to fix.

### `external/` is a drop-zone, and every tool is told to leave it alone

The user's convention, from the second migration of code written elsewhere. Code to be brought in is dropped
in `external/` at the repo root, read, ported, and then deleted — but **the folder itself stays**, so the next
migration has somewhere to land.

**It is outside every tool, and the entry in `.gitignore` is what does most of the work.** Prettier 3 reads
`.gitignore` as well as `.prettierignore`, so one rule covers formatting and version control together and there
is no second list to keep in step — worth knowing, because `npm run format` is `prettier --write .` and would
otherwise reformat and re-sort the imports of code that has not been read yet. `tsconfig.json` and
`vitest.config.ts` name it as well: both already worked from a whitelist that could not reach it, and the
explicit exclusion is there so somebody looking for the rule finds it where they look.

**`external/*` with `!external/.gitkeep`**, rather than ignoring the folder, because git tracks files and not
directories: a plain `external/` entry would mean the folder does not exist in a fresh clone.

**The contents are nobody's contract.** They are a foreign framework's code, kept only long enough to read, so
none of the rules about `components/src` apply to them — not the comment ban, not the house style, not the export list.
Nothing in `src` may import from there.

### A file in transit sits commented out, rather than excluded in config

`components/src/JSXTextParser.utils.ts` is not this library's code and is not compiled. It is a copy of `ss-utils`'
parser carrying a fix that has to be applied in that repo, parked here so it survives a change of machine, and
**every line of it is commented out** — the user's instruction, and the reason is that the alternative leaves
litter: a `tsconfig.json` exclusion outlives the file it was written for, and the next person to read the config
finds a rule pointing at nothing. A commented file needs no rule at all, and one editor keystroke over a
select-all restores it.

**Line comments, not a block comment**, because the file carries `/** … */` documentation of its own and the
first `*/` inside would close the wrapper early.

**It is committed rather than ignored**, unlike `external/`, because the whole point is that it travels.

**Nothing is in transit now, and for `ss-utils` nothing can be.** The parser copy this was written for is
gone: the user applied its fix in `ss-utils` itself, so `utils/src/Web/JSX/Text/Parser/JSXTextParser.utils.ts`
is the corrected version, and a break the author wrote pushes unconditionally while only structural breaks
collapse. `ss-utils` sharing this repo means a fix that belongs to it is now made in place rather than
parked. The rule above stands for the next foreign file that needs somewhere to wait.

### Breaking the API is free until 0.1.0

Stated by the user, for both published packages: while `@thewaver/ss-components` or `@thewaver/ss-utils`
is on a `0.0.x` version, a change that breaks its consumers — a removed prop, a renamed export, a slot
replaced by a builtin — needs no migration path, no deprecation period and no argument about compatibility.
Take the better API and move on. The rule ends for each package when it reaches `0.1.0`, and the user has
said that is getting close, so a breaking change that
is already known to be wanted is cheaper now than it will be later. (The support contract below is about
which browsers the library runs in, not about its API.)

### Compatibility arguments cite `components/src` and nothing else

When arguing a modern CSS or JS feature is safe here, **only `components/src` counts** — it is the published
package and the only thing with a support contract, **with one carve-out: `components/src/Samples` does not
count.** It ships from the library now, but it is sample code a consumer copies or ignores rather than
component internals, and it was written to the Playground's old license. `playground/src` is a harness;
citing either is not an argument.

**A use that carries a fallback is not evidence for a use that doesn't.** Relative color syntax
appears 71 times in Samples and twice in `components/src`, both in `Composites/Surface/Surface.css.ts` and
both in vanilla-extract's array-value form — `backgroundColor: [fillColorVar, "rgb(from …)"]` — which
emits the plain variable first, so an engine that does not understand the newer syntax keeps a working
color. That is graceful degradation, not a hard dependency. Check where the feature actually lives and
whether existing uses degrade; if the new code has no fallback, say so.
