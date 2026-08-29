import type { Signal } from "solid-js";
import { createEffect, createSignal, untrack } from "solid-js";

import { accessSignal } from "../../Utils/propUtils";
import type { SignalSource } from "../../Utils/typeUtils";

export namespace SignalMirror {
    export const createMirror = <TOuter, TInner>(
        getOuter: () => TOuter,
        setOuter: (value: TOuter) => void,
        opts: {
            toInner: (value: TOuter) => TInner;
            toOuter: (value: TInner) => TOuter;
            getIsSame?: (a: TOuter, b: TOuter) => boolean;
        },
    ): Signal<TInner> => {
        const getIsSame = opts.getIsSame ?? ((a: TOuter, b: TOuter) => a === b);

        const inner = createSignal(opts.toInner(untrack(getOuter)));

        createEffect(() => {
            const value = getOuter();

            if (
                getIsSame(
                    value,
                    untrack(() => opts.toOuter(inner[0]())),
                )
            )
                return;

            inner[1](() => opts.toInner(value));
        });

        createEffect(() => {
            const value = opts.toOuter(inner[0]());

            if (getIsSame(untrack(getOuter), value)) return;

            setOuter(value);
        });

        return inner;
    };

    export const createOptional = <T>(getSource: () => SignalSource<T> | undefined, initial: T): Signal<T> => {
        const fallback = createSignal<T>(initial);

        return accessSignal(() => getSource() ?? fallback);
    };

    export const createPassThrough = <T>(getValue: () => T, setValue: (value: T) => void): Signal<T> =>
        accessSignal(() => [getValue, setValue]);

    export const createValueMirror = <T>(
        getOuter: () => T,
        setOuter: (value: T) => void,
        getIsSame?: (a: T, b: T) => boolean,
    ) => createMirror<T, T>(getOuter, setOuter, { toInner: (value) => value, toOuter: (value) => value, getIsSame });
}
