import { type Ref, onScopeDispose, shallowRef } from "vue";

import type { Store } from "@thewaver/ss-utils";

/**
 * Reads a store as a Vue ref, kept current until the component or effect scope it was made in is disposed.
 *
 * The library's framework-free parts hold their state in stores; this is how a Vue component reads one. The ref
 * notifies only when what it holds changes, so given `select`, a component reading one field of a record is not
 * re-rendered by a change to another — read the narrowest part each place needs rather than the whole value.
 *
 * Must run inside a component's `setup` or another effect scope, whose disposal ends the subscription.
 *
 * @param store The store to read.
 * @param select Picks the part of the value to follow. Its result is compared with `Object.is`, so it should be a
 * primitive or a reference the store already holds, never an object built afresh on each call.
 * @returns A read-only ref holding the value, or the selected part of it.
 */
export const useStore = <T, R = T>(store: Store<T>, select?: (value: T) => R): Readonly<Ref<R>> => {
    const read = () => (select ? select(store.get()) : (store.get() as unknown as R));

    const value = shallowRef<R>(read());

    onScopeDispose(
        store.subscribe(() => {
            value.value = read();
        }),
    );

    return value;
};
