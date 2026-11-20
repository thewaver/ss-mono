# Decisions: `Typeahead`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Typeahead: the text is read off the item, and `computeCustomText` is the way out

Settled on the user's call, closing the gap `Select`, `Menu` and `Tree` each recorded separately. All three
had the same blocker written down — the library has no text for an item, only what the painter drew — and
all three now have typeahead.

**The blocker was smaller than it read, because the item element is the library's own.** A
`role="option"`, a `role="menuitem"` and a `role="treeitem"` are all built here, with the painter's markup
inside them, so the text is already in the document and reachable without asking the consumer for it a
second time. Two of the three libraries checked do exactly this — Radix falls back to the item's rendered
text when no `textValue` is given, and React Aria requires `textValue` only when the children are not plain
text. What the earlier note called "a second source for text the painter already renders" was a prop that
did not have to exist.

**It is the accessible text, not `textContent`, and the difference is not cosmetic.** Every painter here
marks its decorative glyphs `aria-hidden` — `Tree` draws a "▶" before a branch's name, `Select` a "✓" after
a selected option. Raw text would make every branch in the tree begin with an arrow and match nothing a
person would type. So `TypeaheadUtils.getElementText` walks the element and skips any subtree carrying
`aria-hidden`, which lands on the same string a screen reader announces. Typing what you hear is the rule,
and it falls out rather than having to be arranged.

**The override is `computeCustomText`, and the word "custom" is doing work.** Named by the user, so that
the prop's own name says a default already exists — a bare `computeText` would read as the only source and
invite every consumer to supply one. Two cases need it, and only two. A **windowed** list mounts the rows in
view and nothing else, so an unmounted option has no element and no text; the Playground's virtualized
example passes `computeCustomText` for exactly that reason, and typing a route's name reaches one far below
the window. And an item whose paint is **not text** — a swatch, an avatar — has nothing to read.

**A consumer who forgets it gets the node's value rather than nothing.** `Tree` falls back to
`String(row.node.value)` when the row has no element and no custom text, because the alternative is a
typeahead that silently finds only what happens to be on screen — a windowed tree where typing "z" for a node
four hundred rows down does nothing at all, and looks like a key that was never wired. The fallback is worse
than `computeCustomText` whenever the value is not what the row displays, so it is a floor rather than a
substitute, and the prop is still the answer. `Listbox` and `Select` have the same shape and the same
fallback: an option with no element and no custom text is found by `String(option.value)`, for the same
reason.

**The buffer is a factory and the matching is a pure function, which splits the opposite way to the walk.**
`NavigatorUtils.computeNextPosition` was deliberately not a factory because each control owns its cursor
differently. The typeahead buffer is the reverse: a string and a timer, owned identically by all three, with
nothing per-control about it. So `TypeaheadUtils.createBuffer` owns that state and
`TypeaheadUtils.computeNextIndex` stays pure, taking positions and a text lookup and returning a position.
The rule from the walk still holds — the abstract answers _which item is next_, the control answers _what to
do about it_: `Select` moves its highlight, `Menu` moves its highlight, `Tree` moves real focus.

**A repeated letter cycles, and a growing query holds.** `l` then `l` means "the next thing starting with
l"; `l` then `i` means Lisbon. One rule covers both: when the query normalizes to a single character the
current item is excluded from the scan, otherwise it is not — which is why typing `li` does not walk away
from the Lisbon it just landed on.

**The query is forgotten after React Aria's and Radix's window**, rather than the shorter one some native
controls use. A slow typist breaks a two-word name in the shorter one, and the cost of the longer window is
only a stale query, which the next pause clears anyway.

**Space joins the query only when there is a query to join.** Space activates a menu item and selects an
option, so it cannot be a query key from cold; once something has been typed it belongs to the query, which
is what makes "depot p" reachable. The dangerous half is the one worth stating: a space typed mid-query must
not run the item the highlight happens to be sitting on, and `menu.spec.ts` pins that.

**Each control claims its own printable keys first.** `Tree` uses `*` to open every branch at a level, which
the published pattern names, so that branch moved above the typeahead check rather than the key being
special-cased inside the abstract. **An autocomplete `Select` is excluded outright** — a field with a query
signal is a real text input and every keystroke belongs to the consumer's filter. Filtering shortens the
list; typeahead walks it; a control does not do both.

**Typing on a closed `Select` opens it and lands on the first keystroke.** The list is opened before the
match runs, and Solid mounts it synchronously on the signal write, so the options exist by the time the text
is read. This was expected to need two keystrokes and does not.
