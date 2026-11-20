# Decisions: `CurrencyInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `CurrencyInput`, and why it is not `NumberInput` with grouping

Settled by the user, choosing a separate control over widening `NumberInput`.

**The two fields are typed differently, not styled differently.** `NumberInput` refuses characters one
keystroke at a time and keeps `-`, `1.`, `1e` and `1e-` typeable. `CurrencyInput` accepts digits only and
fills a fixed fraction from the right, so `1`, `2`, `3` walk `0.01`, `0.12`, `1.23`. Neither is a mode of the
other, and moving `NumberInput` onto the mask path to get grouping would have risked a shipped control for a
field it is not.

**The digits are the value in its smallest unit, and the shift is done on the decimal spelling.** Multiplying
rounds the wrong way at exactly the cases a money field exists for: `1.005 * 100` is `100.49999999999999`, so a
rounded product loses the penny and `toFixed` inherits the fault. `${value}` prints the shortest decimal that
reads back as the same number, so moving the point along that string rounds on what the consumer wrote rather
than on its binary approximation. A magnitude printing in exponential form falls back to multiplying; an amount
field is not where `1e21` belongs.

**The separators come from the locale, not from props**, and so does the grouping. `Intl.NumberFormat`
already knows both and the consumer has already said which locale they are in; asking twice invites the two to
disagree. The grouping used to be the exception — a `groupSize` prop defaulting to three, on the grounds that
how wide a group is is a layout choice rather than a locale fact. That reasoning was wrong in the one place it
mattered: `en-IN` writes `12,34,567`, three digits nearest the point and twos above it, so a field that took
that locale's comma and grouped in threes anyway was spelling the locale wrong in the very place it had been
told what the locale is. `TextSyncUtils.getGroupSizes` reads the answer out of `Intl` beside the separators,
and `groupSizes` is now an override rather than the source.

**The override is a list of sizes because a single number cannot say what a locale can.** A prop meant for a
consumer who wants something other than their locale's grouping would otherwise be strictly less expressive
than the default it replaces, which is the argument for the shape rather than any current call site.

**There is no sign and no currency symbol.** The mask is digits-only, so a negative amount cannot be typed;
the symbol is paint in a leading slot, because a library holding no colors does not hold currencies either.
