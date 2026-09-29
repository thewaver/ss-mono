import { type Accessor, createSignal, onCleanup } from "solid-js";

import type { Store } from "@thewaver/ss-utils";

/**
 * Reads a store as a Solid accessor, kept current until the owner is disposed.
 *
 * The library's framework-free parts hold their state in stores; this is how a Solid component reads one.
 * Given `select`, the accessor holds only that slice and notifies only when the slice changes, so a
 * component reading one field of a record is not re-run by a change to another — read the narrowest slice
 * each place needs rather than the whole value.
 *
 * Must run inside a component or another reactive owner, whose disposal ends the subscription.
 *
 * @param store The store to read.
 * @param select Picks the part of the value to follow. Its result is compared with `===`, so it should be a
 * primitive or a reference the store already holds, never an object built afresh on each call.
 * @returns An accessor for the value, or for the selected part of it.
 */
export const accessStore = <T, R = T>(store: Store<T>, select?: (value: T) => R): Accessor<R> => {
    const read = () => (select ? select(store.get()) : (store.get() as unknown as R));

    const [getValue, setValue] = createSignal<R>(read());

    onCleanup(store.subscribe(() => setValue(() => read())));

    return getValue;
};
