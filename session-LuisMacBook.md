# Session staging — LuisMacBook

**This file is a staging area for edits to the five documents, not a sixth document.** It exists because
work is running on more than one machine at once. Everything that would have been written into `CLAUDE.md`,
`conventions.md`, `decisions.md`, `backlog.md` or `brief.md` is written here instead, under the heading for
its destination, in the exact words it should carry once it lands. The user merges it into the core files
when both machines have been pushed, and this file is deleted as part of that merge.

## How to write in it

**Entries are lift-and-paste ready.** Write the finished text, in the voice of the file it is going to, not a
note describing what should be written. A `decisions.md` entry names the component and reads like its
neighbours; a `backlog.md` entry says which numbered item it belongs under, or `new` if it is a new item; a
`brief.md` entry is the one line, under the group it belongs to.

**No numbering is invented here.** New `backlog.md` items are listed under `new` in the order they were
argued, without numbers. Numbers are assigned once, on the machine where the merge happens, with both
machines' entries visible at the same time — that is the whole point of the file. Git resolves two concurrent
renumbers textually, and the result is duplicate items or items that quietly vanish.

**No changelog.** The rule from _"The five documents"_ holds here too: nothing records what landed this
session, what was fixed, or how many tests passed. Only text bound for a core file goes in.

**No fault gets written down before its explanation has landed.** The rule about `brief.md` and `backlog.md`
applies to text staged for them, not just to text already in them. Explain it in chat, wait for assent, then
stage it. Text bound for `CLAUDE.md`, `conventions.md` and `decisions.md` is still written freely.

## For `CLAUDE.md`

**While work is running on more than one machine, the five documents are not edited directly.** Stated by the
user, who runs Claude on two machines at once on different features and merges both at the end. Each session
writes its intended edits into `session-<machine name>.md` at the repo root — one file per machine, so the
two files never collide — committed like any other document and deleted once the user has had it merged in.
The merge is a thing they ask for, from either machine, once both sides are pushed.

**The machine name is the one the user gave that machine, not its hostname.** They renamed the first staging
file from the `ComputerName` it was built from, because they have several laptops and the hostname is not what
distinguishes them in their head. So do not derive the name from `scutil` or `hostname`, and where an existing
staging file disagrees with what the machine calls itself, that file is the right one — do not open a second.

The reason is `backlog.md`. Its index is contiguous from 1 and `brief.md` points at it by number, so closing
an item on both machines means both sides rewriting the same lines, and git reconciles that textually rather
than semantically — two items with the same number, or one dropped without a trace. Staging converts two
concurrent renumbers into one deliberate pass. It costs a session's conventions not reaching the other
machine until the merge, which the user accepted as the smaller price.

This rule is itself staged rather than applied, so it reaches `CLAUDE.md` through the same merge as everything
else. The rest of _"The five documents"_ is unchanged — the audience split, the numbering rule, the ban on
changelogs and dates all still hold, and they hold for what is staged here.

## For `conventions.md`

_(nothing staged)_

## For `decisions.md`

New section, to sit beside the other gradient-sample sections (after _"A tracked sample key is a mark, then a
treatment, then a colour count"_).

### Cycling the timed gradients: which colour a stop takes, and why the transparent ones are concrete

**The rule the user stated covers two arities, and one sentence covers the rest.** They specified that a
`_1` cycles through primary, secondary and tertiary, and that in a `_1v1` the first colour travels between
primary and secondary while the second travels between secondary and tertiary. Both fall out of a single
statement: **each gradient element cycles from the colour it already painted, and where a sample draws more
than one element the cycle is a two-colour ping-pong rather than the full palette.** A lone element has
nobody to distinguish itself from, so it takes the whole palette; two elements starting on primary and
secondary land on exactly the pairs the user named. It needs no table of arities, and it keeps a sample's
identity intact: `snake_4c` alternates the way `snake_4` does, because its arms still start on the colours
they started on and each takes the colour after its own.

**`background` never enters a cycle.** Stated by the user. The palette is four colours and the fourth is the
surface behind the sample, so the walk is primary → secondary → tertiary → primary.

**The `elastic_…` samples changed in place rather than gaining a variant, and were renamed `…_1c`.** They
painted a static three-stop ramp of the whole palette; they now paint one flat colour that cycles, which is
`hue_1`'s treatment. The rainbow is gone rather than optional, and `elastic_circle_3` became
`elastic_circle_1c` — the user's call on both.

**The cycle rides the same clock as the motion, because every `animate` shares one duration.**
`SVGAnimationUtils.createAnimateDefs` reads `animationDurationMs` for every element it stamps, so one sweep
across the surface is one full colour pass. Composition is a fragment in the `custom` slot of
`computeLinearGradient`, which is what `hue_rot_3` already did.

**A transparent stop must cycle too, and this is the part that decided the implementation.** The samples
spell a faded stop as `rgb(from ${color} r g b / 0)`, and a gradient ramp between a transparent stop and an
opaque one interpolates the two colours **without premultiplying** — so the hue of a fully transparent stop
is visible in the middle of the ramp. Measured in Chromium: a ramp from transparent yellow to opaque cyan
samples `rgb(175 255 175)` at its midpoint where transparent-cyan-to-opaque-cyan samples `rgb(0 255 255)`.
Leaving the faded stops on the starting hue while the opaque one cycled would therefore wash every band
through a muddy green for most of the cycle.

**SMIL cannot animate a relative colour, which is why `SVGDefsUtils.getTransparentColor` exists.** An
`animate` on `stop-color` whose `values` are `rgb(from … r g b / 0)` is ignored outright — measured in
Chromium, the stop sits on its attribute value for the whole duration while a hex-valued control interpolates
normally. SMIL's colour parser predates CSS relative colour syntax and does not resolve `from`. Concrete
forms all work: `rgba(r,g,b,a)`, `#rrggbbaa`, and the space-separated `rgb(r g b / a)` that
`Color.RGBA.toCss` emits. So `getTransparentColor` resolves a hex palette colour to that concrete form and
falls back to the relative spelling for anything that is not a hex — a non-hex colour then behaves exactly as
it does in the non-cycling sibling, which is to say the faded stops hold still. The guard mirrors the one the
tracked `c` variants already use around `Color.Hex.isHex`.

**Only the `c` variants use it.** The samples that do not animate their colours keep the relative spelling,
which reads better and works for any colour string.

**The number counts the colours on screen at once, and `c` says they move — which is what the
`elastic_…` rename settles.** The keys were first read as a problem: under _"A sample key is a sentence, and
its number is a colour count"_ a `scan_1c` walking three colours looked like it wanted to be `scan_3c`. The
user's answer was to take `elastic_circle_3` to `elastic_circle_1c`, and that fixes the reading — **the
number is what a viewer sees at any one instant, not how many colours the sample passes through over its
cycle.** A cycled sample shows one colour where it used to show a ramp of three, so `elastic_…` had to drop
from three to one; and every other key is right as it stands, because cycling does not change how many
colours are visible simultaneously. `scan_1c` shows one, `scan_1v1c` shows one per group, `snake_4c` keeps
its four arms.

**`hue_…` is the family still out of step, and it is the user's call.** Those samples cycle as their
identity and carry no `c` — `hue_1` shows one colour at a time and should read `hue_1c`, `hue_rot_3` shows
three at once and should read `hue_3c`, and `hue_pulse_2` shows one at a time, so a strict pass would collide
it with `hue_1`. The user has said the family may want a rename and has not taken it yet. Do not rename them
without them saying so.

## For `backlog.md`

### Under existing items

**Item 24 — _Cycling colour variants for the timed gradient samples_.** The audit and the build are both
done, so everything except the naming question comes out. Proposed replacement for the whole item, keeping
its number:

> ## 24. Renaming the `hue_…` family
>
> The cycling work is done. Eighteen `…c` keys were added across `merge`, `orbit`, `scan`, `snake` and
> `sweep`, and the four `elastic_…` samples lost their static rainbow, now cycle in place, and were renamed
> from `…_3` to `…_1c`. See `decisions.md` under _"Cycling the timed gradients: which colour a stop takes,
> and why the transparent ones are concrete"_ for the rule, the naming reading the rename settled, and the
> two measurements behind the implementation.
>
> - **`hue_…` is the one family left out of step.** Its samples cycle as their identity and carry no `c`,
>   which every other cycling key now does. `hue_1` shows one colour at a time and would read `hue_1c`;
>   `hue_rot_3` shows three at once and would read `hue_3c`; `hue_pulse_2` shows one at a time and would
>   collide with `hue_1c`, so the family cannot be renamed by rule alone.
> - **The user has said it may want a rename and has not taken the decision.** Nothing is blocked on it —
>   every sample works under its current key.

### New

_(nothing staged)_

## For `brief.md`

Replacement for the item 24 row in **Planned projects**:

| 24  | **Renaming the `hue_…` family** | Cycling is built: eighteen `…c` variants across `merge`, `orbit`, `scan`, `snake` and `sweep`, and `elastic_…` cycles in place as `…_1c`. Left: `hue_…` cycles without a `c` and cannot be renamed by rule alone, because two of its keys would collide. |
