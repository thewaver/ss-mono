# Decisions: `InteractionSettings`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `InteractionSettings`: a wrapper whose settings nest, with the toast keys as its first

**The user's call: one context wrapper for the page-wide behaviors the library fixes, and it nests by merge.** An inner
wrapper starts from its parent's resolved settings and replaces only what it sets again: `undefined` inherits, `null` is
a value (the toast keys off), and an object value replaces the parent's object whole, never merging inside it
(`InteractionSettingsUtils.merge`). Chosen over a call made once at startup and over a `hotkey` prop on each provider:
a wrapper is declarative, can change while the page runs, and nests like any other context. The sweep of page-wide
behaviors found this one clear case and was closed on it; the weaker candidates it listed were not built. The name is the user's; a setting that is not an interaction, such as where the live
announcer mounts, may want a wider one.

**Where it lives.** `Primitives/InteractionSettings`: `BaseInteractionSettingsValues` (the wrapper's props, each
documented once), `ResolvedInteractionSettings` (`Required` of it; a type and a component of one name break the barrel,
so the type takes the `Resolved` prefix as `ResolvedShortcut` does), `INTERACTION_SETTINGS_DEFAULTS`, and
`InteractionSettingsUtils` (`merge`, `UNPROVIDED_CONTEXT`, `computeHotkeysSignature`, `getAreHotkeysEqual`). Outside any
wrapper a reader answers the defaults rather than throwing. Built in all four frameworks.

**The toast keys are read per provider and grouped by pair.** My first framing, that one binding needs one winner among
nested wrappers, was wrong: each `Toasts` reads the settings of its own nearest wrapper, so a stack answers to its own
pair and nothing has to win. The register binds each distinct pair once, keyed by `computeHotkeysSignature` (so `mod`
and letter case compare equal), while some stack answers to it, and the pair cycles only through the stacks of its
group, in the order they joined. Stacks on the default pair behave as they always did. `null` puts a stack in no group:
no key reaches it, and `ToastUtils.cycleFocus`, which goes through every stack, does. A forward key equal to another
group's back key is caught by the shortcut register's own duplicate warning.

**One restore point for the page.** Escape in any stack hands focus back to where it was before the first shortcut moved
it into a stack, whichever pair did it; `cycleWithin` records the origin only when focus is in no stack at all. A
restore point per group was the first plan, and one is simpler and gives the better result.

**`registerStack`'s `hotkeys` is optional, and left out means the default pair**; `null` is the explicit none. `Toasts`
holds its nearest wrapper's value steady by `getAreHotkeysEqual`, so a settings change that leaves the pair alone (an
equal pair written inline, say) does not re-register the stack. Each framework holds it its own way:

- Solid: a `createMemo` with `equals: InteractionSettingsUtils.getAreHotkeysEqual`.
- React: a ref holding the last pair, replaced only when the comparison says it differs, as `useStableList` does; the
  ref's value is the registering effect's dependency.
- Vue: a `computed` that hands back its previous value while the comparison says equal.
- Svelte: `$derived` takes no equality, so the last pair is remembered and handed back when equal, as `ParticleField`
  holds its cell count.

**Checked against WCAG.** 2.1.1: "All functionality of the content is operable through a keyboard interface" — a
switchable shortcut conforms as long as another keyboard route exists, and `cycleFocus` is that route; the library
cannot tell whether a consumer who switched the keys off wired it, so the doc block on `toastHotkeys` says it is theirs
to do. 2.1.4 covers shortcuts made only of letters, numbers, punctuation or symbols; F8 pairs are outside it, and the
register already warns when a consumer's pair is a single character.
