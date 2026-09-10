import type { Setter, Signal } from "solid-js";
import { untrack } from "solid-js";

import type { MaybeAccessor, SignalSource } from "./typeUtils";

/**
 * Reads a value that may have been given either directly or as an accessor.
 *
 * Props in this library accept both, so a consumer can pass a constant where nothing changes and a
 * function where something does. Every read goes through here, which means a component never has to
 * know which it was given.
 *
 * @param value The value or an accessor for it.
 * @returns The value. Reading inside a reactive context tracks it, as it would any accessor.
 */
export const access = <T>(value: MaybeAccessor<T>): T => (typeof value === "function" ? (value as () => T)() : value);

/**
 * Presents a signal that may be swapped out as one stable signal.
 *
 * The source is read on every access rather than captured, so a component can hold onto the result
 * while the signal behind it changes — which is what lets a control switch between a consumer's
 * signal and an internal one.
 *
 * Writing checks the current value first and does nothing when it already matches, which stops a
 * write that changes nothing from waking anything downstream. Function updaters are given the
 * current value, as with an ordinary signal, and the write returns the value that ended up in place —
 * which may not be the one asked for, if the source clamped or rejected it.
 *
 * @param getSource The signal to read and write, read afresh each time.
 */
export const accessSignal = <T>(getSource: () => SignalSource<T>): Signal<T> => [
    () => getSource()[0](),
    ((value: unknown) => {
        const read = () => untrack(() => getSource()[0]());
        const next = typeof value === "function" ? (value as (prev: T) => T)(read()) : (value as T);

        if (!Object.is(next, read())) (getSource()[1] as (value: T) => void)(next);

        return read();
    }) as Setter<T>,
];
