# Decisions: `TextSync`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `TextSync` is public, so the mask is a contract rather than an implementation

Settled by the user, choosing to export it over leaving it internal. `TextSyncUtils.utils` now leaves through
`index.ts` beside `TextSync` itself: `applyMask`, `applyGroupedMask`, `getGroupSizes`, the two `formatWith*`
helpers, the digit readers and both types.

**The argument that decided it is what a consumer is left with otherwise.** Three fields in this library are
built on it and a fourth kind — a phone number, a card number, a postcode — is an ordinary thing to want. A
consumer who cannot reach the mask reaches for a package instead, and the caret arithmetic is the part that
is hard to get right and easy to get subtly wrong: which digit a backspace over a separator takes, where the
caret lands when the groups shift under it. Withholding it does not stop that field being built; it only
stops it being built on the answer already tested here.

**What that commits to, stated so the next change to it is a deliberate one.** The caret rules are now
observable behavior: where the caret lands after an insertion, a deletion or a paste is part of the
contract, not an internal detail. So is the mask vocabulary — `#` as the digit slot, a minus as the only
sign, group sizes read from the decimal point outwards. Changing any of those is a change a consumer can
see, and belongs in the same class as changing a prop's meaning.

**Nothing is annotated on the way out.** A utility's contract here is its signature, which is the rule for
this repo rather than for `ss-utils`; exporting it does not change that, and the entry above is where the
reasoning lives.
