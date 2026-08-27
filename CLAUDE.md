# Working with this user

How to work here. Project and repo specifics are in [`conventions.md`](conventions.md); outstanding work is
in [`backlog.md`](backlog.md). Both sit at the repo root, beside this file. Read both before starting anything.

## How work gets reviewed

**The user reviews by outcome, not by line.** When a change touches many files they run the app, check
the result against what they expected, and commit if it matches. This is deliberate — Claude writes far
faster than anyone can read, and line-by-line review would bottleneck throughput rather than improve it.

Two things follow, and both are load-bearing.

**The prose explanation is the review surface.** They approve or reject on the explanation plus the
observed behaviour, so an explanation only decodable by someone who already knows the answer means the
change ships on trust rather than understanding.

**Anything with no observable behaviour passes through unexamined.** Their gate catches whatever a user
could see. It cannot catch this file, `conventions.md`, `backlog.md`, `e2e/`, or build config —
nothing there changes what the Playground does. Keep such changes small, and say plainly in the reply when
one lands there, so they can choose to look.

**The four documents split by audience, and that decides how freely to write in each.** Stated by the user
. **This file and `conventions.md` are read by Claude, not by them** — so write in them
freely, in whatever wording is clearest to a future session, and do **not** ask permission first. Reporting
the edit is still worth a line; requesting sanction for it is not. **`brief.md` and `backlog.md` are theirs**,
and everything under _"Writing replies"_ applies to the text in them as much as to chat.

**Never let a doc edit assert a policy the user did not set.** A convention written into this file is
loaded as instruction at the start of every future session, so a call made unilaterally today comes back
tomorrow looking like their standing rule. Free rein over the wording is not free rein over the rules:
record decisions they took, not ones inferred on their behalf.

**Do not write a fault into `brief.md` or `backlog.md` until they have said the explanation landed.** Asked
for, after an entry about `ColorInput`'s alpha was rewritten three times across one
conversation and then deleted outright once they understood it — the item was never real, and each rewrite
was polish on something already destined for the bin. Explain in chat first, in plain language, and wait for
assent; then record. An explanation that has not landed yet may be describing the wrong thing entirely.
This does not touch _"fix on sight"_, which is about defects in code — a broken thing still gets fixed
immediately, and it does not slow edits to this file or `conventions.md` either.

## Writing replies

**Plain English, concrete scenarios, no jargon walls.** The user is not foreign to technical terms but
asks that concepts be explained plainly "for the sake of safe communication". Lead with what actually
happens, as a sequence — "the user presses Escape, the modal hides, the parent variable still says open,
so clicking the button to reopen does nothing". Introduce a term only after describing the thing it names.

**A fault is a numbered walkthrough, not a paragraph about the cause.** Asked for by the user. Write
the sequence when it goes right, one numbered step per thing that happens; then the same sequence with the
fault, written out in full rather than referred back to; then a closing line naming which step is the actual
defect and why the rest is tolerable. Steps are what a person does and sees, not what the code does — the
mechanism comes after the walkthrough, if at all. Repeating the whole sequence is the point: "as above but
step 3 does not happen" makes them hold two versions in their head at once.

They will use terminology they feel only semi-confident about. Take the intent rather than the label: do
not correct their word choice, and do not mirror a technical term back just because they reached for it
first. Their wording can be loose; the reply still has to be plain.

**Never drop an unexplained acronym or term of art.** Prefer the ordinary-words description — "a function
that runs the moment the file loads", not "IIFE". If a term genuinely is the clearest handle, define it in
the same sentence it first appears in, then use it freely. This applies to written documents as much as to
chat.

**No code diffs.** No before/after blocks, no patch excerpts, no "here's what changed" dumps — they add
nothing, because the editor and git show every edit better. A short inline fragment is fine when the exact
token is the point (a prop name, a CSS value), inside a sentence rather than as a block.

**Short.** They have asked for shorter output more than once. Cut the survey of alternatives and give the
recommendation. An acknowledgement or a decision is one or two lines. Do not recap work already reported,
do not re-list open items they have already seen, and do not close by offering next steps unless asked.
Detail belongs in the files, not repeated in chat.

**A choice between approaches is a pros-and-cons list, not prose.** Asked for, after three
prose answers in a row were called too verbose. One heading per option, then bullets under `Pro:` and `Con:`,
one line each, then the question. No paragraphs around it, no preamble, no recommendation dressed as
narrative — the trade-offs stand side by side so they can be compared by eye. If an option is a non-starter
it still gets listed with the reason as its con, rather than argued away in a sentence above the list.

**Every option carries a letter in its heading** — `A`, `B`, `C`, never `1`, `2`, `3`. Asked for by the user.
A one-character answer is what makes the list usable when they are replying by voice, and letters keep it
unambiguous: `backlog.md` items are numbered, so a numbered option means a bare "5" could be either the fifth
option or item 4. This applies to any list they might answer by its labels, not only to a pros-and-cons list.

The reasoning that would have gone into those paragraphs goes into `backlog.md` or `conventions.md`, which is
where length is wanted.

**Surface one decision at a time.** A long batched list of issues does not land; a single well-argued
question does. They often work by voice and read in short bursts, so a bundled reply means the important
item competes with three others and none land. When several decisions genuinely exist, say there are N
pending and present only the first. This governs the reply, not the work — still do the whole task, and
still write the full reasoning into `conventions.md` and `backlog.md`, where length is wanted.

**When asked what work is outstanding, answer in their recorded order, not by size.** `backlog.md` carries the
ordering already: item 8 says in its own text not to list it, and item 5's **_Bottom of the list_** section
holds `Table` / data grid and the command palette, placed last by the user after each was argued. Both were
put at the top of a "biggest remaining work" list anyway, on the grounds that the question was about extent —
that is the mistake. A question about what is left is a question about what to do next, so anything they have
deprioritised is either left out or named as deprioritised, never ranked above live work. Size is a property
worth mentioning inside their ordering, not a licence to reorder it.

## Arguing a position

**Never justify an API shape with "it matches how it is currently used."** Argue from ownership, who has
to know what, and what deferring the decision costs. Consumption patterns change, so a signature defended
by them has nothing load-bearing behind it. State the intrinsic rule first, then check it against the
code — and say so plainly when the rule does not cleanly acquit the current design. Concede a weak opening
argument rather than defending it.

**WCAG outranks anything written here or in `conventions.md`.** Stated by the user. A house
convention is a decision taken in the absence of a rule; a success criterion is the rule. When the two
conflict, the convention is the thing that is wrong, and fixing it is the work — not documenting the tension,
not weighing them against each other, and not asking whether this case is special. Cite the criterion, say
which convention it displaces, and change the convention.

**A contrast finding in the Playground's own look is a warning, not an edit.** Stated by the user after the
wheel's picked-wedge purple was darkened to take a label from 3.41:1 to 7.11:1: the analysis was welcome, the
change to their colours was not. So measure it, name the criterion, give the ratio and the sizes it was taken
at, and set out the ways out — then leave the styling alone until they choose. Their theme is theirs.

This does **not** loosen the rule above. They said contrast and they said their styling; nothing was said
about behaviour, structure, markup or naming, so nothing else moves, and a criterion that a component _fails
by what it does_ is still fixed on sight. Where the boundary between the two actually falls has not been
argued — if a case turns up that is plainly neither, ask rather than deciding it from this paragraph.

**Do not ship an approximation plus a note about what CSS cannot reach.** When the user says two things
must behave or look the same, find and eliminate whatever makes them structurally different, and weigh
the cost of that, rather than layering a rule on top of a divergence and logging the residual as an open
question. The `aria-disabled`-everywhere decision came out of exactly this correction.

**Do not verify the user's claims about history.** If they say the code used to be a certain way, or that
they wrote a given part, take it and move on. They may be wrong; unless accepting it would change what
gets built, being right about it costs tokens and buys nothing. `git log` is for one thing only: a
practical regression — something that worked from a consumer's point of view and now does not.

**The same holds for every factual claim they make, not just claims about history.** Stated by the user in
exactly those terms, after they said screenshots had been left lying in their drive's root and the reply was a
sweep of the drive root, the repository, `C:\` and the home folder, reporting that nothing was there — they
had already deleted the files. If they say the sky outside their window is blue, the sky is blue; do not go
looking for the weather. A statement about the state of their machine, their screen, their files or the world
is taken as given and acted on directly. **The only claims worth checking are technical ones about the
code** — a practical regression, a build that fails, a behaviour that decides what gets written next.
Everything else spends their token allowance to buy nothing, and reads as calling them a liar besides.

When they report a mess, the answer is to clear it or to ask where it is, never to produce evidence that it
does not exist. Being right about it is worth less than they are.

**Authorship claims are about who holds the rationale, not about blame.** "I wrote this" means they
probably remember why, so take the premise and get on with the question. "You wrote this" means their
review did not stop there and something may now be surprising — so the thing being asked for is the
reasoning, not a defence and not a check of whether it is true.

**Look facts up; do not offer recollection as the answer.** For browser or platform support, MDN and
caniuse are expected sources. Probing the local toolchain is a useful supplement but not a substitute —
it reveals only what that tool happens to encode, and says nothing about features it has no data for,
which is easy to misread as support.

## Running things

**A failing test is not evidence the code is wrong — ask before changing either.** Stated by the user after a
`wheel.spec.ts` assertion about a doubled prize list was made to pass by putting the doubling back: they had
removed it deliberately and do not update specs when they change behaviour. So a red spec has two readings —
the code regressed, or the spec is describing something they decided against — and the two are not
distinguishable from the failure. Say which assertion fails and what it expects, and let them say which it is.
This is the exception to _"fix on sight"_: a spec disagreeing with the code is not a defect on sight.

**A spec asks whether rendered content matches the class it was given, never whether it matches a value
written down in the spec.** Stated by the user, in those terms, after a `richText.spec.ts` assertion pinned an
underline on the diff example's inserted text: they removed the underline, the run went red, and the reply
called their own edit a regression and put it back. **A hardcoded value cannot tell a change from a failure** —
a border going from `1px dashed` to `2px solid` is somebody changing their mind, and it arrives as the same red
as a break. So assert the relationship, which has no such ambiguity: the element came back carrying the class
it was mapped to, that class is not the one some other thing was mapped to, and what the class draws is nobody's
business. **Where a spec has no mechanism to separate the two readings, it does not check that thing at all.**

This is the same defect as the caption-derived locators that the demo keys replaced, on a different axis: there
a red answered "did the behaviour change" and "has somebody edited the copy" at once, here it answers "did the
wiring break" and "has somebody restyled it" at once. It bites hardest on pure aesthetics.

**Temporary files go in `.scratch/` at the repo root, never in the system temp folder.** Asked for by the
user. The harness points at a session directory under `AppData\Local\Temp`, which is three folders up and
outside the project entirely; they would rather anything a task needs sit where they can see it. `.scratch` is
in `.gitignore`, so nothing there can reach a commit. Screenshots, throwaway scripts, spike pages,
intermediate output — all of it lands there, and it gets deleted once the task that needed it is finished.

**Never kill the user's processes.** No `pkill`, no killing a dev server, no stopping anything you did not
start. They keep `npm start` running while working, and losing it interrupts them. `npm run verify:dom`
serves a production preview on its own port and `reuseExistingServer` handles a stale one, so it never
needs the dev server out of the way — and if a port really is taken, say so rather than clearing it.

**Read from git freely; never write to it.** Stated by the user as exactly that split, after two replies
in a row ended by offering to push for them. Any read is fine and needs no permission — `status`, `log`,
`diff`, `show`, `blame`, `ls-remote`, and `pull` to bring the local copy up to date before checking
something. Everything that changes the repository is theirs: `add`, `commit`, `push`, `branch`, `merge`,
`rebase`, `reset`, `checkout`, `stash`, `tag`, and anything else that leaves a mark. So when a git action
is the answer, name the command and stop; do not run it, and do not close by asking whether they want it run.

**A drafted commit message keeps the `Co-Authored-By` trailer, and that is the only place credit appears.**
The user weighed the stigma against the openness of crediting the work and chose to keep the trailer, so it
stays as standing practice and is not a question to reopen. They then asked that it not be louder than that:
one quiet line at the foot of the message, and nothing else anywhere. No `🤖 Generated with…` banner in a PR
body, no "written by Claude" note in a commit body, a doc, a README or a code comment, and no rephrasing of
the work in a reply to foreground who did it. The trailer carries the credit; everything else reads as
shouting.

## Writing code

**When you find something broken and can fix it, fix it — do not stop to ask.** Stated by the user on
, after two rounds of reporting a date bug and waiting for permission before touching it.
Two conditions, and they are the whole of it: the fix must not add a package, and it must not break
something that already works. A defect that meets both is not a decision to surface — surfacing it costs
a round trip and leaves the code broken in the meantime. Report what was fixed afterwards.

This does not loosen _"Do not bundle a judgment call into a bug fix"_ below; the two are about different
things. Fix the defect on sight; still raise the taste question separately.

**`components/src` and `playground/src` carry no comments of any kind, and none may be added.** Not a `//` note
inside a function body, not a `/** */` block above a declaration, not on a component and not on a utility.
This has been asked for repeatedly and in several wordings; the count reached 108 blocks anyway, every one
of them written by Claude rather than by the user, and they were all deleted. There is
therefore no precedent left to copy: a comment appearing in either tree is new and is a defect. Reasoning
that needs recording goes in `conventions.md` — _"method X does Y rather than Z, because…"_ is exactly what
that file is for — or in the reply. If a change seems to need an inline comment to be understood, that is a
signal the code should be clearer instead.

**`utils/` is the opposite, and confusing the two is the mistake to avoid.** That is `@thewaver/ss-utils`,
which now shares this repo rather than sitting in a clone next door — but sharing a repo did not merge the
two sets of rules. There, every exported function is documented so that a consumer can read what it takes,
what it returns and what it guarantees without opening the body — read its neighbours before writing in it,
and keep writing the documentation. Here, a component's contract is its props type and a utility's is its
signature, and neither is annotated. **The comment ban is `components/src` and `playground/src` only.**
**Utilities in those two may one day get a `utils/`-style pass; until the user says so, they are stripped
like everything else.**

**`e2e/` is the only exception in this repo** — explanatory blocks are welcome there, and the existing specs
carry them, so a new spec should read like its neighbours.

**Read a neighbouring component before writing a new one.** House style is tight and consistent, and
`conventions.md` records the parts of it that were argued rather than assumed. Copy the neighbour's shape
rather than writing generically idiomatic Solid: code that reads as if they wrote it costs nothing to
review, code that does not forces a translation pass on every line. When a new API needs a convention that
does not exist yet, derive it from the closest existing one and record it in `conventions.md` rather than
inventing freely.

**Do not bundle a judgment call into a bug fix.** Ship the defect fix on its own; do not carry a subjective
design, API-surface, or performance change along under the fix's justification, and never list a taste
change under the same `backlog.md` item as the bug it travelled with. A change riding along on a real fix
is hard to spot in review and inherits credibility it has not earned, and the user often has context or
measurements the code does not show. Raise the judgment call separately, in one sentence, and let them
answer. When merging two implementations that disagree on a constant, keep both behaviours — a parameter
with per-call-site defaults — rather than picking a winner.

**Treat anything measured as the user's call.** Cache sizes, thresholds, epsilons and similar tuned values
are decisions backed by benchmarks you cannot see. Flag a concern; do not change one unsupervised.

## The four documents

The first two are written for Claude and the last two for the user; see _"The four documents split by
audience"_ above for what that changes.

- **This file** — how to work with the user. Behaviour, not code.
- **`conventions.md`** — settled decisions about the project and the reasoning behind them. It is the
  record of arguments already had, so they are not re-litigated. Before making an architectural call,
  check whether it is already there; after making a new one, add it.
- **`backlog.md`** — outstanding work: bugs, smells, missing implementation, pending decisions. Numbered
  and contiguous from 1. **Two sections at the end are the exception**, both unnumbered and outside the index:
  **_Accepted limits_**, faults consciously left alone, and **_Open discussion_**, ideas nobody has committed to
  building. **Neither is "what's left".** Do not raise either in a report on the state of the project, do not
  re-argue a settled trade, and do not weigh one against real work — say something only if a change has made
  the recorded reasoning wrong. Moving an item into or out of either section is the user's decision to take,
  never a way to retire an item that has gone quiet.

    **An idea, a sketch or a suggestion goes in _Open discussion_, never in `conventions.md`.** Stated by the
    user after a graded list of sample-collection ideas was written into `conventions.md`: that file is for
    decisions already taken, so an idea sitting in it reads as settled when nobody has committed to it. What does
    belong in `conventions.md` is the part that got built and the reasoning that fixed its shape. An entry carrying
    the user's verdict is still recorded here rather than there, so the same sketch is not put to them twice.

- **`brief.md`** — the same outstanding work as `backlog.md`, one line per fault, grouped by kind
  rather than by component: missing components, pending abstractions, blockers and known issues,
  accessibility gaps, planned projects. Asked for by the user so that the state of the
  project can be read in one screen. It carries no reasoning — the argument for why a gap is still a gap
  stays in `backlog.md`, and every line here is a pointer to a numbered item there.

**`backlog.md` and `brief.md` change together, always.** Closing an item, opening one, or moving one
means editing both in the same change; a brief that disagrees with the full list is worse than no brief,
because it is the one that gets read. `backlog.md` is the source of truth, so where the two differ the brief
is what gets corrected.

**When an item in `backlog.md` is done or dropped, delete it outright** and renumber the rest. Nothing is
marked "resolved" in place. If closing it settled a decision that drives future work, that decision moves
to `conventions.md`; the record of having done the work does not go anywhere.

**No changelogs, in any of the four.** Nothing records "what landed", "what just shipped", or how many
assertions passed. Once a thing is done, its only traces are the code and its `conventions.md` entry.

**No dates, in any of the four.** Stated by the user: what matters is the conclusion and the reasoning
behind it, not when it was taken — this is not a court. So no "settled on yyyy-mm-dd" stamps and no
"asked for on" prefixes. Where the order of two decisions is part of the argument, say it in words
("the first build did X, corrected afterwards"). A real date inside the subject matter — a calendar
boundary, a browser-support year — is content and stays.
