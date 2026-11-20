# Decisions: `SVGDefs-sample-families`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### A sample key is a sentence, and its number is a color count

The convention as the user stated it, and stated loosely on purpose: it was never designed, it is a habit
that reads well enough, and they have said not to take it too seriously. It is written down because it has
been guessed wrong twice, not because it is a law. **Do not rename existing keys to enforce it** — some of
the `_4` samples would be `1v1v1v1` under a strict reading, and were left short because that is unreadable.

**The trailing number is how many of the shared colors the sample paints with — never how many elements it
draws.** `spot_flare_3` puts ten gradients on the surface out of `primary`, `secondary` and `tertiary`, and
that is a three. A ten-layer sample named `flare_10` was the mistake that produced the rule. The useful
consequence: a sample can be made as elaborate as it likes without its name moving, and dropping a color
costs a hue rather than a chain, which is what let `spot_flare_2` be a flare at all rather than a pool and a
blob.

**A number followed by `s` means those colors are laid down solid rather than blended.** `flow_2s`,
`flow_3s`, `flow_diag_2s` and `flow_diag_3s` are the banded counterparts of their smooth siblings, which is
`spreadKind: "banded"` on the gradient — each stop emitted twice so the colors meet at a hard edge. **`flow`
is the only family that bands**, since the ripples' banded twins were deleted; see _"Every ripple had a banded
twin, and they were deleted"_ below.

**Suffix letters stack, and the order is `c` then `s`.** `flow_3cs` is three colors, cycled from a clock,
laid down solid — the user's spelling, and the general rule it fixes is that each letter qualifies the number
and they read in that order rather than in any other. The spelling was settled on `spot_ripple_3cs`, which no
longer exists; `flow_3cs` is the example now, and it is the only shape that carries both letters.

**A number followed by `c` means the colors are cycled from a clock rather than each painting its own
element.** `spot_trail_2c`, `spot_trail_3c`, `spot_ripple_2c` and `spot_ripple_3c` blend continuously through their color list
one second at a time, so at any instant the sample is showing one color — or a mixture of two — rather than
all of them at once. The user asked for the suffix form specifically, in place of the `_cycle_N` these were
first named: a letter after the number is the shape the registry already had for `s`, and it keeps the
color count where a reader looks for it. **A suffix letter is therefore how the number is qualified, and a
word between the family and the number is not the place for it.**

**`N v M` means element groups that are not contiguous, with their own color counts.** A horizontal line and
a vertical line is `1v1`: two separate things, one color each, not one two-colored thing. `orbit_async_2v1`
is a two-colored group answering a one-colored one. It is a statement about the composition rather than
about the count, so a chain of ghosts strung along a single axis is not a `v` — it reads as one thing. Where
the strict form would run to `1v1v1v1`, the short number is used instead.

**The leading word is the family, and the picker groups by it.** `splitEntriesIntoGroups` takes the first run
of lowercase letters, so everything named `sheen_…` arrives together in the dropdown. The words in between —
`diag`, `inter`, `async` — qualify the motion, and are descriptive rather than governed. `pulse` and `rot`
were two more of them and now have no consumer: `hue_pulse_2` became `fill_2c` because the number carried
the difference, and `hue_rot_3` was deleted outright.

### A tracked sample key is a mark, then a treatment, then a color count

**The registry grew two axes and the keys only had room for one, which is what the rename fixed.** A
sample makes a **mark** — a radial pool, a linear band, an angular wedge — and applies a **treatment** to it:
leave a fading history, expand it into rings, hang a chain of ghosts off it. `flare_…`, `ripple_…` and
`trail_…` were three prefixes for three treatments of the same mark, so the picker filed one family as
three; and `hand_trail_1` was the first key that needed both axes at once, which is what surfaced it. The
key is now **mark, treatment, color count** — `spot_ripple_3c`, `spot_trail_3c`, `hand_trail_3c` — and it
needed no new rule, since the leading word was always the family and the words between it and the number
always qualified.

**Three marks, three groups in the picker.** `splitEntriesIntoGroups` takes the first run of lowercase
letters, so `band_…` are the bands, `hand_…` the wedges and `spot_…` the pools — three headings for
however many entries the registry grows to, where the old spelling gave five and gained one on every new
treatment. `sheen_…` became `band_…` in the same pass: it named
a **look** where the other two name a mark, so it was the one family a reader could not predict from the
effect. The user weighed keeping it — it was their word, and `sheen_1` carried the plainest-key status
deliberately — and chose the consistency.

**`flare_1` became `spot_1` because it was never a flare.** It is a bare radial pool with no ghosts at all;
the flares proper are `spot_flare_2` and `spot_flare_3`, which add the chain. So the plainest key went to
the plainest thing, which is the same principle applied when the radial gave up `sheen_1` in the first
place.

**`smear` is a treatment and swallows `trail`.** `spot_smear_2` and `spot_smear_3` rather than
`spot_trail_smear_…`: a smear cannot be anything but a trail whose stamps are stretched, so spelling both
buys nothing and costs a long key.

**What they share is the driver.** They are the samples that read the pointer rather than running on a
clock: each calls `PointerTrackerUtils.create` inside `renderDefsElement`, hands over the `getRef` the registry
already passes, and turns `boxRatio` — the pointer's position as a 0–1 pair inside the element — into a
gradient's origin or offset. Their payload carries no animation fields at all, which is what the split
bought: a page showing them has no clock knobs to offer.

**The plainest one holds the plainest key, which is why the radial was renamed.** `band_1` is the vertical
band that slides sideways under the pointer — the simplest thing the bands do, and the one a reader
opening the group first should meet. The radial pool that used to hold that key is `spot_1`. The user's
call, and the renaming is the point of it: a numbered key with no qualifier reads as the family's base case,
so the base case has to be the one that earns it.

**What each one does with the reading.** `band_1` is a vertical band whose center follows the pointer's
horizontal position. `spot_1` is a radial pool centered on the pointer. `band_diag_1` is a band fixed
at 45° whose center slides along that diagonal by the pointer's projection onto it, so the tilt never changes
and only the position does. `band_1v1` is two bands, one horizontal and one vertical,
each following its own axis of the pointer, so they cross where the pointer is and the crossing is the
brightest point — the `1v1` suffix, as elsewhere in the registry, is one color answering another.
`spot_flare_2` is the pool plus a ghost mirrored through the center: at the bottom-right corner the ghost is
a small disc at the top-left, and as the pointer comes in the ghost grows and closes on the center with it,
because its origin is the pointer's reflection and its radius is interpolated by the pointer's distance from
the center. `spot_flare_2` and `spot_flare_3` are both the photographic thing — a source, two streaks and a chain of
ghosts along the axis through the center — and what separates them is how many colors the chain draws on.

### Cycling the timed gradients: which color a stop takes, and why the transparent ones are concrete

**The rule the user stated covers two arities, and one sentence covers the rest.** They specified that a
`_1` cycles through primary, secondary and tertiary, and that in a `_1v1` the first color travels between
primary and secondary while the second travels between secondary and tertiary. Both fall out of a single
statement: **each gradient element cycles from the color it already painted, and where a sample draws more
than one element the cycle is a two-color ping-pong rather than the full palette.** A lone element has
nobody to distinguish itself from, so it takes the whole palette; two elements starting on primary and
secondary land on exactly the pairs the user named. It needs no table of arities, and it keeps a sample's
identity intact: `snake_4c` alternates the way `snake_4` does, because its arms still start on the colors
they started on and each takes the color after its own.

**`background` never enters a cycle.** Stated by the user. The palette is four colors and the fourth is the
surface behind the sample, so the walk is primary → secondary → tertiary → primary.

**The `elastic_…` samples lost their rainbow, which is the part that stuck.** They painted a static
three-stop ramp of the whole palette; they paint one flat color instead, which is `fill_3c`'s treatment.
The rainbow is gone rather than optional — the user's call. **Their number and suffix moved several times
afterwards and the family is now `elastic_…_1` with a `cycles` flag**; see _"`elastic` took its static
position and went back to `_1`"_ below for where it landed and why each move followed the rule rather than
a change of mind.

**The cycle rides the same clock as the motion, because every `animate` shares one duration.**
`SVGAnimationDefsUtils.createAnimateDefs` reads `animationDurationMs` for every element it stamps, so one sweep
across the surface is one full color pass. Composition is a fragment in the `custom` slot of
`computeLinearGradient`, which is what the deleted `hue_rot_3` already did.

**A transparent stop must cycle too, and this is the part that decided the implementation.** The samples
spell a faded stop as `rgb(from ${color} r g b / 0)`, and a gradient ramp between a transparent stop and an
opaque one interpolates the two colors **without premultiplying** — so the hue of a fully transparent stop
is visible in the middle of the ramp. Measured in Chromium: a ramp from transparent yellow to opaque cyan
samples `rgb(175 255 175)` at its midpoint where transparent-cyan-to-opaque-cyan samples `rgb(0 255 255)`.
Leaving the faded stops on the starting hue while the opaque one cycled would therefore wash every band
through a muddy green for most of the cycle.

**SMIL cannot animate a relative color, which is why `SVGDefsUtils.getTransparentColor` exists.** An
`animate` on `stop-color` whose `values` are `rgb(from … r g b / 0)` is ignored outright — measured in
Chromium, the stop sits on its attribute value for the whole duration while a hex-valued control interpolates
normally. SMIL's color parser predates CSS relative color syntax and does not resolve `from`. Concrete
forms all work: `rgba(r,g,b,a)`, `#rrggbbaa`, and the space-separated `rgb(r g b / a)` that
`Color.RGBA.toCss` emits. So `getTransparentColor` resolves a hex palette color to that concrete form and
falls back to the relative spelling for anything that is not a hex — a non-hex color then behaves exactly as
it does in the non-cycling sibling, which is to say the faded stops hold still. The guard mirrors the one the
tracked `c` variants already use around `Color.Hex.isHex`.

**Only the `c` variants use it.** The samples that do not animate their colors keep the relative spelling,
which reads better and works for any color string.

**What the number counts depends on whether the sample has a non-cycling sibling, and that is the whole
rule.** Under _"A sample key is a sentence, and its number is a color count"_ the number is what a viewer
sees at any one instant, which read as a problem the moment `scan_1c` started walking three colors and
looked like it wanted to be `scan_3c`. The user's answer splits the two cases:

- **A `c` sample that has a non-cycling twin keeps the twin's number.** `scan_1` and `scan_1c`, `snake_4`
  and `snake_4c`, `sweep_1v1` and `sweep_1v1c`: cycling does not change how many colors are on screen at
  once, and holding the number still is what makes the pair read as a pair.
- **A sample whose identity _is_ the cycling counts the colors it walks through.** There is no twin to
  pair with and the instant-count says nothing, because every such sample shows one color per stop
  whatever it is doing. `fill_3c` and `fill_2c` would both be `fill_1c` under an instant-count, which is
  the demonstration that the instant-count carries no information here.

**The `elastic_…` four were the second case while they had no static sibling.** They are `fill_3c`'s
treatment applied to a shaped mark — a flat color walking the whole palette — so they went to
`elastic_circle_3c` and its three neighbors, the first pass having taken them to `…_1c` on the
instant-count reading. **They have a static sibling now**, which moves them to the first case and takes the
number back to one; the family is `elastic_…_1` with a `cycles` flag, recorded below. The rule did not
change — the situation did, which is the point of stating it as two cases.

**`hue_…` became `fill_…`, and its number counts the walk rather than the instant.** The family named what
changed where every other timed family names a motion, which is the same fault that took `sheen_…` to
`band_…`; and `hue` plus `c` said the colors move twice over. The user's call, with the keys they chose:

- **`hue_1` → `fill_3c`.** A flat surface walking primary → secondary → tertiary.
- **`hue_pulse_2` → `fill_2c`.** A flat surface ping-ponging between two colors. `pulse` is gone because
  the number now carries the difference — a two-color walk is the ping-pong.
- **`hue_diag_inter_2` → `fill_diag_2v2c`.** A diagonal two-stop ramp whose stops take turns, each
  walking two colors of its own. `diag` stays so the direction is on the key and a straight `fill_2v2c`
  remains available — the user's call. `inter` goes, because `v` already says the two stops are independent.
- **`hue_rot_3` was deleted.** Rotation is a treatment any family can take — the user noted `flow` could
  grow a `flow_rot_…` set — so it was not worth a key of its own here. **They said explicitly not to build
  that set**; the note records where it would go, not work to do.

**`fill` was chosen over `flood` because one member is a ramp.** `flood` promises a single flat color,
which `fill_diag_2v2c` is not; `fill` says only that the paint itself is what changes and nothing travels across
the surface, which covers all three. The family word states the mark, and `c` is the only place cycling is
stated.

**The `fill_…` numbers count the colors the cycle walks through**, which is the second case of the
numbering rule above — the case these keys are what settled.

**`v` now covers stops inside one gradient.** `fill_diag_2v2c` is a single linear gradient with two stops, where
_"`N v M` means element groups that are not contiguous"_ had said two stops of one ramp read as one thing.
The user's spelling extends it: two stops on independent cycle schedules are two things, because what makes
them separate is the timing rather than the geometry.

### `flow` has parity across both suffixes, and banding needed its own cycling helper

**The family now spells every combination.** `flow` and `flow_diag`, each at two and three colors, each
plain, `s`, `c` and `cs` — sixteen keys where there were six. The gaps were an oversight rather than a
choice, and the user's call was to close them: `flow_2` and `flow_diag_2` had only ever existed banded, and
nothing in the family cycled at all.

**`SVGAnimations.Gradient.cycleSmoothColors` cannot drive a banded gradient, and that is why
`cycleBandedColors` exists.** It hangs one `animate` per entry on `#{gradientId}-stop-{index}`, which is
what `renderSmoothGradientStops` emits. `renderBandedGradientStops` emits two stops per boundary instead —
`stop-0-start`, then a `stop-{i-1}-end` and a `stop-{i}-start` for every following color — so every
`animate` the smooth helper produced would reference an id that does not exist. **It fails silently**: SMIL
ignores an `href` it cannot resolve, so the gradient renders correctly and simply never moves. Nothing had
caught it because nothing had asked: the only keys that banded _and_ cycled were the tracked ripples, and
those blend on their own per-frame clock rather than through SMIL, so they never touched the helper. The
new one walks the same `string[][]` — one list per **declared** color — and stamps both ids each declared
color owns, which is `stop-{i}-start` always and `stop-{i}-end` for every color but the last.

**Verified in the browser rather than argued.** With `flow_3cs` picked, all twenty-six rendered stops carry
banded ids and all twenty-six change color inside 400ms, while `flow_3s` — the same gradient without the
`c` — holds every stop still. The control is the half that matters: it says the probe measured the cycle
rather than something incidental.

**`SVGDefsUtils.getCycleWalk` exists because the banded keys have up to seventeen stops.** Every `c` sample
before these hand-wrote its per-stop color lists, which is fine at three stops and absurd at seventeen —
four files at roughly seventy lines of near-identical color references. The helper turns a stop's own
palette key into its walk, `primary` giving primary → secondary → tertiary → primary, which is the rule
_"each gradient element cycles from the color it already painted"_ expressed once instead of per file. So a
cycling flow file names its stops as a list of palette keys and derives both the gradient's colors and the
cycle from that one array; the eight cycling keys are the only samples in the tree that read this way, and
the eighteen older `c` samples were left alone rather than migrated under this work.

**The smooth two-color keys match their three-color siblings' structure, not their traversal count.**
`flow_2` and `flow_diag_2` carry seven stops alternating two colors, where `flow_3` carries seven cycling
three — the same number of color transitions across the surface, which is what the existing banded pair
already did by holding band count roughly level rather than palette traversals. The banded and diagonal
tuning was copied per variant rather than normalized: horizontal banded and smooth share an offset of 0.5
and a full sweep, while diagonal banded uses 0.25 and half a sweep where diagonal smooth uses 0.5 and a
full one. Those are tuned numbers and were left exactly as the existing keys had them.

### The bands leave the surface by traveling off it

**The bands leave the surface by traveling off it, and nothing about them fades.** The first
build faded their alphas out over a window of pointer distance, and it looked wrong — a band lying still and
dimming is not what a highlight does. The user's call was to drop the opacity entirely and let the movement
carry the band off the painted area, and it needs no extra arithmetic at all: the pointer's position inside
the box is read unclamped, so a pointer beyond the element keeps pushing the band beyond it too. Both bands
travel one span per box, which puts their falloff clear of the surface at roughly one and a half radii out —
the reach the user pointed at, taken from the card glow the `PointerTracker` page carried at the time. The radials keep their last position instead, which is why they were the ones that already
read correctly.

**The clamp was the thing making it look stuck.** Pinning `boxRatio` to 0 – 1 holds the band against the
edge for as long as the pointer is anywhere outside, so every version of the fade had to hide a band that
was still there. Removing the clamp is the whole fix, and it also means an untouched page shows the band
centered, exactly as `spot_1` shows its pool centered.

**Every tracked sample reads from the colors bag, and brightness comes from luminosity rather than from white.**
The first build painted every core white on the reasoning that a highlight is the color of the light; the
user recolored them, so each layer now takes `primary`, `secondary` or `tertiary` and the Border Colors
knobs move all of it. What keeps a core reading as a source rather than as a flat disc is `hsl(from <color>
h s calc(l * 1.5))` at the innermost stop — the sample's own color with its lightness lifted — which is the
same relative-color form `getBaseBorderColor` already uses. The ghosts lift theirs less, at 1.35, so the
pool stays the brightest thing on the surface.

**A band that starts inside the box leaves a visible kink, and it is inherent.** A linear gradient pads its
first stop outside its axis, so where the axis begins there is a change of slope from flat to ramping. It is
transparent on both sides of that line, so nothing jumps; what the eye catches is the second derivative. The
alternative is a span wide enough to always overhang the box, which costs the band its shape. Left as is.

### The flares are a table of ghosts, arrived at over three tries

**Three tries at the flare, and what each one got wrong.** The first was two saturated circles and read as
painted blobs. The second added a third and made one a ring, which helped and was still not it. What settled
it was the user naming the three faults together: the ghosts were too solid, there were too few of them, and
the source was a broad haze rather than a light. All three are true of any flare built from a couple of
strong circles, and the fix for all three is the same — more elements, each much fainter.

**The photograph and the renderer's manual said the same thing, and the streak was tried and cut.** The user
pointed at a real lens flare, where the ghosts alternate between small filled discs and larger stroke-only
rings, and then at Shade3D's lens flare reference, which exposes exactly three ingredients: **flare**,
**ghost** and **streak**. The streak was built — a radial gradient squashed to a fortieth of its height about
its own origin is a horizontal spike, and the abstract grew an `aspect` prop to express it — and the user cut
it: the primary element does not need spikes, and it reads better without. The `aspect` prop went with it,
since an abstract with no consumer is dead API — and the estimate left here, that rebuilding it was a
`gradientTransform` from a `Size2d` of multipliers and about fifteen lines, **held when `spot_smear_3`
needed it.** It is back, described under _"a radial gradient can only be a circle"_ below, and the streaks
are still not built: what wanted the prop was a smear along a direction of travel, not a spike.

**A flare is a table, not a dozen hand-written blocks.** Each sample's ghosts are rows of reach, scale,
alpha, color and a filled-or-ring flag, mapped into defs; the streaks are two more rows. That keeps the
sample's own shape explicit in its own file, which is what _"nothing is folded into a factory"_ is protecting
— the reader sees the whole chain as data rather than chasing a helper in another tab.

**The satellites fade out with the pointer's distance, and that is a correctness fix rather than a taste
one.** A ghost's origin is the pointer pushed toward the center by its `reach`, so a ghost at a reach of one
sits **on** the center no matter where the pointer is — with the cursor a whole screen away, a couple of
faint rings stayed parked in the middle of the surface. Every satellite's alpha is now multiplied by
`SVGDefsUtils.getPointerFade`, full strength while the pointer is within the element and gone by twice that
distance, which also takes them away when the pointer leaves the window. The source needs no such thing: it
follows the pointer, so it leaves on its own.

**What makes the chain read: alpha, count and spacing.** Ghost alphas are a small fraction of the
source's, saturation is cut and lightness lifted, so each one is a pale veil rather than a
colored circle. Reaches along the line from the pointer through the center are uneven, because evenly spaced ghosts read as a pattern, and sizes alternate between specks and
wide faint rings for the same reason. `spot_flare_2` keeps one filled satellite and one ring, which is the
user's call: two colors should look simpler than three, not merely differ in hue. The source itself is a small bright core with a tight bloom and a long
faint veil, four stops in, which is what separates a light from a haze.

**The source is `spot_1`'s pool, unchanged, and every flare shares it.** The rebuilt
flare had tightened it into a small bright core with a long faint veil, which is what separates a light from
a haze — but the user's instruction was that the primary element stays exactly as the one-color
sample paints it, spikes and all removed. So all three now share one pool: scale 1.5,
full alpha at the center, 0.75 at five per cent, 0.25 at forty, gone by the edge, and no screen blend on that
layer. **The cost is visible and is the reason it was asked for rather than assumed**: that pool is broad and
bright, so with the pointer near the middle it floods a third of the surface and the ghosts sit inside the
glow rather than against the dark. Reverting to the tighter source is the four constants at the top of each
file.

### A radial gradient can only be a circle, so `aspect` and `angle` turn it into an ellipse

**What was added.** `SVGRadialGradientDefs` grew `aspect` — a `Size2d` of multipliers for the two axes — and
`angle`, which turns the stretched axis. `SVGUtils.getRadialTransform` composes them into the
`gradientTransform` text, and `computeRadialGradient` passes it straight through. `angle` matches the name
and the clockwise-degrees convention the linear gradient already used, so the two abstracts agree.

**The transform is applied about the gradient's own origin, which is the part that matters.** A bare
`scale()` on a gradient drags its center toward the corner, so a stamp following the pointer would slide off
it as soon as it stretched. Translating to the origin, turning, scaling and translating back leaves the
center exactly where the sample put it and changes only the shape around it.

**It returns `undefined` for an untransformed circle rather than an identity transform.** Every existing
sample passes no `aspect`, and emitting `gradientTransform="translate(…) rotate(0) scale(1 1) translate(…)"`
on all of them would be a new attribute on hundreds of gradient elements for no effect. The guard is
`aspect.width === 1 && aspect.height === 1`, so the markup those samples produce is byte-for-byte what it was.

### `hand_1` is `snake_1` with the clock taken out, a third color stop, and a narrower wedge

**What it draws.** A quarter-turn wedge running from the middle of the element outward, its bisector pointing
at the cursor, solid along that bisector and fading to nothing at both of its straight edges. The user's
idea and the user's construction — they pointed at `snake_1` and named each change — and the attempt before
this one was over-engineered enough that it is worth writing down what the sample actually is.

**It is `snake_1` with three edits and nothing else.** That sample clips a linear gradient to a `180` degree
pie slice from `SVGUtils.getArcPath` and animates the slice's rotation and the gradient's angle together off
a clock. The edits are: the gradient's colors become transparent, `primary`, transparent — three stops with
no positions, so they spread evenly and the solid one lands in the middle; both angles come from
`PointerTracker`'s `angle` instead of from the animation; and `SWEEP_ARC` narrows the slice to `90`. No part
of the geometry was rebuilt.

**The gradient runs across the wedge, not along it, and that is the whole of why it reads.** With the
gradient's axis a quarter turn off the bearing, its middle stop lands on the perpendicular through the
center — which is the wedge's own bisector — so the wedge is solid down its middle and falls off toward its
two edges, the falloff growing with distance from the center. The earlier build ran the gradient **along**
the bearing instead, fading from hub to tip, and a pie slice has its point at the center, so the end meant to
fade in at the hub was squeezed into a tip with no width and the result was a tapered shard. Narrowing the
arc was never the mistake; turning the gradient to face along it was.

**Two leads, and at `180` degrees they coincided.** `getArcPath(arcSize, r)` sweeps from `r + arcSize + 180`
back to `r + 180`, so its bisector sits at `r + 180 + arcSize / 2`; pointing that at a bearing means passing
`angle - HALF_TURN - SWEEP_ARC / 2`. The gradient separately wants `angle + SWEEP_LEAD`, a quarter turn off,
to put its middle stop across the wedge. At an arc of `180` those two expressions are the same number, which
is why `snake_1` could feed one value to both and why the first version of this sample got away with it. At
`90` they differ by `45` degrees, and feeding one value to both would leave the wedge brightest along one
edge instead of down the middle. **Checked by pointing at three known bearings and looking**, at both arc
widths, rather than derived and trusted.

**It fades with the pointer's distance, which the first build forgot.** A hand is anchored at the element's
center and only turns, so unlike a band it can never travel off the surface — it kept painting at full
strength with the pointer three hundred million pixels away, which is the fault the user reported. Its peak
alpha is now multiplied by `SVGDefsUtils.getPointerFade`: full while the pointer is inside the element, gone
by twice that distance, and gone when the pointer leaves the window. The same multiplication went on every
`hand_trail_…` head; their stamps already captured the fade at birth, so only the live wedge was missing it.
**This is the same correctness fix the flares' satellites needed** — see _"the satellites fade out with the
pointer's distance"_ — and for the same reason: an element whose position does not follow the pointer cannot
leave on its own.

**It is still the cheapest sample in the registry, because a bearing needs no clock.** Nothing about `hand_1`
fades in place or advances while still, so `PointerTracker`'s own invalidate-on-move is the whole of its
animation and `SVGDefsFrameUtils` is not involved.

### `hand_trail_1` is the trail machinery with a bearing frozen instead of a position

**What it draws.** `hand_1`'s wedge at the live bearing, and behind it a fan of wedges left at the bearings
the pointer swung through, fading out over the same window the trails use. Swing the cursor round the center
and the hand drags a fading sweep behind it; hold still and the fan decays away to leave the hand alone.
**It is a separate sample, not an edit of `hand_1`** — the user's instruction, and `hand_1` is untouched.

**Everything is borrowed from the trails except what is frozen.** Same round-robin over `STAMP_COUNT` slots
by clock tick, same `SVGDefsFrameUtils` clock with the same lifetime, same alpha decay, same
`SVGDefsUtils.getPointerFade` captured at birth so the fan retracts when the pointer leaves. The one
substitution is that a stamp stores the `angle` from the reading rather than the `boxRatio`, and hands it to
both the clip's rotation and the gradient's angle. The whole family difference is one field.

**The gate is angular, so a pointer moving straight at the center lays nothing down.** The trails wake and
stamp on distance traveled; here the thing that changes is the bearing, so the gate is
`MOTION_TURN_DEGREES` of turn. Moving radially — in or out along the same bearing — does not rotate the hand
and correctly leaves no trail. The comparison has to take the shorter way round the circle, because a
bearing crossing the `-180` / `180` seam otherwise reads as a `359` degree turn and stamps a whole fan from
one frame; `getShortestTurn` is the same normalize-and-fold used for hue in `Color`.

**One stamp per slot, shared by the clip and the gradient, and the first build got this wrong.** A slot has
two `renderDefsElement` closures — one for the wedge, one for the gradient inside it — and calling
`createHandStamp` in each gave the slot two independent states. They agree almost always, because both read
the same clock frame and the same reading, but the motion gate compares against `performance.now()` read
separately in each, so the two calls can straddle the grace boundary. When that happens the clip freezes a
new bearing while the gradient keeps the old one, and the bright band sits outside its own wedge for a whole
lifetime. The slot now creates the stamp lazily into a closure variable and both readers share it, which
also halves the trackers and the signals.

**The wedges have hard edges, and the cause is geometric rather than a tuning miss.** A wedge's sides are
where the clip cuts, and the gradient inside it only reaches transparent at the ends of its own axis — which,
for a `90` degree arc, sit well outside the wedge. So each wedge is cut off partway down its ramp. With a
fan of them at slightly different bearings those cuts stack into visible banding, which reads as stepping
rather than as a sweep. `SWEEP_SPAN` shortens the gradient's axis to `0.7` so it reaches transparent closer
in and the sides soften from the middle of the element outward; near the hub, where the wedge is only a few
pixels wide, they stay hard and it does not matter. **`hand_1` has the same hard sides for the same reason
and has not been changed** — the user has already accepted how it looks, and softening it is a change to its
appearance rather than a fix to a fault.

**The color variants are the trails' two treatments unchanged.** `hand_trail_2` and `hand_trail_3` band
the color by the stamp's age, with the same `AGE_COLOR_SPAN` compressing the bands into the part of the
life that is still visible; `hand_trail_2c` and `hand_trail_3c` blend the live wedge through the colors on
`CYCLE_MS` and freeze each stamp at the color the wedge had when it was laid. Neither needed anything new —
the treatments are written against a stamp's age and birth time, and a stamp storing a bearing has both.
That the same two treatments dropped in unaltered is the clearest evidence that `trail` is a treatment
rather than a family, which is the naming question recorded below.

**Per-stamp alpha is far lower than the trails', because wedges stack where pools do not.** Near the hub
every wedge in the fan overlaps every other, so at the trails' `0.25` the composite saturated to a solid
sheet of color — a fan, not a fading trail. `0.07` makes each one a veil and the fan reads as a sweep. The
hub stays the brightest point no matter what, since it is the one place every wedge covers; that is inherent
to a pie slice and is not worth fighting.

### The trails leave stamps behind and fade them where they lie

**What they draw.** A pool centered on the pointer, and behind it `STAMP_COUNT` radial stamps laid down along
the path the pointer took. Each stamp is a frozen position: it is written once, and from then on it dims in
place until it is overwritten. The pointer therefore leaves a smear behind it that fades away over
`STAMP_COUNT * STAMP_INTERVAL_MS`, and a pointer holding still shows only the pool. The numbers are the
user's — currently a stamp on every frame, so the trail is dense rather than beaded — and are named here
rather than quoted so this entry does not rot the next time they are tuned.

**Frozen positions are the whole idea, and the alternative was tried in the head first.** A chain of
followers — each layer lerping toward the one ahead of it — is the cheaper build and is what a comet tail
is, but it is not a trail: everything in it converges on the pointer the moment the pointer stops, so
nothing is ever left _behind_. A stamp that keeps the coordinates it was born with does leave something
behind, and it is also what makes the effect read correctly under a scroll: the coordinates are `boxRatio`,
so a stamp stays on the part of the element it was painted on rather than sliding across it.

**Round-robin by clock phase, so no layer needs to know about any other.** The registry hands each layer its
own `renderDefsElement`, and there is no shared object between them; what replaces one is arithmetic on a
shared clock. Slot `i` owns the ticks where `Math.floor(now / STAMP_INTERVAL_MS) % STAMP_COUNT === i`, so
they re-stamp in turn, one stamp interval apart, and their ages are evenly spread across the lifetime
without anybody co-ordinating it. A slot's alpha runs from full at birth to nothing at
`STAMP_COUNT * STAMP_INTERVAL_MS`, which is why the jump back to the pointer at rebirth is invisible — the
stamp it replaces had already reached zero.

**Geometry is a function of age, never of the slot, and that is not a style preference.** The flares are
tables of reach, scale and alpha because each of their ghosts is a different thing; here every slot plays
the same part and differs only in when its turn comes. Giving the slots uneven alphas or sizes — the trick
that keeps a flare's chain from reading as a pattern — would make the trail **shimmer**, because a given
point on the path is drawn by a different slot on each pass. Scale and alpha are therefore derived from age
alone. Color is derived from age for the same reason, and the entry below on `AGE_COLOR_KEYS` is what
happens when it is derived from the slot instead.

**The fade is captured at stamp time rather than read live.** `SVGDefsUtils.getPointerFade` is called once,
when the stamp is written, and stored with it. That is what makes the trail retract properly: when the
pointer leaves, the stamps already down keep the strength they were born with and decay on their own
schedule, while new stamps arrive at zero. Reading the fade live would instead dim the whole trail at once,
which is the fault the band samples were corrected for under _"nothing about them fades"_.

**It needs a frame clock, and it was the first sample in this family that did.** The other six are pure
functions of the pointer's position, so `PointerTracker`'s own invalidate-on-move is all the clock they
need; something fading _in place_ has to advance while nothing is moving. The loop is
`SVGDefsFrameUtils.createClock`, described below.

**A stamp is only written while the pointer is actually moving, and the first build got this wrong.** It
re-stamped on the clock alone, so a pointer holding still had twelve blobs piled on one spot re-firing in
rotation, and because the alpha decay is a curve rather than a straight line their sum is not flat — the
resting pool **pulsed**, which the user saw immediately. Two things fix it together and both are needed. The
stamp is gated on the pointer having moved more than `MOTION_STEP_RATIO` of the box within the last two stamp
intervals, so a still pointer lays nothing down and the trail already on the surface decays away to leave
the pool alone. And the clock is woken by that same movement rather than by the pointer merely being over the
element, so a still pointer does not just draw nothing — it stops the loop, and a pulse becomes impossible
rather than merely invisible.

**Measured in the preview build**: one second with the pointer parked over the element requests **zero**
frames, where the first build requested about sixty. Restarting needs no help from the clock, because
`PointerTracker` still invalidates on `pointermove` and the layer's effect re-runs from that; the cost is
that the first frame of a new gesture is the one that establishes the direction, so the trail begins one
frame late.

**The React and Vue samples hold the stamps in an array written in place, not in state.** The effect that lays a
stamp runs after the frame has rendered, so writing the stamp into state there rendered every frame twice, and
React's development build reported the chain as "Maximum update depth exceeded". The array is made once per
mounted sample, and the next frame's render — which the clock guarantees while the trail is fading — paints what
was written. The stamps and their fade are unchanged; a new stamp shows one frame after it is laid. Svelte's
samples update only the stamps' own markup when one is written, so they keep their state.

**A stamp is the pool at a lower alpha, by the user's instruction, and `computePoolColors` is what makes
that true by construction.** The first build gave the stamps their own scale, their own mid-stop and a
shrink-with-age, so a stamp was a different shape from the head as well as a dimmer one. The user's call was
that the stamps carry the same size and the same stops as the main element, and only their strength should
differ. So one local function builds the four-stop pool table at a given peak alpha: the head asks for it at
1, a stamp asks for it at its own faded alpha, and both use `POOL_SCALE`. `STAMP_SCALE`, `STAMP_SHRINK`,
`STAMP_MID_STOP` and `STAMP_MID_ALPHA_RATIO` are gone. **The cost is real and was accepted**: at the pool's
width, consecutive stamps overlap almost entirely, so the trail is a soft comet glow rather than the defined
tapering tail the first build drew.

**The color follows the stamp's age, not its slot, and the first build got that backwards.** `spot_trail_2`
alternates two of the shared colors and `spot_trail_3` runs all three, and the obvious way to do it — color by
`index % keys.length`, exactly as the ripples do — produced mud: an olive haze for the two-color one and a
gray-brown one for the three. Two things caused it together. Stamps are the pool's width and are laid one
per frame, so no stamp is ever visible alone for its color to be seen in; and none of them is opaque, so at
any point the composite is an alpha-weighted average of every stamp covering it rather than the topmost one.
Cycling by slot therefore averages all the colors everywhere. Cycling by **age** does not, because alpha is
also a function of age: the young stamps that dominate a point near the pointer all carry the first color,
and the older, fainter ones further back carry the later ones. So the trail grades from the head backwards
instead of averaging. The user chose this over screen-blending the stamps, shrinking them, or spacing them
out, all three of which would have cost either the size-and-stops rule or their tuned count and interval.

**`AGE_COLOR_SPAN` exists because the bands were landing where nothing is visible.** Spread evenly over the
whole life, the last band starts at an age where `(1 - age) ** STAMP_DECAY_EXPONENT` has already taken the
alpha near zero — `spot_trail_3`'s `tertiary` never appeared at all. The bands are therefore spread across the
first 0.55 of the life and the last one holds everything past that, which is one constant rather than a
change to the decay the user tuned.

**It reads on a moving pointer and averages on a slow one, and that is inherent.** Sweep quickly and
`spot_trail_3` grades yellow, through cyan, to magenta along the tail. Drag slowly and every stamp sits on
roughly the same spot, so the three average to a pale green-white glow. Nothing about the color scheme
causes that — at the pool's width, stamps laid a frame apart at walking pace are simply on top of each
other, and any scheme would average there. The way out is narrower stamps or wider spacing, both of which
the user has already ruled out for this family.

**The head is `spot_1`'s pool tightened, and that is a departure worth naming.** The flares share one
broad source by the user's instruction, and the recorded cost of it is that the pool floods a third of the
surface. In a sample whose subject is the trail, that cost is fatal rather than merely visible — the first
build was a yellow flood with the tail lost inside it. So `POOL_SCALE` is 0.8 rather than 1.5 and the falloff
stop is 30 rather than 40, which is exactly the "revert to the tighter source" the flare entry describes.
The instruction it bends was about the flares, so the shared pool is untouched everywhere else; if the user
would rather this one match its siblings, the two constants at the top of the file are the whole change.

**`SVGAnimations.Gradient.cycleSmoothColors` does the same job for the timed samples and cannot do it
here.** It emits a SMIL `animate` on each stop's `stop-color` with the colors as its `values` list, and the
browser blends between them — which is exactly what the `fill_…` samples use and exactly what the head of a
`c` sample wants. **It was not consulted when these were built, which was a miss**; the answer would still
have come out the same, but by argument rather than by luck. Three things rule it out.

**The payload having no clock is not the reason, and claiming it was is wrong.** `SVGAnimationDefs` is a
duration and an optional iteration pattern, and a `c` sample already invents its own period in `CYCLE_MS` —
so it could build that object locally and hand it over without the payload gaining a field. A tracked sample
having no consumer-set clock does not mean it has no clock; these ones plainly do, which is how they cycle
at all.

**The reason is that the head and its stamps have to read one clock.** A stamp takes whatever color the
head was showing at the instant it was born and keeps it for its whole life. That needs the blend as a
number in JavaScript at a known timestamp, and SMIL gives neither: it drives an attribute forward over time,
nothing can ask it what value it held three hundred milliseconds ago, and nothing can freeze one element at
another's current one. Driving the head with `cycleSmoothColors` and the stamps with `getCycleColor` would
be two timelines — SMIL's starts when its element is created, `getCycleColor` reads `performance.now()` —
so the stamps would freeze colors the head never showed.

**Where it would work is a tracked sample that cycles and leaves nothing behind.** A color-cycling `band_1`
or `hand_1` has no stamps to agree with, so `cycleSmoothColors` would drive it with no frame clock at all
and less code than any of this. That is the shape to reach for if one is ever wanted.

**The `c` treatment applies to every trail, smear included.** `spot_smear_2c` and `spot_smear_3c` are the
stretched stamps taking their color from the clock instead of from their own age, which needed nothing
beyond the swap the other pairs make: the cycle reads a stamp's `bornMs`, and a smeared stamp has one.

**The `c` variants are the other answer to the same question, and both are kept.** `spot_trail_3` colors a
stamp by how old it is, so the gradient from head to tail stands still while the trail moves through it.
`spot_trail_2c` and `spot_trail_3c` color the **head** from the wall clock — one second to run through the
colors in the list — and a stamp simply keeps whatever color the head had at the moment it was born. So a
stamp never changes color again, and the color marches backwards along the trail rather than sitting at
fixed distances from the pointer. The user's suggestion, and it was tried after the age-based one on their
instruction. `spot_ripple_2c` and `spot_ripple_3c` are the same idea in the other family: the source cycles,
and a ring keeps the source's color from the instant it left it.

**Neither the head nor a stamp is told the color by the other, which is what keeps them agreeing.** One
function maps a millisecond to a color key. The head asks it about `clock.getFrameMs()`, a stamp asks it
about the `bornMs` it already stores, and because both read the same clock the stamp is provably wearing the
head's color from its own birth instant. Nothing is passed between the layers, which is the same property
the round-robin arithmetic buys everywhere else in this family.

**This is the one sample where the clock has to run with the pointer standing still, and that is a real
cost.** Everywhere else in the family a motionless pointer means a motionless picture, which is what lets
the loop stop — see _"a stamp is only written while the pointer is actually moving"_. Here the head cycles
whether or not anything moves, so `keepAwake` is called on the fade rather than on the movement, and the
loop runs at frame rate for as long as the pointer is over the element. The stamp gate is untouched and still
requires movement, so the pulse that gating fixed cannot come back — a still pointer keeps a running clock
but lays nothing down.

**The cycle is a blend rather than three steps, and that is what `Color.interpolate` was added for.** The
first build picked whichever third of the second the clock was in and used that color whole, so the head
jumped between the three. The user asked whether it could actually cycle, and then that the blending live in
`colorUtils` rather than in the sample. So `Color` grew an `interpolate` on every space it already had a
`toCss` for, and the sample walks a position through the color list, takes the two colors either side of
it, and asks for the blend between them.

**It interpolates through the channels rather than around the hue circle, and that is the user's choice
between two looks rather than a default.** Picture the palette on a color wheel, the three colors evenly
spaced around the rim. `Color.Hex.interpolate` blends red, green and blue, which is a chord straight across
the wheel — and the middle of the wheel is gray, so the halfway point is a milky version of the two ends
rather than a color of its own. `Color.HSL.interpolate` moves the hue itself, which is an arc along the rim,
so it passes through everything between the two ends at full strength: vivid green between yellow and cyan,
vivid blue between cyan and magenta, vivid red between magenta and yellow.

**The arc was built first and the chord is what shipped, on the user's call.** The reasoning for the arc
was that a chord makes two saturated colors "meet at a duller mixture", which is true and turned out to be
the point: with the chord, only the three palette colors ever assert themselves and the transitions are
quiet fades through nothing in particular, which is the character the effect wanted. **Their reason for
preferring it is about the palette, and that is the part worth keeping.** The three defaults are 120° apart
on the wheel, so an arc between them covers the entire circle — the cycle stops being three colors pulsing
and becomes a rainbow, which buries the palette the Border Colors knobs are there to set. A palette of three
neighboring hues would arc without ever looking like a rainbow, so this is not a finding about hue
interpolation being wrong; it is a finding about this palette. Do not swap it back as a correction. **Swapping back is one line in each of the four `c` files** —
`Color.HSL.toCss(Color.HSL.interpolate(Color.Hex.toHsl(from), Color.Hex.toHsl(to), ratio))` in place of
`Color.Hex.interpolate(from, to, ratio)`. Both functions exist and each says in its own documentation what
the other is for, which is why the swap costs a line.

**Blending needs the colors as hex, and that is a real limit rather than a hidden one.** `SVGDefsColors`
holds plain strings, and every other sample treats them as opaque and hands them to relative color syntax,
which accepts any CSS color. Blending in JavaScript needs the numbers, so `getCycleColor` guards with
`Color.Hex.isHex` and falls back to the unblended color when either end is not hex. The Playground's color
picker emits hex and `SAMPLE_COLORS` are hex, so the blend runs in practice; a consumer passing `oklch(…)`
gets the stepping behavior rather than a broken gradient. Tightening `SVGDefsColors` to `Color.Hex` would
remove the guard and was not done — it would ripple through `GlassDefs` and every consumer for the benefit
of four samples.

**What it looks like, and the one knob.** The head sweeps continuously — parked in the middle it moves
yellow, teal, dull gold and back — and the trail carries the sweep along its length. The hard band seams the
stepped build had are gone entirely, because neighboring stamps now differ by one frame's worth of blend
rather than by a whole color. `CYCLE_MS` is the lever: shorten it to fit more of the cycle inside one
trail, at the cost of the head cycling faster than is comfortable to watch.

**The `smear` trails stretch each stamp along the way the pointer was going, and they are the answer to
the soft-glow limit.** Everywhere else in the family a stamp is a circle, and the recorded cost of matching the
head's width is that consecutive circles overlap into a soft comet glow rather than a defined tail. A circle
cannot express motion; an ellipse can. So a stamp stores the heading it was born on and a stretch factor,
and hands both to the new `aspect` and `angle`, with the perpendicular axis divided by the same factor so
the stamp keeps roughly its area and genuinely thins rather than simply growing. Dragged straight across the
surface it draws a long thin streak where `spot_trail_3` draws a round blob, which is the whole difference and it
is not subtle.

**Speed is measured as a smoothed average, not as one frame's displacement, and the first build got this
wrong.** The stretch wants to know how fast the pointer is going, and the obvious source — how far it moved
since the previous frame — is far too spiky: pointer events do not arrive on every frame, so the reading
alternates between a full step and zero, and a stamp born on a zero frame got no stretch at all. Each slot
therefore keeps a running average, pulled toward the latest step by `SMEAR_SMOOTHING` each frame, which
averages over about five frames and falls back toward zero when the pointer stops. The zero frames are part
of the average rather than skipped, which is what makes a slow drag read as slow rather than as an
intermittent fast one.

**Speed drives shape here and must not be pointed at extent.** Pointing it at a stamp's lifetime — so a
flick leaves a long tail and a slow drag a stub — was tried and does not read: at the pool's width the
difference between nine and thirty-four overlapping circles is how far a soft halo reaches, not a change of
shape. It is also redundant, which is the user's own argument and the better one: **a fast movement already
elongates the ordinary trail**, because the pointer covers more ground inside the same lifetime, so a knob
for it buys nothing. The stretch is where the same input pays off, and it pays immediately.

### The ripples are a wake rather than a highlight, and they spawn on distance rather than on time

**What it draws.** A small bright source under the pointer, and twelve rings, each born at a point the
pointer passed through and then expanding outward from that point while fading. Drag across the surface and
a wake of widening circles is left behind; hold still and only the source remains. It is the second sample
built on frozen positions, and the reason is sharper here than in the trail: water does not follow a finger,
so a ripple that tracked the pointer would not be a ripple at all.

**The spawn rule is accumulated distance, not elapsed time, and that is the whole difference from the
trail.** Each layer adds up how far the pointer's `boxRatio` has traveled and owns the milestones where
`Math.floor(travel / RIPPLE_SPACING_RATIO) % RIPPLE_COUNT` equals its own index. So rings are spaced evenly
**along the path** whatever the speed — a slow drag leaves two or three large ones, a fast sweep leaves a
dozen — where a clock would bunch them up when the pointer slowed and string them out when it hurried. It
also makes the motion gate free: no travel means no new milestone, so a still pointer cannot spawn anything
and the pulse the trail had to be corrected for was never possible here.

**Round-robin with no shared object, the same trick as the trail's clock phase.** Every layer runs its own
`PointerTracker`, but they all read one global pointer position flushed on one animation frame against one
element rect, so the travel each of them accumulates is the same number. That is what lets the modulo decide
ownership: twelve independent layers agree on whose turn it is without anything passing between them. The
milestone a layer was born at is a plain local, so re-entering the same milestone cannot re-fire it.

**A ripple starts at the source's own size, not at a point.** `RIPPLE_START_SCALE` is defined as
`SOURCE_SCALE` rather than as a number of its own, so the relationship survives a tweak to either. The first
build started them at 0.08 — much smaller than the source — and the rings appeared to be born inside it and
then punch out through it, which read as two unrelated things happening at the same place. Starting at the
source's edge instead makes the ring look like the source expanding, which is what a ripple is: the
disturbance leaves the thing that caused it.

**The crest keeps its thickness as the ring grows, which is one lerp rather than a second gradient.** A
radial gradient's stops are fractions of its own radius, so a fixed annulus gets absolutely fatter as the
ring expands and reads as a spreading smear instead of a wave. The stops are therefore a peak at
`CREST_STOP` with a spread either side that shrinks from `CREST_SPREAD_START` to `CREST_SPREAD_END` over the
ripple's life, roughly canceling the tenfold growth in radius. The outer shoulder is capped just under 100
so it cannot collide with the final stop.

**Expansion is `easeOutCubic` and the fade is a power curve, deliberately not the same function.** The ring
should leap out and then slow, which is the easing; its brightness should hold for a moment and then go,
which the exponent does. Tying both to one curve made the ring fade before it had finished growing.

**The color cycles by slot, and this is the family where that works.** `spot_ripple_1` paints every crest in
`primary`; `spot_ripple_2` alternates `primary` and `secondary`, `spot_ripple_3` runs all three, in each case by
`index % CREST_COLOR_KEYS.length`. Because the slots take their turns in order, consecutive rings carry
consecutive colors, and because the crests are thin and spaced a spacing-ratio apart they hardly overlap —
so each ring reads as its own color rather than averaging with its neighbors. The source stays `primary`
in all three, which is why the trailing number is still a straight color count: two colors on the surface
is a `_2`, three is a `_3`. The trails cannot cycle by slot — their stamps overlap far too much for it — and
cycle by age instead, recorded under _"the color follows the stamp's age"_ above. `spot_ripple_2c` and
`spot_ripple_3c` are the third option: the source blends continuously and each ring keeps the color the
source had when it was born, so the wake grades along the path rather than repeating a fixed sequence.
**The `c` variants pay for it with a clock that runs at rest**, because a cycling source animates whether
or not the pointer moves — the same trade the trails' `c` variants make, and the reason the plain
`ripple_…` three keep the loop that stops.

### Every ripple had a banded twin, and they were deleted

**Five keys went: `spot_ripple_1s`, `_2s`, `_3s`, `_2cs` and `_3cs`.** The user's call — they never liked
them much. What they were: one prop, `spreadKind: "banded"`, emits each stop twice so the colors meet at a
hard edge, which turned the soft crests into hard-edged solid rings and the wake into something closer to
sonar or a contour map. The reasoning for the suffix rather than an invented `ripple_band_3` was sound and
still is — a trailing `s` already meant exactly that — and it is why `flow` keeps its banded set. The look
was the thing that did not earn its keep.

**What went with them.** The tracked registry now has no `s` at all, so the `TrackedGradients` description
in `App.tsx` lost the clause promising one, and the worked example for _"suffix letters stack"_ moved to
`flow_3cs`. Nothing else pointed at the five.

**The trails never had banded twins, and that is unchanged.**

A trail's stamps are the head's own four-stop pool, whose whole job is to fall off softly; banding it would
produce hard-edged discs, which is a different effect wearing the same suffix rather than the same effect
laid down solid.

**A ring can be recycled before it has finished, and the numbers are chosen to make that rare rather than
impossible.** Twelve slots at 0.15 of the box apart means a full recycle takes 1.8 box-widths of travel; at
a brisk drag that is a little longer than the 700ms lifetime, so a slot is normally dead before its turn
comes round again. Push the pointer faster than that and a half-grown ring will snap back to the center. The
fix if it ever matters is more slots, not a longer spacing — spacing is what makes the wake read.
