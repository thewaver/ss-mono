# Decisions: `Shortcut`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The shortcut register: a binding belongs to a layer, and the helpers' to the page

Built for `CommandPalette`, in `Abstracts/Shortcut`. A shortcut is data — `{ key, modifiers? }`
— and one document `keydown` listener serves every binding, attached with the first and removed with the last.

- **A binding the framework helpers register belongs to the page**, the user's call. It fires only while no layer
  that takes input is on top, so page shortcuts are quiet under a `Modal` — including the palette's own while it is
  open. The helpers used to take the layer on top when the owner's first effect ran, meaning "the dialog the owner was
  mounted inside"; but a `CommandPalette` mounted while an unrelated popup was open took that popup, and its Ctrl+K
  then worked only while that same popup was open again. A command palette is page-wide by nature, and `Toasts`
  already bound to the page, so the helpers now do the same. `ShortcutUtils.addBinding` still takes any layer, for a
  shortcut that should answer only while one particular layer is on top.
- **Tooltips are passive layers** (`isPassive`, skipped by `DismisserUtils.getTopLayer`), or every shortcut would go
  dead while any tooltip showed, keyboard-focus tooltips included. A peeking `Sidebar` is not passive yet.
- **Matching**: the key without regard to letter case and the modifiers exactly, except that Shift is not compared
  for a symbol or digit unless asked for, since the layout decides whether typing it needs Shift. When the key
  pressed types no plain ASCII character (Option+K gives ˚, a Cyrillic layout gives л) a letter or digit is matched by
  its physical key; ASCII layouts such as AZERTY keep their own letters. A binding does not fire on an event already
  `preventDefault`ed or during IME composition, and prevents the browser's action when it does. Two bindings of one
  shortcut on one layer: the later one fires.
- **WCAG 2.1.4 covers single characters only** — no modifier but Shift — which never fire in an editable field and
  warn on registration. Named keys such as F8 are not characters, and `Toasts`' F8 must keep working in a field.
- **Warnings print once per message**, since re-registration would otherwise repeat them, and on every build, as
  `Select`'s do.
- **Vue's `DismisserVueUtils.useLayer` registers one stable layer object per component** (it used to build a new one
  on each opening), since a binding given a layer compares it by identity. React re-registers only when the list of
  shortcuts changes and reads what each does from the latest render.
- **`Toasts`' shortcuts sit on the register**, so they are quiet under a `Modal` like every page shortcut — they used
  to move focus out of a modal's trap. The keys are `toastHotkeys` on an `InteractionSettings` wrapper; the Escape back
  is listened for on each stack's region.
