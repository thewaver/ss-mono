# Decisions: `Progress`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Progress`, and what a non-interactive Fundamental looks like

The first `Essentials` component that is neither an interaction nor a composition
of one, so it settles the shape by being it.

**No `InteractionWrapper`, and no flags.** Nothing to hover, focus or activate. The root is a bare
`<div role="progressbar">` and the painter receives `getState`, not `getFlags` — `ProgressState` is the
analogue, and calling it flags would claim an interaction contract this component does not have.

**The painter is handed a normalized `ratio` as well as the raw value.** Clamping `(value - min) / span`
into 0..1 is the one computation a painter must not repeat, since getting it wrong draws past the end of the
track. `value`, `min` and `max` come along because a painter rendering "1.2 of 2.4 MB" cannot get them
anywhere else — the opposite of `TextInput`, which withholds the value because the input already draws it.
One rule both times: hand over what the painter would otherwise have to double.

**`ratio` is `number | undefined`, and the `undefined` is the mode.** An absent `getValue()` means
indeterminate, which is what ARIA means too — `aria-valuenow` is omitted. Sanctioned "presence as a
trigger": one meaning, and forgetting the prop yields a working indeterminate bar. It reads the **value**,
not the prop, for `getTooltipDefs`' reason — an upload with no total yet returns `undefined` from a
`getValue` that later returns numbers. Extras elsewhere are required so a painter never handles an
`undefined` its control cannot emit; here the control genuinely can emit one.

**The indeterminate animation is the painter's**, contradicting the note that raised this component: an
indeterminate bar is a looping animation with no state behind it, CSS runs it on the compositor free, and a
library-owned clock would burn frames handing over a phase `@keyframes` already gives. The library says
_that_ the bar is indeterminate.

**Placement is the library's**, contradicting the same note in the other direction — see the `Modal` presets.

**`getSizing` defaults to `"fill"`, the inverse of `InteractionWrapper`'s, and the type is declared here
rather than imported.** A control's natural size is its content; a track's is its container. Both
vocabularies have the same two members, and sharing the type would file a non-interactive component's
geometry under `InteractionWrapper.types`.

### Controls: `Progress`'s `role`, and the name both roles require

`role?: "progressbar" | "meter"`, default `progressbar` in `PROGRESS_DEFAULTS`, in `Modal`'s `role` shape, on the
user's call. A meter is a reading of how full something is, so it is heard as a gauge rather than as work that
will finish; a password strength bar announced as a progress bar was misleading.

**Indeterminate is refused by the type, not ignored at runtime.** `ProgressRoleProps` is a union: under `meter`,
`value` is required. A value that arrives missing anyway (a lying accessor, untyped JavaScript) is read as `min`,
so the element never carries `role="meter"` without `aria-valuenow`. The price is that a consumer switching
`role` at runtime through one accessor cannot satisfy either branch, which is the point.

**The name is required under both roles.** ARIA 1.2 lists `progressbar` and `meter` together as roles whose name
the author must supply, so `ProgressNameProps` is `Modal`'s one-of union, `ariaLabel` or `ariaLabelledBy`, applied
to both. The convention _"A role that requires a name makes the prop that names it required"_ had listed
`progressbar` among the roles that only recommend one; the spec says otherwise, and the convention was corrected
with this entry.
