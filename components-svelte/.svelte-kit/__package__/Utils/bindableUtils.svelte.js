import { untrack } from "svelte";
const getIsCopiedOnWrite = (value) => {
    if (typeof value !== "object" || value === null)
        return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === Array.prototype;
};
/**
 * Holds a value a component writes through a `$bindable` prop, so that reading it back answers the value written.
 *
 * Svelte turns a plain object or array written to a `$bindable` prop into a watched copy when nothing is bound to
 * the prop, and so does a consumer's `$state` bound to it. The copy is not the value written, so a component that
 * later looks the value up by identity — the option it picked, the node it zoomed into, the rows it selected —
 * finds nothing. This remembers the last plain object or array it wrote together with what the prop read back
 * straight afterwards, and answers the written value for as long as the prop still reads that copy. A value the
 * owner puts there afterwards is answered as it is, and a write the owner refuses leaves the owner's value showing.
 * Primitives, dates and class instances are never copied by Svelte, so they pass through as the prop reads them.
 *
 * It mends only what the component reads. The consumer's own `$state` still holds the copy, so a consumer that
 * compares the value by identity itself binds a variable declared with `$state.raw`, or a getter and setter.
 *
 * Must run while a component is being set up.
 *
 * @param bound The prop, as `[() => value, (next) => (value = next)]`.
 * @returns The same value as a {@link ValuePair}, whose getter answers the value that was written.
 */
export const createHeldValue = (bound) => {
    let written = $state.raw();
    return [
        () => {
            const value = bound[0]();
            return written && Object.is(value, written.seen) ? written.value : value;
        },
        (next) => {
            const before = untrack(bound[0]);
            bound[1](next);
            const seen = untrack(bound[0]);
            if (Object.is(seen, before) && !Object.is(before, next))
                return;
            written = getIsCopiedOnWrite(next) && !Object.is(seen, next) ? { value: next, seen } : undefined;
        },
    ];
};
