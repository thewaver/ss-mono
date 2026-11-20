# Decisions: playground-frame

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The Playground frame has its own command palette

The user's request, so the shortcuts can be tried from any page. `PageAppCommands` is mounted in the frame and owns
`mod+K`; the CommandPalette page's Default example therefore opens from its button only, since two bindings of one
shortcut on one layer warn and only the later fires. Its commands: Go to About (Alt+Shift+H), switch to the next theme
(Alt+Shift+T), expand and collapse every menu folder (Alt+Shift+E, Alt+Shift+C), and a "Go to …" per visible page with
no shortcut. Alt+Shift was chosen on purpose: on a Mac it types a special character, which exercises the register's
physical-key fallback. The page's "Clear the notes" moved to Alt+Shift+X to keep Alt+Shift+C for the frame.

### The Playground is one centered block, no wider than its parts add up to

The user's call, after the Docs table of contents made the old left-aligned page obvious: on a wide window the left menu,
the page and the table of contents are centered together as one block no wider than `PAGE_MAX_WIDTH`. The number is
what the parts add up to at full size — menu, margin, docs, gap, table of contents, margin — so nothing
shrinks at the cap; 1440 was weighed and would have narrowed the docs to 800.

**The dark menu panel still reaches the window's left edge.** The empty space left of the block, half of whatever
the window has beyond the cap, is added to the `Sidebar`'s `collapsedSize` and `expandedSize` and given to the panel as
left padding, so the panel grows into it and the menu's contents sit where the block starts. Painting the space with
a separate element was rejected because the panel's background is a diagonal gradient that a second element cannot
continue seamlessly.

**The menu can only be hidden on a window narrower than the page cap minus the menu**, `LAYOUT.menuHideableBelow`
(1600 − 320 = 1280), the user's rule. Above it the menu is always open and the auto-hide button is drawn but
disabled, the user's call over leaving it out. Below it the button appears, and hiding the menu gives
its width back to the page, which moves across, as the menu always did before the centered block. A first version
kept the menu's space reserved when it hid; the user rejected it, since hiding is meant for narrow screens where
the space is the point. A preference to auto-hide set on a narrow window is kept, and applies again when the window
narrows.

**The cap is a rule on every direct child of the page column**, not on `pageBody`, because the About, Getting
started and Gallery pages render straight into the column without it.

**Every width the layout depends on is stated once, in `Layout.const.ts`, and everything else is derived.** The
user's call, after the first version scattered its numbers: the menu's 320 lived in both the Solid app and the
shared styles, the 1600 cap and the table of contents' hide-point were sums done by hand, and 960 and 720 sat in several
style files. `LAYOUT` holds the base widths — expanded menu, menu padding, the auto-hide button, page margin, content,
reading, table of contents and the gap before it — and computes the rest from them: `menuCollapsedWidth` is the button with
the menu's padding either side, which is all a collapsed menu shows, and `menuHideableBelow`, `pageBodyMaxWidth`,
`pageMaxWidth` and `tableOfContentsMinLayoutWidth` follow from the widths. The button is 32 square, the user's call over the
28 it had, so the grid lands on round numbers; the collapsed menu is 72.

**The styles read CSS variables, not the numbers.** `Layout.css.ts` turns `LAYOUT`'s base widths into variables on
`:root`, and `pageBodyMaxWidth` is a `calc()` over those variables rather than the precomputed number, so a later
rule that overrides one base variable at a screen size — a narrower menu on phones — moves everything derived from it.
The user chose this over plain numbers as the foundation for that. The variables are generated from `LAYOUT`, so the
two cannot drift. **Two things cannot follow a variable**, and both read `LAYOUT` directly: the `Sidebar`'s sizes,
which it takes as numbers, and the container query that hides the table of contents, since a query's condition cannot use a
variable. An override at a screen size has to change those two alongside it.

**The table of contents hides once the docs would be squeezed below the reading width**: `tableOfContentsMinLayoutWidth` is reading
width plus gap plus table of contents. The first version hid it at a hand-picked 900; the rule gives 960.

**The page margin and the menu's side padding belong to the layout, not the theme.** They were
`themeVars.spacing.quad` and `.double`, but the cap and the collapsed width are computed in
code from them, and a theme is free to change its spacing without telling those sums.

### The left menu is one tree, and the categories are its top three branches

Settled on the user's call between three options, once the abstract pages took the menu to ninety-seven
entries: collapsible category sections, a `Tree`, or more and smaller categories each with its own tab list.
The tree won on grouping — `Inputs` and `Date pickers` are things a person looks for, and neither of the
other two could hold them without either leaving `Essentials` forty-two rows long or paying a tab stop per
group.

**The whole menu is now one tab stop rather than one per category**, which is the part that made the choice
easy: the arrangement it replaced cost three stops and the tab-list-per-group alternative would have cost
about eleven. The arrows walk the rows that are visible, `Right` and `Left` open and close a branch, and the
tree's own typeahead jumps to a row by its first letters.

**What went with the tab list.** The `<h2>` per category is now a branch row, so the categories are inside
the widget instead of beside it; `renderFloater` and the `ElementFader` marker are gone, since a tree row
paints its own selected state; and the `Tab` `id` / `panelId` pairing that wrapped the routed page in a
`TabPanel` is gone with it, replaced by a `<main>` landmark and an `<h1>` for the page title, with the menu
in a `<nav>`. **`TabsPage` and the source viewer still demonstrate the panel pairing**, so nothing lost its
only consumer; what the menu stopped being is the standing example.

**Selection is read from the route and never written back.** The value signal handed to the tree is a pair
whose setter does nothing: a leaf carries an `href` and navigates through the router's `A`, the route effect
sets the selected config, and the tree paints from that. This is what neutralises the first gap in
`backlog.md`'s `Tree` item — a press on a branch both selects it and toggles it, so without the dead setter
opening `Overlays` would move the highlight off the page you are reading. The effect also opens the
ancestors of whatever route arrives, so a link followed from a dependency chip reveals its own row.

**Expansion is two signals, and which one the tree sees depends on the search box.** Browsing expands what
the user opened, seeded with the three categories; searching expands every branch that survived the filter,
so a match is never hidden behind a closed group. Handing the tree one signal that switched underneath it
would have made a search discard what was open, and made a toggle during a search stick around afterwards.

**Filtering rebuilds the nodes and keeps the values.** `filterTreeNode` copies a branch when any descendant
matches and drops it otherwise; the copy carries the same `value` object, which is what the tree compares by,
so selection and expansion survive a filter that has rebuilt every node around them. The old rule survives
too: the selected entry stays visible even when it does not match what was typed.

**A branch row carries the number of pages under it**, through the `detail` slot `PageTreeNodeContent`
already had. It doubles as the search readout — `Dates and times 5` becomes `Dates and times 3` when three
of the five match.

**The three category rows are uppercase, and the depth that decides it was already in the render props.**
`TreeNodeRenderProps` has carried `depth` since the component was written — `PageTreeNodeContent` indents
by it — so telling one level from another needed no library change, only a class on the name in the menu's
own painter. It is set there rather than in `PageTreeNodeContent` because that painter is the `Tree` page's
too, and a file tree has no reason to shout its top row.

**The menu was widened from its flat-list width**, at the user's request, because three levels of indent plus a
marker leaves less room for a name like `MediaQueryMonitor` than the flat list needed.

**The theme paints every anchor in the primary color, and the menu now overrides that.** Tree leaves are
anchors; the tab rows they replaced were not painted that way, so every leaf arrived in the accent green and
the selected row was distinguishable only by being bold. A `globalStyle` scoped to the menu's own class puts
anchor color back to `inherit`, which is a Playground fix rather than a theme change — nothing outside the
`<nav>` is touched.

**The menu's options sit behind a cog beside the search field**, the same `PageExampleKnobsButton` an
example uses, holding pages without examples, the viewport anchor and the theme.
**A page picked from the menu opens on the tab the last component page was showing** — the user's rule, which
replaced an "Open pages on" setting. The tab is read off the address of each component page visited and kept
while non-component pages (About, Getting started, Gallery) are shown, starting at Docs before any has been
opened. Only Examples falls back, to Docs, on a page without one; API carries over as API, since every page has
one. **The links are rewritten rather than redirected after arrival**: the tree is built once per view
(`MENU_NODES_BY_VIEW`) and the remembered tab picks which set is shown, so the values stay the same objects and
expansion and selection survive the switch. The dependency links in the page header follow the same tab, since
they open pages too. **The anchor is owned by `App`**, because the `ViewportWrapper` it
sizes wraps the menu; `AppContent` is handed the signal. `none` passes the window's size through unscaled,
`auto` is the screen's height as before, and the numbers are a fixed 16:9 page (1920 by 1080, 2560 by 1440) that the wrapper fits inside the window with empty bars, at the user's request, rather than a height whose width follows the window. None of it is remembered across a
reload, which is how the checkbox behaved before it moved.

**Under `auto` and the fixed sizes, browser zoom does not enlarge the page, and that is intended** — the user's
call, after a review raised it against WCAG 1.4.4 Resize Text. The wrapper fits the page to the window, so zooming
is canceled out and a small window or a phone shrinks the text. `none` is the way out the page offers, and the
user counts that as the answer. Do not raise it as a fault or change the default.

**The menu is always a `Sidebar`, and the arrow in its search row is the whole auto-hide setting.** Off, the
sidebar is held expanded, which is the menu as it always was. On, it shrinks to a strip holding only the arrow
and expands while the pointer rests on it. The sidebar's expanded state is simply auto-hide being off. **One
control, not two**: the first build had a checkbox in the cog for auto-hide and an arrow that pinned the menu
open on top of it, two sources of truth that could disagree. The arrow was made to flip the setting itself, and
since it is always shown — it is also the way back in — the user had the checkbox removed. **It pushes the page
in both, at the user's call** — an overlay was tried first and reverted. The arrow sits first in the search row
rather than inside the part that hides, so it is the same element in both states and keeps focus when pressed
from the keyboard. It is a Playground button of its own (`PageSidebarToggle`) because the library's `Button`
cannot carry `aria-expanded`.

**The tree's scrolling box runs to the menu's edges.** The padding sits on the search row and inside the
scrolling box rather than around both, so the scrollbar is flush with the menu's right edge as it was when the
whole menu scrolled.

**Collapsed, the menu's contents are hidden rather than removed.** The first build unmounted the search, the
cog and the tree on every collapse, so each hover rebuilt a couple of hundred rows mid-animation and the tree
lost its scroll position. They are now `visibility: hidden` while collapsed, which also takes them out of the
tab order and the accessibility tree, the same as removing them did. **They fade rather than pop**, which is
what the phase is handed over for: opacity drops as collapsing begins and returns as expanding begins, over the
sidebar's own duration, and `visibility` only goes once the phase reaches collapsed, so the fade out is seen. **Only the tree scrolls**, not the whole
menu: with the search row inside the scrolling box, a menu collapsed while scrolled down would have scrolled
the arrow out of the strip.

**The menu clips itself; the sidebar does not.** The outer `<nav>` fills the sidebar's width, carries the
gradient and the shadow, and hides what overflows; the box inside it is laid out at the full 320px. That split
is what keeps the shadow — see _"Nothing drawn in a `Sidebar` is clipped"_.

**`auto` reads the screen's height once, when the page loads.** Reading it on every resize looks equivalent
and is not: a test browser reports a screen the size of its window, so the anchor shrank with the window and
`viewport.spec.ts`'s nested-scale check stopped seeing the outer scale change.

**About, Getting started and Gallery stay outside the tree, with a track of their own.** The user's call, over
making them the tree's first entries: outside it they are not filtered by the search, do not scroll with the
components, and keep the extra space that sets them apart, and moving them in would have cost all three.
`PageNavLinkGroup` gives them the same hover look the tree has instead — a highlight floater drawn by
`FloaterSolidUtils` with `renderPageHighlightFloater` and the tree's `TREE_DEFAULTS.floaterTransitionDurationMs`,
following the hovered or keyboard-focused link. The track does not glide across into the tree; the two are
separate on purpose. Their font matches the tree's top level and their color does not, also the user's call. A
link drawn inside the group switches off its own `:hover` background through `hasHoverFloater`, so links outside
one keep theirs. **The group tells each link whether it is the one the floater is on**, through a context, and the
link sets the Skin's hovered state from it, as a tree row does: without it the Skin's hover-with-floater rules
never reached these links, and a selected one kept its selected paint over the floater while a selected tree row gave
it up.

### Every abstract has a menu entry, and a page with no examples is a config entry rather than a file

Asked for by the user: a page for each abstract, description and dependencies only, no examples. The first
build left the four that already had pages — `InteractionTracker`, `PointerTracker`, `SVGFilters`,
`Virtualizer` — with theirs, and the user later closed that gap: **an abstract's entry carries no examples at
all**, with one exception. The pages under `SVGDefs` were an exception while those factories were abstracts; they have
since moved to `Generators`. **`ShapeReveal` is the exception now**, by the user's choice: its page holds the
_Theme Cycle_ example, a button that keeps switching the Playground's theme through the reveal. They took it knowing
it makes `ShapeReveal` the only abstract with examples, rather than putting the button on the `Reveal` page (a
different component) or in the nav bar. An abstract is either visible through the component that consumes it or
reports numbers a page of its own would only print back, and its entry is a line of config.

**`ComponentConfig.component` is optional, and an entry without one has no Examples view.** The alternative
was a directory per abstract each holding a file that returns `null`, plus an import each at the top of
`App.tsx`, which is noise standing in for nothing. `AppContent` already draws the title, the description and
the dependency chips from the config; the page component only ever supplied the examples under them. So an
abstract needs no file, and pruning one is deleting its directory and dropping the `component` field.

**What this buys is not the pages themselves.** `ROUTES_BY_KEY` is built from the same configs, so a
dependency chip is a link when the name has an entry and plain text when it does not. Before this, a page
saying it rests on `Anchor`, `Dismisser` and `FocusManager` printed three dead words; every abstract chip in
the Playground is now a link to the thing it names.

**The `SVG` folder became four entries rather than one.** `SVGFilters` was the only page over a folder that
holds four families, so a component resting on a gradient or a tiling showed a chip reading `SVG` that led
nowhere. `SVGAnimations`, `SVGGradients` and `SVGPatterns` sit beside it under an `SVGDefs` group, now in
the `Generators` section, which
is what _"The `SVGFilters` page is the factory's, and it is filed under `Abstracts`"_ said would happen if the
other three ever arrived. **They are plural to match the page that was already there** — the request named
them in the singular, and the existing name is a rename the user made deliberately, so matching it was the
change that moved nothing.

### Primitives have a menu section, and a page with no examples has no Examples tab

Asked for by the user once the export tables existed: a primitive had exports worth reading and nowhere to read
them. **Each of the twelve folders under `Primitives/` is a config entry** in a `Primitives` section, with a
description and no examples, exactly as an abstract is — the page test in _"Layering"_ says a primitive
cannot be shown alone, so there is nothing to put under Examples. Its description says which components are
built on it and whether it is exported whole or only by its types, since that decides what its Docs view lists.

**A page with no `component` shows Docs only, and its bare address forwards to Docs.** The user
asked for the empty Examples tab to go from abstracts; the rule is written on the config rather than on the
layer, so it holds for any entry without examples, and an SVG defs page without examples — `SVGAnimations` —
has only the one tab as well. The forward replaces the history entry rather than adding one, so the back button does
not return to an address that only forwards again. Every link in the nav still points at the bare address.

**Primitives are a third group in Uses and Used by**, between abstracts and components. The reason they were
kept out was that a chip would lead nowhere; with a page each, that reason is gone.

### The dependency map takes a whole abstract folder as its entry when no file carries the folder's name

The `componentDependencies` plugin finds a component's entry file by looking for the one whose basename
matches its directory — `Anchor/Anchor.ts`, `Barrel/Barrel.tsx` — and walks the imports out from there.
Ten abstracts have no such file: `Carrier` is `CarrierUtils.ts` plus two more, `CheckedState` is a types file
and a utils file, `Dismisser`, `Flattener`, `Navigator`, `Cutout`, `ColorExtractor`, `DateValue`,
`DateTimeValue` and `SVG` are all the same shape. They were absent from the map altogether, which nothing
noticed while no page bore their names.

**An abstract with no same-named file now takes every file in its own folder as an entry**, and the walk
starts from all of them at once. The same-named file still wins where there is one, so nothing that already
had a map entry changed.

**Test files are excluded from the walk entirely.** They were harmless while entries were single named files,
because nothing imports a test — but a folder-wide entry set would have made `CarrierUtils.utils.test.ts` an entry
and counted whatever it imports as a dependency of `Carrier`.

**`Generators` is walked the same way.** A generator folder rarely has a file of its own name —
`SVGFilters/` holds `SVGFilterDefs.factory.tsx` — so it takes every file in the folder as its entry too.

### `usedBy` is the same map read backwards, and the layer of the consumer decides which list it lands in

Asked for by the user: pages already said what they rest on, and should also say what rests on them. The
walk is unchanged — it is the `uses` map inverted once it is complete, so `usedBy` is transitive in exactly
the way `uses` is. A consumer is filed under `Abstracts`, `Primitives` or `Components` by **its own** layer rather than
the layer of the thing it uses, which is why `Rotator` appears under abstracts in `InteractionTracker`'s
list and everything else under components.

**A unit outside the three component layers and `Abstracts` is not a consumer.** `Samples` is walked for
`uses`, because a component reaching sample code really does depend on it, but it is not recorded as a user
of anything: a sample is vocabulary the Playground draws on, not a thing the library is built out of.

**Some lists are long, which is the finding rather than a fault, and it is why both are disclosures.**
`Anchor` is used by fifty-three units, which is what a shared abstract looks like drawn out — and six wrapped
rows of chips above every page's examples is a wall to scroll past on the way to what you came for. Each
section is a `Collapsible`, collapsed on arrival, with `isPanelBuiltOnExpand` so the chips of a list nobody
opens are never built. `LIST_PAGELESS_COMPONENTS` decides whether names with no page of their
own — `Popover`, `Clock`, `MultiSelect`, `DrumCarousel` — appear at all, and it is off, which takes `Anchor`
from fifty-three to thirty-seven and from six wrapped rows to four. The filter is applied once where
`DEPENDENCIES_BY_KEY` is built rather than at each render site, so the summary counts, the group rows and
the section itself all follow from it: a section left with nothing does not appear, and the trigger never
counts a chip it will not show.

**A component with no page is one of two things, and they are answered differently.** A shared body that
means nothing alone belongs in `Primitives/`, where the scanner never names it. Anything else is a component
a consumer can reach for that simply has nowhere to be seen, and the answer there is a page: `Tooltip` was
the first taken that way, on the user's call, and it is why the Playground demonstrates the standalone
component while `e2e/tooltip.spec.ts` stays on the `Button` page, where what is under test is the
`tooltipDefs` route into it.

**The trigger is a chip that stays put, rather than a chip that is replaced by the list.** The suggested
shape was a summary button swapped out for the lists when pressed, with an `x` at the far end to put it
back. Two controls, and both vanish at the moment they are used: pressing the button removes the element
that has focus, so focus falls to the document body, and reaching the `x` afterwards means tabbing through
every chip in both lists — then it too is removed and focus is lost a second time. One control that stays
where it is has neither problem: `aria-expanded` lives on the thing that was pressed, the caret turns, the
list opens underneath, and a second press on the same still-focused button closes it. The `x` is then
redundant rather than rejected — its job is done by the control the reader's hand is already on.

**The summary counts and pluralises, and says nothing when a side is empty.** `2 Abstracts and 1 Component`
on `Anchor`'s `Uses`, `53 Components` on its `Used by`. The button has no `ariaLabel` — `Collapsible` does
not offer one — so its name is that text, read straight after the `USES` or `USED BY` label beside it,
which is the same pairing the eye gets.

**Expansion resets when the page changes.** `PageDependencies` is not remounted between pages, since the
`Show` around it never toggles, so an effect on the page name clears the open sections; without it, opening
`Used by` on one page would silently open it on the next.

**The trigger is pressable across the chip and no further, and getting there needed a rule of the menu's
own.** `Collapsible` puts the trigger and the panel in one column-flex root and paints the trigger
`width: 100%`, so the trigger is as wide as whichever of the two is wider. With a 53-chip panel that is 890
pixels against a 121-pixel chip: the whole line reads as pressable, and — because `isPanelBuiltOnExpand`
keeps the panel once built — it stays that way after the list is closed again. The disclosure is therefore
`sizing="fill"`, so the panel gets the column and the chips wrap where they should, with one `globalStyle`
scoped to the menu's wrapper putting the trigger back to `fit-content`. It keys on `[aria-expanded]`, which
is the disclosure's own contract, rather than on `Collapsible`'s hashed class.

**Whether `sizing="fit-content"` should stop the trigger stretching is a library question, and it is open.**
It is arguably what that value already promises, but changing it would shrink `AccordionPage`'s single-panel
header to the width of its words, and that is a look the user chose.

**A chip that is a link is painted primary, a chip that is only a name is painted white, and before this the
browser's history decided which.** `dependencyName` painted every chip white and the theme paints `a` and
`a:visited` primary — and `a:visited` carries a class and a pseudo-class against the chip's single class, so
it won on specificity while plain `a` lost. A link chip was therefore white until it had been followed and
primary afterwards, which is a color nobody chose, cannot be undone once a link has been visited, and says
something about the reader's history rather than about the page.

**The split is now two classes over one shared chip.** `dependencyName` keeps white for a name with no page
of its own — which is only on screen when `LIST_PAGELESS_COMPONENTS` is on — and `dependencyLink` is primary
in both states — it declares `:visited` explicitly rather than
relying on the theme's rule happening to name the same color. `hsl(165, 100%, 50%)` on the chip's ground
measures 14.1:1, so nothing is given up for it.

**The menu tree does not follow that rule, and the difference is the point.** Every row there is a link, so
painting links differently would say nothing; the accent is spent on the selected row instead. In a
dependency list the chips are a mix, and the accent says which ones go somewhere.

### The Playground's `Abstracts` category

The category exists because `PointerTracker` had nowhere honest to go: `Exotics` is things that render DOM, and
it renders none. The user's call was to keep the category rather than file it wrongly or ship no page at all —
the one Abstract with no component consumer would otherwise be the only thing in the library you cannot look
at.

**Every Abstract has an entry, and none of them carry examples except `ShapeReveal`**; the rule, the exception and
its reasoning are under _"Every abstract has a menu entry, and a page with no examples is a config entry rather
than a file"_. `Anchor` was the first case argued that way and rejected before the rule was general: it is
already everywhere — tooltips, menus, selects and the spotlight all position through it, so a page would be a
fourth showing of a thing three pages already show.

**This is a Playground answer, not a documentation answer.** The user's note, recorded because it changes the
shape of the question later: the site is a showcase today and will likely become documentation, and at that
point every Abstract needs a page whether or not it has anything to demonstrate. What earns examples is a
question about what is worth demonstrating, not about what is worth documenting.

**Also raised by the user and not built: listing, in each component page's description, which Abstracts it
uses.** The objection they raised themselves is maintenance — a hand-written list rots the moment a component
gains an import. Worth knowing before anyone attempts it: the dependency is already in the import graph, and
the Playground already runs a build-time plugin over its own source for the source viewer, so the list is
derivable rather than curated. Nothing has been decided.

### Which Abstracts a page's component uses, derived rather than curated

Asked for by the user, and built only because the maintenance objection they raised themselves turned out to
be answerable: a hand-written list of each component's Abstracts rots the moment a component gains an import,
and nobody will re-check fifty pages after every commit.

**The dependency is already in the import graph, so nothing is typed twice.** A Vite plugin walks
`components/src` at build time, follows relative imports transitively from each component's entry file, and
classifies every file it reaches by the folder that owns it — `Abstracts/<Name>` is an abstract, anything under
`Essentials`, `Composites` or `Exotics` is a component, and anything under `Primitives` is neither, so it is
walked through without ever being named. The result reaches the Playground as a virtual module
and renders under each page's description. In the dev server the plugin watches `components/src` and reloads
the module, so the list is right without a restart.

**Transitive rather than direct, deliberately.** `Wheel` lists `Barrel`, `InteractionTracker`, `LiveAnnouncer`,
`Rotator` and `SignalMirror` — `Rotator` is imported by the wheel itself, `LiveAnnouncer` through the shell it
wraps. Direct imports would have answered "which files does this one file name", which is a fact about the code
layout; the reader's question is which abstracts are running when this component runs, and that is the
transitive set.

**Type-only imports do not count.** `import type` names a type and runs nothing, so counting it would list an
abstract a component merely borrows a shape from.

**Internal components are listed alongside exported ones.** `Select` names `FormField`, whose context it
reads without a consumer ever putting one there. The alternative — filtering to what `index.ts` exports —
would have made the list a partial truth for the sake of tidiness, and the list is describing what runs, not
what can be bought. Primitives were once left out on the grounds that a reader had nowhere to go and look at
one; that ended when they got pages, and they are now a group of their own between abstracts and components.

**The nav marker says whether there is anything to look at, and its weight follows what is there.** A branch
keeps the heaviest mark, ▶, because it holds the most; a leaf with examples takes a •; and a leaf carrying
only a description takes the lightest, · — every one of them an `Abstract`. The user's call, chosen over fading the row to 75%: opacity already means disabled on
that row, and one signal carrying two meanings is worse than a glyph nobody guesses but everybody learns
once. The fade was measured before it was rejected rather than after — 9.6:1 against the dark end of the
nav's gradient and 8.4:1 against the light end, so contrast was never the objection.

**The glyphs took two passes, and the second one is the rule.** The first pair was a filled · against a hollow
◦, which is the wrong axis at 12px and half opacity — the hole is a pixel or two wide. The second was a dot
against a dash, legible but pointing the wrong way: the dash is the wider mark and it was sitting on the page
with less to see. What settled it is that weight should follow substance, so the mark gets heavier as there is
more behind it. Size separates at this scale where fill does not, and it did not cost the nav any weight on
the 87 rows that have examples.

**The nav can be asked to drop the pages with nothing to look at.** A checkbox under the search field,
checked on arrival so nothing changes for somebody who does not want it, and unchecking it takes the 26
description-only entries out of the tree. Two exceptions keep it from hiding what is being looked for: the
page currently open always stays, so the tree never loses its own selection, and a name matching the search
stays whatever the checkbox says, because a search that quietly refuses to find something is worse than a
long list. Both fall out of one predicate over the existing filter, so the branch pruning that empties a
category with nothing left in it was already there.

**A name links to its page when one exists.** The matching is case-insensitive, because the Playground's
display names and the folder names are free to disagree in case, and a
name with no page renders as plain text rather than a dead link.

### The Appearance page: one row per Theme and per Skin, picked like a radio

`/appearance` sits under Gallery in the nav and holds two radio groups, Theme
above Skin. **A Theme row is a grid of swatches** — the user's layout: a column per color family (every family in
`themeVars.color` with all four shades, so `outline` is left out), a line per shade, in the order
`THEME_SWATCH_FAMILIES` and `THEME_SWATCH_SHADES` give. The row carries its theme's class itself, so its frame,
radio and swatches all resolve that theme's variables, and picking it calls `revealTheme` from the row, as the nav's
Theme field does. Everything below about samples being a picture holds for the swatches too.

Each Skin row draws the same samples in its own Skin (see _"A Skin's rules stop
at `skinBoundary`"_) and picking a row applies that Skin to the whole Playground through `revealSkin`, the circle
growing from the row; the nav's Skin field reads the same signal, so the two never disagree. **The samples are a
picture, not controls** — the user's option A over live samples with a pick button per row. Each row is a `Radio`
in a `RadioGroup`, the samples `inert` and `aria-hidden="true"`: a radio's contents are presentational (WAI-ARIA
1.2, "children presentational"), so live controls inside it would be flattened for a screen reader, and a click on
one would also pick the row. The cost is that hover and press are not shown; disabled, error, checked and pressed
are drawn as fixed states instead. The nav previews made the same call.

**Every part a Skin paints is shown** — the user's option C, laid out at their direction: a wrapping row of
columns, each an example box on the Skin's own page background, each a grid of states for a control that has
them; a control with no states to split (Surface, Tabs, Accordion) takes its column whole. **The columns are a
grid of equal tracks** (`SKIN_COLUMN_MIN_WIDTH`, the user's number), each box filling its cell, and a group too wide
for one track spans two (`skinWideColumn`: Input and Tags — the user's picks). **An empty cell left where
a wide group wraps is accepted**, the user's call over letting the grid fill holes out of order; the groups are
ordered by hand to keep holes few, Tags always straight after Input. Bars stack one per line,
since two side by side overlap at that width. **Nothing that opens a popup is sampled**, since a portalled popup
leaves the row's Skin.

**A row is the page Skin's `pageContainer`, filled with the row Skin's page background, title included** — the
user's call, after a full `surface` holding a page background read as a box inside a box. So the radio dot and name
are drawn in the row's Skin too, and what marks the picked row differs from row to row; the frame clips its
contents so the background follows its corners, which leaves the focus ring alone, since the radio input that
draws it sits outside the clipped painter.

**Porting: where the four differ.** The row's id comes from `computeSkinRowId` (and a Theme row's from `computeThemeRowId`) in the shared `AppearancePage.const.ts`,
since the row and the page's reveal origin both need it and Vue's two live in different files. Vue and Svelte split
the row, the samples and each sample helper into files of their own; the state grid and bar stack, which are a bare
`div` each, are written inline there. **Vue's sample helpers default every boolean prop to `undefined`**
(`withDefaults`), because Vue turns a missing boolean prop into `false`, and `Button` handed `isPressed: false`
writes `aria-pressed="false"` — a toggle button where Solid draws a plain one. Svelte seeds each sample's own state
from its props inside `untrack`, so the seed is read once, as Solid's `createSignal(props.x)` does. The spec is
`e2e/appearancePage.spec.ts`, apart from `skins.spec.ts`, which tests the Skin machinery rather than this page.

### The gallery page: every page's first example, live, on one page

Built in Solid first and ported once the user had tried it. `/gallery` sits under About in the nav and draws one tile per page that has
examples, grouped under the menu's own categories, each with the one-line description its `MenuBranchConfig` carries.
A tile is the page's name as a link and its first example, live and interactive. **The name carries its menu
trail below the category** — `Input / Select`, not `Select` — because tiles run in menu order, which is alphabetical
only within a branch, and without the branch the order reads as broken. Nothing pauses yet: the user deferred
standing still until hovered to after this first pass.

**A page draws its own preview, told by `PreviewContextProvider`.** The gallery renders the whole page component, so
its knob signals start as they would on the page, and the page components that read `useIsPreview()` strip it down:
`PageExamples` draws only its first item's demo, bare, and `PagePropsPanel`, `PagePropsGroups` and `PagePropsDivider`
draw nothing. Nothing is written per page, so the order of a page's examples decides its tile. `PREVIEW_EXCLUDED_PAGES`
in `App.const.tsx` leaves a page out of the gallery and the nav preview without touching its page; it holds `ViewportWrapper`, which is too tall to read at tile size, and both media switchers, `AudioSwitcher` and `ImageSwitcher` — all three the user's call. `TableOfContents` was on it until its page's examples became one outline in a 320-high scrolling box, which fits a tile. The list was kept, at their request, after it first carried `ShapeReveal`.

**A page with a Docs page is previewed by the first live example there, even when it also has an Examples page** —
the user's call, made once pages began moving their examples into their docs and some were left with nothing to
preview. The menu and the gallery both take `config.docs ?? config.component` (`toPreview`). Under the preview context
a Docs page strips itself the same way `PageExamples` does: `PageDocsSection` and `PageDocsAlert` draw nothing, and
each `PageDocsExample` asks the preview's `claimDemo`, which answers yes to the first caller only, so the first
example draws its demo bare and the rest draw nothing — no knobs, no code, and no source file fetched. React keys the
claim to the instance's `useId`, so a second render in strict mode gets the same answer; the other three run a
component's setup once, in render order, so a flag is enough. **A docs demo carries its source `path` as its
`data-testid`**, on the page and in the preview, so the gallery spec can match a tile to its page's first docs
example the way it matches an example by key. A Docs page with no live example would preview as an empty tile; none
exists today, and the gallery spec fails on one.

**A tile mounts only while on screen**, and is taken down when it leaves, so its state resets on the way back.

**Each tile is a nested `ViewportWrapper`, so a preview is a real scaled viewport rather than a CSS shrink**: pointer
positions, anchored popups and measurements inside all know the scale, and popups open clipped to the tile. The
canvas's width and minimum height were chosen by eye, against how small a 960-wide canvas made text; the height
grows to the example's natural height plus padding, so a tall example is shrunk to fit rather than cut off. Width
does not grow, so an example wider than the canvas still clips at the side (`Table`), and a very tall one comes out small
(which is why `ViewportWrapper` is excluded).

**An example is centered by its own natural width, and anything meant to fill says so with a width.** The preview
centers the page's wrapper and the demo's children, which shrinks each example to its content. That is right for a
lone `Select`, and wrong for anything with no content width of its own — `Wraparound`'s stage and `Carousel`'s box
collapsed — so a box meant to fill carries `width: "100%"`, which is a no-op on its page, where the example box
stretches it anyway. The reverse holds too: the `ScrambleText`, `SlotText` and `ScratchCard` stacks had
`width: "100%"` only to line their items up on the left, and lost it so they center. Centering one level deeper
instead, inside each example's own column, was measured across every tile and squeezes `Carousel`, `Paginator`,
`Tabs`, `Treemap` and `Timeline`, so it was not done.

**The nav shows the same preview in a tooltip on each row whose page has examples.** Three
calls, each the user's: the preview is a picture, not something to operate, since a usable card would make every row
the keyboard passes a stop and every pointer crossing a risk of a stray press; it is drawn in a `Tooltip`, which is
what non-operable content on hover or focus is, rather than a `HoverCard`, whose point is content one can use — the
cost being that a tooltip takes a tap as a long hover, so on a touch screen a tapped row shows its preview after
following its link, as every tooltip in the library does; and a page with no examples, or one in
`PREVIEW_EXCLUDED_PAGES`, gets none. **Nor does the row of the page that is open**, the user's call: the
preview is hoverable, as 1.4.13 requires, and it sits to the right of the row, which is where the pointer goes
on its way from a clicked row to the page, so it stayed up over whatever the pointer was heading for. A preview
of the page already on screen says nothing, and taking it away clears the commonest path without touching
`Tooltip`. `getVisibleNodes` strips the open page's `tooltipDefs` (`withoutPreview`), so clicking a row that
is showing its preview also closes it. `Tree` already carries a tooltip per row. The preview is `aria-hidden` and
`inert`, so the row's description comes out empty and nothing inside takes focus. `PagePreview` is the gallery
tile's drawing lifted out, so the tile and the tooltip cannot drift; the tooltip box is 360 by 240, the nearest round size to the gallery tile's preview at a usual window width, so an example comes out at the scale it was tuned at in the gallery, and the Playground tooltip's `isWide` lifts its 240-pixel limit for it.

**The nav's tooltip points at its row with the Playground tooltip's triangle**, at the arrow size the Tooltip page
starts with. It needed the library to hand the arrow's aim through `InteractionWrapper`: `Tooltip` has always given its
body `getArrowAim`, and the wrapper every control's `tooltipDefs` passes through dropped it in Solid, React and Svelte,
so no tooltip on a control could draw an arrow at that control. The aim is now the last argument of
`InteractionTooltipDefs.renderContent` in all four — last so every existing body keeps working unchanged; Vue's spread
already carried it at runtime and only its type lacked it.

**Porting: where the four differ.** React's `PagePreview` holds its own `Suspense`: a page component loads lazily,
and without a boundary of its own the first tile to mount an unloaded page suspended the route's boundary, blanking
the whole gallery until the code arrived — found by the spec of a tile far down, which came back to a scrolled page
and let go again. Vue and Svelte keep the gallery tile in a file of its own, since each file holds one component.
**A tree row's state carries the item it was built from**, as `value` on `TreeNodeRenderProps<T>`, which now takes
the item's type with `unknown` as its default. The user's call, taken to let Svelte write the nav's preview as one
snippet in `AppContent`'s template: a snippet cannot be made in code, the one `Tree` hands a row's tooltip was told
the row's state and not the row, so the first port mounted a component per row by hand with `createRawSnippet` and
`mount`, carrying the page's contexts along. Now every previewable row shares one tooltip that reads the page off
`flags.value`, as any Svelte consumer giving tree rows tooltips can. It is the tree's own extras, so `Tooltip` and
`InteractionWrapper` are untouched and no other control's tooltip sees it. Each `Tree` view hands `renderNode` the
flags it built itself rather than the copy its row hands back, which is the same object but lost the item's type.

**The tile's title is the text color in both link states**, declaring `:visited` itself as `dependencyLink` does,
since the theme's `a:visited` rule outranks a single class.
