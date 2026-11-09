---
paths:
    - "components/src/**"
    - "components-solid/src/**"
    - "components-react/src/**"
    - "components-vue/src/**"
    - "components-svelte/src/**"
    - "playground/src/**"
    - "playground-solid/src/**"
    - "playground-react/src/**"
    - "playground-vue/src/**"
    - "playground-svelte/src/**"
---

# Conventions: general coding traps

Mistakes that fail silently in ordinary code. The library-wide rules are in `conventions.md`.

### A key from outside the code is looked up as an object's own key

Every plain object inherits `constructor`, `toString` and the rest, so `table[name]` with a `name` from a person,
from content or from a consumer finds a built-in function when the name is `constructor`. **Check
`Object.hasOwn(table, name)` before reading.**

### A sort comparator answers every pair consistently, so sort only once every item can be compared

Given an inconsistent comparator, `Array.prototype.sort` may return any order, the reverse included. The usual
cause is answering "equal" for an item that lacks what the comparison needs, such as an element not yet mounted.
**Sort only once every item can be compared, and keep arrival order until then.** The fault hides wherever the
next render recovers, and shows the moment the order decides something that does not.

### Word boundaries in text are found with Unicode letter classes, never `\b`

`\b` knows only ASCII word characters, with or without the `u` flag, so capitalizing after a boundary turns
"état" into "éTat". Use property classes under `u` — a letter with no letter or digit before it is
`(?<![\p{L}\p{N}])\p{L}`. It matches `\b` on ASCII and keeps every other script intact.

### Code imported for behavior never imports a string-keyed table of variants

Tree-shaking — the bundler dropping imported code nobody uses — cannot see through a table looked up by string
(`{ line: lineFn, spiral: spiralFn }`), so it keeps every entry, however many files they are split across.
**The machinery takes the variant itself; the table is a separate export**, imported only by code that really
holds a name at run time — a dropdown, a saved setting — and a convenience call taking a name lives beside it.
**A TypeScript `namespace` compiles to one object and is all-or-nothing the same way**: a fine home for machinery
used together, the wrong one for variants chosen from.
