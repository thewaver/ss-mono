import type { Setter, Signal } from "solid-js";
import { untrack } from "solid-js";

import type { MaybeAccessor, SignalSource } from "./typeUtils";

export const access = <T>(value: MaybeAccessor<T>): T => (typeof value === "function" ? (value as () => T)() : value);

export const accessSignal = <T>(getSource: () => SignalSource<T>): Signal<T> => [
    () => getSource()[0](),
    ((value: unknown) => {
        const read = () => untrack(() => getSource()[0]());
        const next = typeof value === "function" ? (value as (prev: T) => T)(read()) : (value as T);

        if (!Object.is(next, read())) (getSource()[1] as (value: T) => void)(next);

        return read();
    }) as Setter<T>,
];
