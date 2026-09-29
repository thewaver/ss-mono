import type { Store } from "@thewaver/ss-utils";
/**
 * Reads a store in Svelte, as a getter that re-runs whatever reads it when the value changes.
 *
 * The library's framework-free parts hold their state in stores; this is how a Svelte component reads one. The
 * getter can be read anywhere: inside an effect, a `$derived` or the markup it subscribes, and outside them it
 * answers the current value without subscribing. Given `select`, a reader re-runs only when the selected part
 * changes, so a component reading one field of a record is not re-run by a change to another — read the narrowest
 * part each place needs rather than the whole value.
 *
 * It needs no component to run in. The store is listened to while at least one effect is reading the getter and
 * let go once none is, so it may be called at module level for state shared by the whole page.
 *
 * @param store The store to read.
 * @param select Picks the part of the value to follow. Its result is compared with `Object.is`, so it should be a
 * primitive or a reference the store already holds, never an object built afresh on each call.
 * @returns A getter for the value, or for the selected part of it.
 */
export declare const readStore: <T, R = T>(store: Store<T>, select?: (value: T) => R) => (() => R);
