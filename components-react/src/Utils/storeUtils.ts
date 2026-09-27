import { useSyncExternalStore } from "react";

import type { Store } from "@thewaver/ss-utils";

/**
 * Reads a store in a React component, re-rendering it when the value changes.
 *
 * The library's framework-free parts hold their state in stores; this is how a React component reads one.
 * Given `select`, the component re-renders only when the selected part changes, so a component reading one
 * field of a record is not re-rendered by a change to another.
 *
 * @param store The store to read.
 * @param select Picks the part of the value to follow. Its result is compared with `Object.is` on every
 * render, so it must be a primitive or a reference the store already holds — an object built afresh on each
 * call reads as a change every time and never settles.
 * @returns The value, or the selected part of it.
 */
export const useStore = <T, R = T>(store: Store<T>, select?: (value: T) => R): R =>
    useSyncExternalStore(store.subscribe, () => (select ? select(store.get()) : (store.get() as unknown as R)));
