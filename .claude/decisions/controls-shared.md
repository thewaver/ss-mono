# Decisions: controls-shared

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The painter's object: `activation` left the flags, and only the mixed ones became `RenderProps`

Every control hands its painter **one** object rather than a run of arguments, because positional arguments
make a consumer declare and ignore three of them to reach the fourth. The naming rule that object follows is
in `conventions.md` under _"one aggregated object per painter"_; this entry records how the library was made
to fit it.

**`InteractionFlags` was the blocker, and it was the whole of the decision.** It is the type every painter in
the library receives, and it carried `activation` — a pointer position as a ratio, plus a count that steps up
on each press. That is a payload, so while it sat there the merged object was a `RenderProps` for _every_
control, `Button` included, and the `Flags` name could never be right anywhere. Its only reader in the repo
was the Playground's `Ripple`, which needs the position to place a ripple and the count to notice a new press.

**Three ways out were weighed and the third was taken.** Renaming the shared base to `InteractionRenderProps`
was honest but made every painter's argument a `RenderProps`, so the distinction stopped distinguishing
anything. Leaving `activation` in place and calling it interaction state was the cheapest and was rejected as
the fault itself — a tally and a position called flags. What was taken instead: `InteractionWrapper` reports
activation through an **`onActivation` callback**, so the shared base is booleans only and a control whose own
extras are booleans really does hand its painter a set of flags. No argument was added to any painter to do
it — the callback is a prop on the wrapper, which is why it does not reintroduce the cost the aggregate exists
to avoid.

**`onActivation`, not `onActivate`, because `Menu` already owns the shorter name** for the different event of
an item being chosen. **`isActivationTracked` is gone**: tracking is on when a handler is given, the same
presence-turns-it-on rule `Table` uses for `selection`. `InteractionTrackerUtils.trackActivation` no longer
holds a signal at all — it calls the handler and returns nothing.

**Fourteen types then split off as `*RenderProps`** — `CarouselStep`, `CarouselPick`, `Calendar`, `Clock`,
`ColorArea`, `ColorInput`, `FileInput`, `Range`, `PaginatorPage`, `PaginatorStep`, `SlideButton`,
`TableColumn`, `TableCell`, `TreeNode` — each carrying an index, a value, an array, a date or a color. The
other seventeen keep `*Flags`. `checkedState` is `boolean | "mixed"`, a choice from a fixed set, so
`BinarySwitchFlags` and `SelectGroupFlags` stayed as they were.

**`InteractionControlProps.flags` was deliberately left alone.** It is the internal contract between a control
and its own leaf element — `ButtonElement`, `CalendarDay` — and a consumer never writes it. One generic type
serves both kinds, so its member can only be named once, and naming it for the pure case keeps the misnaming
out of the sixteen controls that are pure.
