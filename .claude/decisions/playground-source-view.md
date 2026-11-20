# Decisions: playground-source-view

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The Playground: an example's source is a folder view, and a sample is a file

Settled with the user. `PageComponents/Examples` exists to put a source-code button next to a
demo, and what that button showed was always incomplete: an example imports its samples, its styled components
and its page's own types, and only the example's own text was displayed — the half that was already obvious.

**What is shown is a set of tabs, and a tab is a folder rather than a file.** One tab for the example itself,
then one per thing it imports; inside a tab, an `Accordion` with the imported file open and its `.css.ts` and
`.types.ts` siblings collapsed beside it. The sections are whichever of those files exist — four of the 37
`StyledComponents` folders are missing one of the two, and "the files that are there" costs nothing and never
needs a special case.

**A tab is not every file in the folder**, the version that looks simpler and is wrong: a page folder would
drag in a 600-line props panel. It is the file that was imported, plus its style and types siblings.

**Only `playground/src` imports become tabs; everything from `components/src` stays opaque.** The line is what the
consumer has to write: the Playground half is theirs to reproduce, the library half is already written for
them. `@thewaver/ss-utils` and `solid-js` are on the library side for the same reason.

**Depth stops where the code stops being consumer-shaped.** Tabs follow imports transitively through
`StyledComponents`, and one level everywhere else. Not arbitrary: _"The three trees"_ defines
`PageComponents` as what the Playground would still need if the library did not exist, which is exactly the code
nobody copies. Following everything would put `Theme.css` on every example in the app.

**A page's own types and stylesheet are behind a flag, defaulting on.** An example importing `ShapePage.types`
is importing the shared prop type that lets one props panel drive seven examples — real, and not something a
consumer would write. Whether it belongs in the tab list was a hard call, so the mechanism resolves it like any
other folder and one constant decides whether it survives, in the shape `SHOW_COMPOSITES` uses in `App.tsx`.
**The default is not the user's call, it is this file's** — on, so the path stays exercised and the question
gets answered by looking at a real page.

### The source view, as built, and the four calls the mechanism forced

Built against the two entries above. Where a rule had to be derived rather than read off, it is
marked as such.

**An example declares its own file, as a path from the Playground package's root.** `ExampleDefs.src` — a string of
already-highlighted HTML built at module scope — is now `path`, and the highlighting happens when the modal
opens; the `?raw` imports and `highlighter.codeToHtml` calls are gone from all six pages that had them. The
path is a plain literal rather than anything derived: `import.meta.glob` keys are relative to the Vite root, which is `playground/`, so
`/src/App/Pages/ShapePage/Examples/Default.tsx` is the same string the resolver looks up, and a typo
produces an empty tab rather than a wrong one.

**The sample-key mechanism is gone, along with the samples it addressed.** `sampleKeys` on `ExampleDefs`,
the `<Registry>/Samples/` resolver and the skip rule that stopped a registry dragging in sixty tabs all went
when the samples moved into the library, where the "everything from `components/src` stays opaque" rule covers
them for free. See _"Samples live in the library"_.

**Derived: a tab is a name, not a file, so `.const`, `.utils`, `.types` and `.css` collapse into one.** The
settled rule says the imported file plus its `.css.ts` and `.types.ts` siblings. Applied literally to
`SVGDefs.const.ts` it produces a tab called `SVGDefs.const` whose types sibling would have to be
`SVGDefs.const.types.ts`, plus a second tab called `SVGDefs` for the types file the const imports — two tabs
for one folder. The stem is therefore the file name up to its first dot, so one `SVGDefs` tab carries the const,
the types and the utils. It used to strip only `.const`, `.utils`, `.types` and `.css`, and the user widened it to
any suffix after `LibraryTree.generated.ts` came out as a tab of its own beside `LibraryTree`: a list of known
suffixes breaks again the day a `MyThing.factory.ts` appears, and it already split the double-suffixed files
(`X.context.types.ts`, `X.utils.svelte.ts`) away from their component. **What is displayed is still only what the settled
rule allows**: a file appears either because it was imported or because it is the stem's `.types.ts` or
`.css.ts`. A `.utils.ts` nobody imported does not appear.

**Inside a tab, files are listed by kind, not by import order.** The component first, then a plain `.ts`, the
`.const`, the `.utils`, the `.types` and the `.css`, in both Playgrounds. The first build listed them in the
order they were found, which is the order the example imports them — and that order belongs to the import
sorter, not to anybody's intent: when the React port moved the page stylesheets into the shared `playground/`
package, their imports changed from relative to package-named, sorted ahead of the types, and every listing
flipped without a line of the source view changing. Chosen by the user over loosening the spec to accept any
order, so that a listing reads the same whatever the imports do. **A suffix not on that list goes last**, after
the `.css`, in all four Playgrounds — the user's call once the any-suffix stem made such files common. Before it,
Solid, React and Vue put an unlisted kind such as `.context.ts` or `.const.tsx` above the component, because an
unknown kind ranked as `-1`, and Svelte put it second; now the component always opens the tab.

**A sibling is displayed but never traversed.** A stylesheet reached only through another stylesheet is not
followed, which is the mechanism `Theme.css` was already meant to be kept out by.

**`Theme.css` is excluded by name as well, and it is the only file that is.** Settled with the user on
, after the mechanism gave `Card` a `Theme` tab honestly — the example does import the theme by
name. The user's reason generalizes: **the theme holds no logic that helps build the component**, it is a
palette, and a tab of color tokens teaches a reader nothing. The exclusion is a single constant rather than a
pattern, so it stays a named exception rather than the start of a filter list. It names the stem, `Theme`, not
one file: the values moved into `Theme.const.ts` so the landing page's build could read them without
vanilla-extract, and `TooltipContent` imports the radius from there, which a file-exact exclusion would have
turned into a `Theme` tab on every page with a tooltip.

**Forced: `?raw` cannot read a `.css.ts`, so the Playground's Vite config carries a nine-line plugin.** The
vanilla-extract plugin claims every `*.css.ts` by file name and discards the query, so a stylesheet requested
as text comes back compiled and with no default export — `codeToHtml` then receives `undefined` and the modal
renders nothing. `?source` resolves to an id no other plugin recognizes (a null-byte prefix and a `.source`
extension) and is read off disk by the plugin itself. The only part of the feature living outside `src`.

**Because the plugin reads the disk itself, it does its own gatekeeping** (OWASP A05:2021 Security
Misconfiguration; CWE-22, path traversal). Vite's `server.fs.allow` guards only Vite's own file serving, and the
dev server answers `/@id/<any id>`, so the first build handed any file the account could read to anyone who could
reach the server: a request for `/@id/__x00__source:<absolute path>.source?import` returned it, as did
`/@fs/<path>?source`, both reproduced with a file outside the repository. The plugin now loads only ids its own
`resolveId` issued, and issues them only for files whose real path lies under `playground/src` or a
`playground-*/src` — the trees the source view displays. The Playgrounds' `start` scripts bind to this machine
only, and `start:hosted`, at the root and in each Playground, adds `--host` for testing from another device on
the network: the user's call, so that a hole of this kind is not open to the whole network by default.

**An example is given the key rather than the resolved sample, and three pages changed to do it.** Still true
of what the example's own body shows, though the tab that displayed the resolved sample is gone. `Shape`
passed `getStrokeConfig`, `getFillConfig` and `getIterationConfig` already looked up; `CellAnimation` passed a
`computeSliceWeights` closure and a resolved origin; `ScanlineAnimation` passed a `computeSliceWeights` closure.
All three now pass keys and the example does the lookup in its own body, which is the line the reader came to
see. `CellAnimation`'s stress test gains a correctness fix on the way: the origin is computed from the cell
count actually in force rather than from the page's.

**The code box's height cap is a per-call-site parameter.** A standalone box keeps its 800; the source view
passes 500, because a tab shows a list of section headers above the open one and the modal has to hold both.
Neither number moved.

**The scroll container is the modal, edge to edge, and the padding lives inside it.** Asked for by the user on
, so the scrollbar sits against the modal's edge rather than floating twenty pixels inside it.
`PageModalPanel` takes a `getPadding` that overrides its own, defaulting to what it always had — the
parameter-with-per-call-site-defaults rule, since the stress test and the modal page still want the padding.
The source modal passes zero and is the panel's only child. The "tap outside to close" hint went with it: the
panel is now one thing rather than two, and Escape and an overlay click were never spelled out on any other
modal.

**The padding then belongs to the scroller's children rather than to the scroller, because of the sticky
strip.** A tab strip inset by the container's padding leaves a band either side of it, and code scrolling
upward passes through those bands in plain view. A strip that spans the whole scrollport and pads itself covers
everything going under it. Its `z-index` also has to beat the code box's inset border, which otherwise wins by
sitting later in the document at the same level.

**A page's description lives on its tab config.** The title under which a page renders comes from `TAB_CONFIGS`
in `App.tsx`, so the sentence under it does too — one place, one entry per page, and a page without a component
keeps neither.

### The shared list of Playground files is named from the Playground's own root

`SourceView.const.ts` in `playground/` holds the one `import.meta.glob` over the framework-free half, which the Solid,
React and Vue viewers merge with their own. **A glob names its files relative to the file the call is written in**,
so once the call moved into the shared folder its names came out as `../../Pages/…`, while each viewer still cut a fixed
`../../../../../playground/src/` off the front, as it had when the call sat in its own folder. Every shared file was
then filed under a wrong name, and the source view lost the stylesheets an example imports. The shared file now resolves
each name against its own folder and hands the list out as `/src/App/…`, the form the viewers' own globs use, so a
viewer merges it as it is and nothing downstream depends on where the call is written. Svelte keeps a glob of its own,
since it reads `.ts` only, and still cuts `CORE_GLOB_ROOT`.
