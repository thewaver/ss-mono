---
paths:
    - "components-solid/**"
    - "playground-solid/**"
    - "components-vue/**"
    - "playground-vue/**"
    - "components-svelte/**"
    - "playground-svelte/**"
---

# Conventions: effects that track what they read

Solid, Vue and Svelte decide what an effect depends on by noting what it reads while it runs. React does not — a `useEffect` lists its dependencies by hand — so neither rule below applies to it.

### An effect reads everything it depends on before its first early return

The framework learns what an effect depends on by noting which reactive values it reads while it runs, and it
learns nothing else. An effect that returns early before reading a value has not subscribed to that value on that
run. So if the very first run returns early — because what it waits for is not ready yet — and the value it was
going to read comes after the return, the effect never runs again, and nothing reports it. It looks like an effect
that was simply never written.

**Read every value the effect depends on at the top, then decide whether to return.** Reading into a local and
testing the local afterwards costs nothing, and the set of dependencies no longer depends on which branch the
first run happened to take. An effect that reads its dependencies after its guard works only while the guard
happens to pass on the first run, which is correct by accident of ordering rather than by design.

- Solid: `createEffect`, `createMemo` and `createRenderEffect` all track this way.
- Vue: `watchEffect` and `computed` track this way. A `watch` given an explicit source tracks only that source,
  so its callback can return early freely.
- Svelte: `$effect` and `$derived` track this way.

### An effect that keeps two values in step reads the other side untracked

A mirror keeps two values in step with two effects, one copying the first into the second and one copying back,
often converting on the way — a color into its hue, a number into the text of a field. Each effect must depend
on its own source and nothing else. If the effect copying the first value also reads the second — to compare,
or to skip a write that would change nothing — then a change to the second value made by anything else re-runs
it, and it writes the first value, which has not caught up yet, back over the change. The person sees what they
just typed or picked replaced with an older value, or with a different value entirely.

**So read the far side without subscribing to it.** The comparison still sees the current value, but a change on
that side no longer re-runs the effect. The same holds for an effect that refreshes a text field from a value: if
it tracks anything that changes while the person is typing, it overwrites what is being typed.

- Solid: read the far side inside `untrack`.
- Vue: give `watch` the near side as its explicit source; the callback's reads are not tracked.
  `SignalMirrorVueUtils.useMirror` is built that way.
- Svelte: read the far side inside `untrack`, as `SignalMirrorSvelteUtils.createMirror` does.
