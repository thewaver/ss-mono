# Decisions: `RichText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `RichText`: a tag name is what you could write after a dot in JavaScript

The parser used to accept letters and nothing else, so `[tag1]` and `[h1]` were not tags — they came out as
the characters they were typed as. The user asked for digits, and for the widest set that still makes sense,
which raised the question the answer is easy to get wrong: **an object key is not a limit.** Every property
key in JavaScript is a string, so `""`, `"hello world"` and `"[b]"` are all valid keys, and the class map
here is a `Record<string, string>` that would take any of them. Nothing about the map constrains the syntax.

What does constrain it is that the text around a tag is ordinary prose, and prose contains square brackets.
So the rule chosen is the **identifier** rule — the subset JavaScript itself accepts after a dot: a letter or
an underscore first, then letters, digits and underscores. `[tag1]`, `[h1]` and `[my_tag]` are tags;
`[123]`, `[b-c]`, `[$5]` and `[2024-01]` are not, and pass through as text.

**The hyphen is the interesting exclusion**, because a markup vocabulary would usually take one. It is out
for the same reason it is out of an identifier, and the practical benefit is that a date-shaped or
reference-shaped bracket in someone's text cannot become a tag. `$` is out too, despite being legal in an
identifier, because `[$5]` is a plausible thing to have written on purpose.

**What was already decided and is unchanged:** tags are found case-insensitively and matched
case-sensitively, so `[B]bold[/B]` is recognized as a tag, finds no class under `"B"` and prints its own
brackets. Both halves are pinned by name in `RichText.utils.test.ts`, as is the exclusion of `[123]` and
`[b-c]`.

### `RichText`: the class map is handed over whole, and the diff example is what proves it

`computeClassNames` is given the library's own map and returns the one to paint with, so a consumer choosing
to keep the defaults spreads them and a consumer choosing to replace them simply does not. That is the whole
contract, and the shape it takes was never visible from the page until an example reached the prop: the page
took the defaults, so a map that failed to arrive at all would have looked identical.

**The example that reaches it is an inline diff**, over two tags the library has never heard of — `[add]` and
`[sub]`. A diff is the case that makes the argument on its own: nobody would expect a component to ship an
insertion or a deletion color, the two tags are obviously the page's rather than the library's, and the
sentence being diffed can carry a `[b]` inside an `[add]` to show that the default map came through the same
call unchanged. The tags are named after what they mark rather than after what they look like, which is why
they are not `green` and `red`.

**How the two runs are drawn is the user's, and the spec does not touch it.** The correction that fixed this
file: the first version struck the deletion through and underlined the insertion, argued it from WCAG 1.4.1
Use of Color, and wrote both into `richText.spec.ts`. The user removed the underline, and the spec went red —
which is the failure mode to learn from, because nothing was broken. A spec that pins the decoration or the
color of a Playground run has made the user's own styling a thing they cannot change without a red run, and
the paint on that page is theirs. The grounds are `success.dark` and `error.dark` with each family's own
`contrast` for the text, under the rule that a container changing its own background owns the color of the
text inside it; beyond that, nothing here states what the diff must look like.

**`richText.spec.ts` reads no computed style at all, and that is the general rule rather than a quirk of this
page** — see _"An assertion reads the mapping, not the value"_ below. What `computeClassNames` promises is a
lookup: a tag comes back carrying the class it was mapped to. So the legend's check is that all five default
tags reach a class and that no two reach the same one; the diff's is that `[add]` and `[sub]` reach classes of
their own; and the check that the defaults survived the page's spread is that the `[b]` inside an `[add]` run
carries **the same class** as the `[b]` in the legend. Not one of those says what a class draws, so all of them
survive a restyle on either side.

### `RichText`: attributes are the consumer's to allow, and a bracket that asks for one it was not given is prose

**A tag takes an attribute only where `allowedAttributes` lists that name for that tag, and anything else is text.** The markup lives in ordinary copy, and ordinary copy has brackets in it. A parser that took any `key="value"` would turn `[note ref="12"]` in someone's sentence into an element nobody asked for. So the allowed list decides whether a bracket is markup at all, not only which attributes survive: an opening tag with an attribute it was not allowed prints exactly as typed, and its closing tag, with nothing left to close, prints too. The same goes for the same attribute given twice. This is the existing rule, that malformed markup comes back as the text it was written as, carried one step further.

**The syntax is kept narrow on purpose.** `key="value"` in double quotes, each attribute after one or more spaces, nothing either side of the `=`, and nothing between the last value and the `]`. Attribute names follow the identifier rule that tag names already follow. Inside a value, `\"` is a quote and `\\` a backslash. Any other backslash is kept as written, so a path such as `C:\files` survives without doubling. A `]` needs no escaping, so a tip can mention `[b]`. Each extra form allowed (single quotes, unquoted values, spaces around `=`) is one more way for prose to be read as markup, and none of them was needed.

**The library writes no attribute onto any element.** The values reach `renderTag` exactly as parsed and unchecked, and whatever renders them decides what a value is allowed to become. A link's address is the case that matters: the Links example accepts only `https:`, root-relative and `#` addresses, and hands anything else back to the fallback, so a `javascript:` link prints as typed. Checking that inside the library would mean the library knowing what every attribute means.

**The tag node keeps its opening markup as typed.** An unclosed tag, or one that nothing draws, is printed back, and with attributes involved, rebuilding it from the parsed values would lose the spacing and undo escapes. So the node carries `openingMarkup` beside `attributes`.

**Both lookups ignore names every JavaScript object has built in.** A tag named `constructor` or `toString` would otherwise find a built-in function in the class map and in the allowed list. Both lookups ask whether the key is one the consumer actually wrote.

### `RichText`: `renderTag` comes before the class map, and `undefined` is how it passes

**`renderTag(tag, renderChildren, attributes)` is asked first. An element is drawn; `undefined` hands the tag to the class map and then to the unknown-tag handling; `null` draws nothing.** Solid's `JSX.Element` already includes `undefined`, so the two answers can be told apart without another type. The children arrive as a function rather than as rendered nodes, so a renderer that wraps them (a tooltip anchor, a link) decides where they go, and calling it sends the nested tags through the same `renderTag` and class map. The attributes come third, so the two-argument form in the verdict still reads naturally for a renderer that uses none.

### `RichText`: the parser is linear and never recurses, and `maxDepth` guards the renderer

An outside review measured two ways a string could hurt the page (OWASP's denial-of-service guidance, CWE-400 and
CWE-674): a run of closing tags matching nothing searched back through every open tag, so the work grew with the square
of the length — 4 seconds at 280 KB — and turning thousands of unclosed tags back into text called itself once per
level until the call stack ran out. **Both are fixed in the parser without a choice to make**: a count of open tag names
answers a closing tag nobody opened at once, and the write-back walks with an explicit stack.

**The renderer is a different matter, and the limit there is a prop.** Every framework draws a nested tag by drawing its
children, one call per level, so a correctly nested tree thousands deep exhausts the stack however the parser behaves.
The only guard is a cap on depth, and the user chose to make it the consumer's: `maxDepth`, a tag at the top level
sitting at depth `1`, and a tag that would sit deeper is printed as typed — the rule every other malformed tag already
follows. **It defaults to `Infinity`**, following `CellAnimation`'s `animationIterationCount`, which is where the library
already says "no limit" with a number; the Playground's knob, which cannot hold `Infinity`, uses `-1` and converts, as
that page's does. Copy the consumer wrote needs no cap; content from somewhere untrusted should be given one.

### Docs prose: prop names and WCAG criteria are marked, through `RichText` tags and the API builder

Intros (`MenuDescriptions.const.ts`) and section text stay strings carrying two `RichText` tags, as `backlog.md`'s item
recorded: `[prop]onInput[/prop]`, drawn with `docsPropName`, and `[wcag id="2.5.7"]WCAG 2.5.7[/wcag]`, a link to
`WCAG_URLS[id]`. The wiring is `PageDocsProse` (each Playground) over the shared `DocsProse/` folder: the allowed
attributes, the class map adding `prop`, and `toWcagHref`, which looks the id up as an own key. `WCAG_URLS` moved there
from `DocsAlert`, since prose uses it now. `PageDocsSection` takes its text as a `content` string, declared once in the shared
`BasePageDocsSectionValues` — not as children, which Vue and Svelte cannot type as a string — and the Docs view draws
the intro through it. Alert and info boxes keep markup and wrap prop names in `docsPropName` themselves. A prop is marked
where the text names the prop itself (`Set [prop]side[/prop] to choose…`), not where an ordinary word happens to match
one ("the placement vocabulary"); a component's or namespace's name is never marked. Two alert sentences that opened
with a prop name were reworded on the way, under _"A docs section's text never opens with a prop name"_.

**The API tables get parts, not tagged strings.** `componentApiBuild.ts` hands each description over as `ApiText`, an
array of text, prop and link parts, and the API view draws them. Tags were rejected for this column because a
documentation block can quote markup — `RichText`'s own docs show `[a href="…"]` — and the renderer would have parsed
it. **A backticked name becomes a prop part only if it names an entry in one of that page's own tables**, leaving out
the component list and the type-alias table, so `` `filter` `` meaning the CSS property, `` `div` `` and a component's
name stay plain; anything else keeps its backticks as before. `{@link Name}` shows as `` `Name` `` and is marked the
same way.

**A criterion in a documentation block is written `{@link https://www.w3.org/WAI/WCAG22/Understanding/<slug>.html WCAG
2.5.7}`, and the whole tag stays on one line**: TypeScript ends a link's text at the line break, so a wrapped link
loses its closing words. Console warnings naming a criterion are left as plain text, as the item scoped them.
