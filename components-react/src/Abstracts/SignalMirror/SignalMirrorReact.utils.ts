import { useEffect, useState } from "react";

import { type SignalMirrorSplitDefs, SignalMirrorUtils } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * Gives a component one piece of state to work with whether or not the consumer supplied one.
 *
 * A control that can be either controlled or uncontrolled would otherwise branch on that everywhere it touches its
 * own value. These hand back a `[value, setValue]` pair in every case, so the question of who owns the value is
 * settled once, at the top.
 */
export namespace SignalMirrorReactUtils {
    /**
     * Uses the consumer's state if they gave it, and state of the hook's own if they did not.
     *
     * The controlled-or-uncontrolled question, answered. A consumer may start controlling the value later; the
     * hook's own copy is then ignored for as long as they do.
     *
     * @param source The consumer's `[value, setValue]`, or `undefined`.
     * @param initial What the hook's own state starts at.
     * @returns The pair in play.
     */
    export const useOptionalState = <T>(
        source: readonly [T, (value: T) => void] | undefined,
        initial: T,
    ): readonly [T, (value: T) => void] => {
        const own = useState(initial);

        return source ?? own;
    };

    /**
     * Mirrors an outer value into inner state of a different type, in both directions.
     *
     * For when a component works in one representation and its consumer holds another. Each direction converts,
     * then checks whether the other side already agrees, which is what keeps the two from bouncing a value back and
     * forth.
     *
     * @param outer The consumer's value.
     * @param setOuter Writes it back.
     * @param opts.toInner Converts inwards.
     * @param opts.toOuter Converts outwards.
     * @param opts.getIsSame Compares two outer values. Identity when omitted, which is wrong for any value held as an
     * object, since a conversion produces a new one each time.
     * @returns The inner `[value, setValue]`.
     */
    export const useMirror = <TOuter, TInner>(
        outer: TOuter,
        setOuter: (value: TOuter) => void,
        opts: {
            toInner: (value: TOuter) => TInner;
            toOuter: (value: TInner) => TOuter;
            getIsSame?: (a: TOuter, b: TOuter) => boolean;
        },
    ): readonly [TInner, (value: TInner) => void] => {
        const latest = useLatest({ outer, setOuter, ...opts });
        const [inner, setInner] = useState(() => opts.toInner(outer));
        const getIsSame = opts.getIsSame ?? Object.is;

        useEffect(() => {
            const { toInner, toOuter } = latest.current;

            setInner((current) => (getIsSame(outer, toOuter(current)) ? current : toInner(outer)));
        }, [outer]);

        const setMirrored = (value: TInner) => {
            const { toOuter, getIsSame: compare = Object.is } = latest.current;
            const next = toOuter(value);

            setInner(value);

            if (!compare(latest.current.outer, next)) latest.current.setOuter(next);
        };

        return [inner, setMirrored];
    };

    /**
     * Mirrors an outer value into inner state of the same type.
     *
     * {@link useMirror} without the conversions, for when the inner copy exists to absorb writes the consumer may
     * reject or clamp.
     *
     * @param outer The consumer's value.
     * @param setOuter Writes it back.
     * @param getIsSame Compares two values. Identity when omitted.
     */
    export const useValueMirror = <T>(outer: T, setOuter: (value: T) => void, getIsSame?: (a: T, b: T) => boolean) =>
        useMirror<T, T>(outer, setOuter, { toInner: (value) => value, toOuter: (value) => value, getIsSame });

    /**
     * Splits one composite value into a piece of state per half.
     *
     * `SignalMirrorUtils.createSplitter` with its halves read as state and the whole value handed to it whenever it
     * changes; the rule that tells an outside clear from the echo of an inside one is the splitter's. A consumer
     * clearing a value that is already `undefined` changes nothing React can see, so a held half stays held.
     *
     * @param whole The whole value, and how to change it.
     * @param defs What `SignalMirrorUtils.createSplitter` takes.
     * @returns A `[value, setValue]` per half. Either can be set to `undefined`, which leaves the whole value
     * `undefined` until both are filled in again.
     */
    export const useSplit = <TWhole, TFirst, TSecond>(
        whole: readonly [TWhole | undefined, (value: TWhole | undefined) => void],
        defs: SignalMirrorSplitDefs<TWhole, TFirst, TSecond>,
    ) => {
        const latest = useLatest(whole);

        const [splitter] = useState(() =>
            SignalMirrorUtils.createSplitter<TWhole, TFirst, TSecond>(
                [() => latest.current[0], (value) => latest.current[1](value)],
                defs,
            ),
        );

        useEffect(() => splitter.receive(whole[0]), [splitter, whole[0]]);

        const halves = useStore(splitter);

        return {
            firstState: [halves.first, splitter.setFirst] as const,
            secondState: [halves.second, splitter.setSecond] as const,
        };
    };
}
