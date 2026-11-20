# Decisions: `Dismisser`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### An Escape something already answered does not also close the layer above it

A Table carry canceled inside a `Modal`, or Escape handing focus back out of the Toasts region, used to close the
Modal too, because the stack's document listener ignored whether the key had been used. **The stack now skips an
Escape whose default is prevented (`getIsUnansweredEscape`), and every handler that uses Escape for its own purpose
calls `preventDefault`** — only when it did something, so an Escape with nothing to cancel still reaches the stack
(`CornerPin` gained the call). A handler on the document must run before the stack: `TableUtils.observeCarryCancel`
listens in the capture phase; handlers on elements already run first. Solid's delegated handlers sit on the document
too and still run first, because the stack removes its listener when the last layer closes and adds it again when one
opens.
