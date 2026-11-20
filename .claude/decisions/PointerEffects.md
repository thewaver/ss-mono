# Decisions: `PointerEffects`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Exotics/PointerEffects`: three wrappers that restyle their content by where the pointer is

`Tilter`, `ShadowCaster` and `LightCatcher` are one family and now sit in one folder, in the library and in
the Playground's tree. Each wraps arbitrary content, reads the pointer against its own box, and changes one
thing about how that content looks: it leans, it throws a shadow, or it brightens. `RGBSplitter` was the fourth
until the user made it a looping animation, `RGBAnimation`, in `Exotics/Animations`; see its own entry.

**The name was chosen over `Responders` and `Surfaces`, and its cost was known.** `Responders` reads better in
the tree — a plural agent noun beside three agent nouns — but says nothing about the pointer, and most of the
library responds to something. `Surfaces` would have looked like a folder for `Surface` and `GlassSurface`,
which live in `Composites`. The user took `PointerEffects` for being unambiguous about what is inside, and
**the cost is that "effect" now means two things**: a function from measurements to CSS values in `Proximity`
and in `Wheel`'s `computeEffect`, and a component here. Worth knowing before a fourth thing is called one.

**What makes them a family is the shape they share, not the folder.** All three take the pointer's distance
against their own box, turn it into a strength that is full while the pointer is on the content and fades to
nothing at a stated range, and spend that strength on exactly one visual property. Any fourth one belongs
here if it can be described that way and does not otherwise.

**Each builds its own tracker, and that is the accepted cost of the shape.** Compositing two of them over one
element runs two trackers over the same box. The user weighed this when choosing three small components over
one general wrapper taking an effect function, and recorded the direction the fix would take: a shared tracker
passed in, with each component making its own when none is given, the way ids already work. Nothing has been
built for it.
