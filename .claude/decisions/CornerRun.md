# Decisions: `CornerRun`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Which components pass corners down, and where each run is

`controls.md`'s _"A component passes the box's corners down"_ applied, all in the core stylesheets so the four
frameworks share it; only `Paginator`'s `<nav>` and the standalone `Listbox`'s root gained a class to hang it on.

- **`Tabs`** — the tab list is the run, keyed on its `aria-orientation`; the tab panel is the consumer's markup, so
  rounding it is theirs. The gutter inherits all four.
- **`SplitPane`** — the panes are the run, read as a row when a divider says `aria-orientation="vertical"` and a
  column otherwise, so a lone pane takes all four. Panes already hide their overflow, so they trim their contents.
- **`Toolbar`** — the shown items are the run; items held back for measuring are left out, the overflow button
  counts while shown.
- **`Paginator`** — every row is a run of its children, so the pages row nested in the steps row is one item of
  the outer run and its own run inside.
- **`Table`** — header then body; the body's last row; each row's first and last cells. Windowed rows are left
  out, since the last row drawn is not the table's last.
- **`Tree`, `Menu`, `Listbox` and what reuses it (`Select`, `MultiSelect`, `TextInput`'s suggestions,
  `CommandPalette`)** — every level and every `role="group"` inside is a run, so the last row on screen gets the
  bottom corners however deeply nested. `Menu` and `Listbox` write it at zero specificity because a consumer's
  group header sits in the run. A horizontal `Listbox` wraps, so it gets nothing; a consumer's `renderGroupBox`
  sits between a group and its items and breaks the chain until it inherits too.
- **Not reached**: anything laid out by `computeLayout` (placed, not a run) and virtualized rows.
