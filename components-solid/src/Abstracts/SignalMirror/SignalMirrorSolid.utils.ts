import type { Signal } from "solid-js";
import { createEffect, createSignal, untrack } from "solid-js";

import { SignalMirrorUtils } from "@thewaver/ss-components";

import { accessSignal } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { SignalSource } from "../../Utils/typeUtils";

/**
 * Gives a component one signal to work with whether or not the consumer supplied one.
 *
 * A control that can be either controlled or uncontrolled would otherwise branch on that everywhere
 * it touches its own value. These hand back a plain Solid signal in every case, so the component
 * reads and writes one thing and the question of who owns the value is settled once, at the top.
 */
export namespace SignalMirrorSolidUtils {
    /**
     * Mirrors an outer value into an inner signal of a different type, in both directions.
     *
     * For when a component works in one representation and its consumer holds another — a date as a
     * string outside and a structured value inside, say. Each direction converts, then checks whether
     * the other side already agrees, which is what keeps the two effects from bouncing a value back and
     * forth forever.
     *
     * @param getOuter Reads the consumer's value.
     * @param setOuter Writes it back.
     * @param opts.toInner Converts inwards.
     * @param opts.toOuter Converts outwards.
     * @param opts.getIsSame Compares two outer values. Identity when omitted, which is wrong for any
     * value held as an object, since a conversion produces a new one each time.
     * @returns A signal in the inner representation.
     */
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

    /**
     * Uses the consumer's signal if they gave one, and an internal signal if they did not.
     *
     * This is the controlled-or-uncontrolled question, answered. The source is read reactively, so a
     * consumer may also start controlling a value later.
     *
     * @param getSource The consumer's signal, or `undefined`.
     * @param initial What the internal signal starts at.
     * @returns A signal that reads and writes whichever of the two is in play.
     */
    export const createOptional = <T>(getSource: () => SignalSource<T> | undefined, initial: T): Signal<T> => {
        const fallback = createSignal<T>(initial);

        return accessSignal(() => getSource() ?? fallback);
    };

    /**
     * Presents a getter and a setter that are already owned elsewhere as one signal.
     *
     * No state is added; this only puts a pair of functions into the shape the rest of the component
     * expects.
     *
     * @param getValue Reads the value.
     * @param setValue Writes it.
     */
    export const createPassThrough = <T>(getValue: () => T, setValue: (value: T) => void): Signal<T> =>
        accessSignal(() => [getValue, setValue]);

    /**
     * Splits one composite signal into a signal per half.
     *
     * {@link SignalMirrorUtils.createSplitter} with its halves read and written as ordinary Solid signals, and the
     * whole value handed to it whenever it changes. The rule that tells an outside clear from the echo of an
     * inside one is the splitter's.
     *
     * **One case it cannot see**, and it is a property of signals rather than of this rule: a consumer
     * clearing a value that is *already* `undefined` — because a half was cleared a moment earlier — writes
     * nothing new, so no effect runs and the held half stays held. Only a clear that actually changes the
     * outer value arrives.
     *
     * @param signal The whole value's signal.
     * @param defs What {@link SignalMirrorUtils.createSplitter} takes.
     * @returns A signal per half, each usable as an ordinary Solid signal. Either can be set to `undefined`,
     * which leaves the whole value `undefined` until both are filled in again.
     */
    export const createSplit = <TWhole, TFirst, TSecond>(
        signal: Signal<TWhole | undefined>,
        defs: {
            compose: (first: TFirst, second: TSecond) => TWhole | undefined;
            decompose: (whole: TWhole) => [TFirst, TSecond];
            getIsSame: (a: TWhole | undefined, b: TWhole | undefined) => boolean;
        },
    ): { firstSignal: Signal<TFirst | undefined>; secondSignal: Signal<TSecond | undefined> } => {
        const splitter = SignalMirrorUtils.createSplitter<TWhole, TFirst, TSecond>(
            [() => untrack(() => signal[0]()), (value) => signal[1](() => value)],
            defs,
        );

        const getFirst = accessStore(splitter, (halves) => halves.first);
        const getSecond = accessStore(splitter, (halves) => halves.second);

        createEffect(() => splitter.receive(signal[0]()));

        const firstSignal = [
            getFirst,
            (next: unknown) => {
                const current = untrack(getFirst);

                splitter.setFirst(
                    typeof next === "function"
                        ? (next as (prev: typeof current) => typeof current)(current)
                        : (next as TFirst | undefined),
                );

                return untrack(getFirst);
            },
        ] as Signal<TFirst | undefined>;

        const secondSignal = [
            getSecond,
            (next: unknown) => {
                const current = untrack(getSecond);

                splitter.setSecond(
                    typeof next === "function"
                        ? (next as (prev: typeof current) => typeof current)(current)
                        : (next as TSecond | undefined),
                );

                return untrack(getSecond);
            },
        ] as Signal<TSecond | undefined>;

        return { firstSignal, secondSignal };
    };

    /**
     * Mirrors an outer value into an inner signal of the same type.
     *
     * {@link SignalMirrorSolidUtils.createMirror} without the conversions, for when the inner copy exists to
     * absorb writes the consumer may reject or clamp rather than to change representation.
     *
     * @param getOuter Reads the consumer's value.
     * @param setOuter Writes it back.
     * @param getIsSame Compares two values. Identity when omitted.
     */
    export const createValueMirror = <T>(
        getOuter: () => T,
        setOuter: (value: T) => void,
        getIsSame?: (a: T, b: T) => boolean,
    ) => createMirror<T, T>(getOuter, setOuter, { toInner: (value) => value, toOuter: (value) => value, getIsSame });
}
