# Decisions: `CommandPalette`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `CommandPalette`: `Modal`, a `TextField` and a library-owned listbox

A search over every action in the application, opened by a shortcut, and a library component
rather than a Playground recipe — the `Button` precedent: making consumers assemble the wiring themselves was tried
and reverted. It composes what exists: `Modal` seals the page, `TextInput` carries the combobox wiring, and a grouped
list that can be windowed shows results from several sources under labels. What separates it from `Menu` is that a
shortcut opens it and it holds every action rather than the few belonging to one element.

The user's design, settled point by point before it was built:

- **Actions are `Select`'s records plus a shortcut**: `SelectOptionRecord<T>` with an optional `shortcut`, grouped
  with `SelectOptionGroupRecord`. Picking one calls `onActivate(value)`, as `Menu` does. Filtering is the consumer's,
  the split `Select` already makes: they narrow the actions from the query, the palette shows what it is given.
- **Open state is the usual two-way `visibility`**, so anything can open it.
- **A `shortcut` prop opens it, and each action's `shortcut` runs that action** — while the palette is on the page,
  open or not; that is the point of listing them. Both go through a new page-wide shortcut register in `Abstracts`,
  built the way `Dismisser` keeps its stack: a shortcut belongs to the layer it was registered from and fires only
  while that layer is on top, so page shortcuts stay quiet under a `Modal`. Two registrations of one shortcut warn in
  development.
- **A shortcut is data, not a string**: `{ key, modifiers? }`, `key` as `KeyboardEvent.key` names it (matched without
  regard to letter case), `modifiers` from `"mod" | "ctrl" | "alt" | "shift" | "meta"`, `"mod"` meaning Command on
  Apple platforms and Control elsewhere. Data because the palette draws each action's shortcut, and the painter needs
  the parts to write them in its own words (`⌘⇧K`, `Ctrl+Shift+K`) — the library ships no English.
- **WCAG 2.1.4 Character Key Shortcuts**: a shortcut with no modifier but Shift never fires while focus is in an
  editable field, and the library warns in development when one is registered, since such a shortcut must be possible
  to turn off or remap.
- **No key sequences** (G then I) in this version.
- **`Toasts`' `hotkey` moves onto the register**, taking the same shortcut data instead of a bare key — a breaking
  change, free before 0.1.0.

What the build added on its own account:

- **`TextField`, not `TextInput`**: `TextInput`'s suggestions open in a popover and highlight nothing until the reader
  moves into them; a palette highlights the first action so Enter runs it. The list is a library-owned
  `role="listbox"` around `ListboxOptions` with an `"active_descendant"` cursor.
- **Three required names** — the dialog, the combobox and the listbox — and a single `ariaLabel` for the dialog
  rather than `Modal`'s `ariaLabel`-or-`ariaLabelledBy` pair.
- **The option painter is handed the action's shortcut resolved for the platform**, in a `*RenderProps` object since
  it carries a payload; group headers get no flags, since nothing is ever selected. `aria-keyshortcuts` is not
  written yet: it needs option-level attributes in `ListboxOptions`, and until then a screen reader hears the painted
  shortcut as part of the option's name.
- **Tab stays with the `Modal`'s focus trap** rather than closing the palette, as the list cursor's Tab would.
- **The query empties once the closing fade has finished.** React, Vue and Svelte mark the modal unsettled in the
  update that closes the palette, `Select`'s guard, because there the palette's effect runs before the `Modal` reports
  its fade has begun and would otherwise empty the query first.
- **Per framework**: Vue's slots hand over `{ action, renderProps }`, `{ group }`, `{ renderContent, group }` and
  `{ renderField, renderOptions, visibilityTarget, transitionDurationMs }`, the last two made once so they keep their
  identity for `<component :is>`. Svelte cannot return a snippet from a function, so the Playground's shared panel
  painter there takes a fifth `hasActions` argument and each palette wraps it.
- **The Playground leaves it out of the navigation's hover previews**, which sit in a passive tooltip and would
  register live shortcuts while the menu entry is hovered.

### `CommandPalette`'s Docs page

The three examples became Basic and two sections, plus right to left. Basic is opened by its button, with a "Last run"
readout, and carries no shortcut of its own: the frame's palette owns `mod+K`, and registering one shortcut twice warns
and fires only the later — the actions section says so. "Actions with shortcuts of their own" keeps Alt+Shift+N, R and
X live page-wide, with a notes readout. "A bare-letter shortcut" registers G, which warns in the console on purpose,
as Label's "The caption wins" example does, under an alert citing WCAG 2.1.4. **Its off switch is a "Turn G off"
button below the palette, not a knob** — Claude's call: a knob would only set the example's own state, which the
rule against Playground-only knobs forbids, and the button is the very mechanism 2.1.4 asks the consumer to build, so
it belongs in the code a reader sees. Right to left is shown with the actions that have no shortcuts, so nothing is
registered twice; the dialog takes the direction of the button that opened it.
