import { untrack } from "svelte";

import type { ValuePair } from "./typeUtils.js";

const getIsCopiedOnWrite = (value: unknown) => {
    if (typeof value !== "object" || value === null) return false;

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === Array.prototype;
};

const readEntries = (value: object) => Object.entries(value);

const getIsSameEntries = (a: [string, unknown][], b: [string, unknown][]) =>
    a.length === b.length && a.every(([key, item], index) => key === b[index][0] && Object.is(item, b[index][1]));

const getIsCopyOf = (copy: object, original: object) => {
    const copyEntries = readEntries(copy);
    const originalEntries = readEntries(original);

    return (
        copyEntries.length === originalEntries.length &&
        copyEntries.every(([key, item], index) => {
            const [originalKey, originalItem] = originalEntries[index];

            if (key !== originalKey) return false;
            if (Object.is(item, originalItem)) return true;

            return getIsCopiedOnWrite(item) && getIsCopiedOnWrite(originalItem);
        })
    );
};

/**
 * Holds a value a component writes through a `$bindable` prop, so that reading it back answers the value written.
 *
 * Svelte turns a plain object or array written to a `$bindable` prop into a watched copy when nothing is bound to
 * the prop, and so does a consumer's `$state` bound to it. The copy is not the value written, so a component that
 * later looks the value up by identity — the option it picked, the node it zoomed into, the rows it selected —
 * finds nothing. This remembers the last plain object or array it wrote together with what the prop read back
 * straight afterwards, and answers the written value for as long as the prop still reads that copy, unchanged. A
 * value the owner puts there afterwards is answered as it is, and so is the copy once the owner changes it in place —
 * a `push`, a `splice`, a key set or deleted. A write the owner refuses leaves the owner's value showing, and one the
 * owner stores in a different form — fewer items, other keys, other primitives — is answered as the owner stored it.
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
export const createHeldValue = <T>(bound: ValuePair<T>): ValuePair<T> => {
    let written = $state.raw<{ value: T; seen: T; seenEntries: [string, unknown][] }>();

    const held = $derived.by(() => {
        const value = bound[0]();

        if (!written || !Object.is(value, written.seen)) return value;

        return getIsSameEntries(readEntries(value as object), written.seenEntries) ? written.value : value;
    });

    return [
        () => held,
        (next) => {
            const before = untrack(bound[0]);

            bound[1](next);

            const seen = untrack(bound[0]);

            if (Object.is(seen, before) && !Object.is(before, next)) return;

            const isHeld =
                getIsCopiedOnWrite(next) &&
                getIsCopiedOnWrite(seen) &&
                !Object.is(seen, next) &&
                untrack(() => getIsCopyOf(seen as object, next as object));

            written = isHeld
                ? { value: next, seen, seenEntries: untrack(() => readEntries(seen as object)) }
                : undefined;
        },
    ];
};
