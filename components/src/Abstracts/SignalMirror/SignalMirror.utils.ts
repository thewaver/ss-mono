import { StoreUtils } from "@thewaver/ss-utils";

import type { SignalMirrorSplitDefs, SignalMirrorSplitHalves, SignalMirrorSplitter } from "./SignalMirror.types";

/**
 * The rules behind holding one value in two places — a consumer's and a component's — whatever framework keeps
 * either of them.
 */
export namespace SignalMirrorUtils {
    /**
     * Splits one composite value into two halves that can each be edited on their own.
     *
     * Two controls editing one value have a problem: whichever writes first would clear the other half. So
     * each half is held separately and the pair is written back only once both are filled in, which is what
     * lets somebody pick a time before picking a day without the value flapping.
     *
     * **The hard part is telling an outside clear from the echo of an inside one.** Clearing one half
     * legitimately sends `undefined` outward, and a moment later that same `undefined` arrives back — at
     * which point it is indistinguishable from a consumer's Clear button or a form reset. Refusing every
     * incoming `undefined` keeps the other half but swallows a real clear; accepting every one clears a half
     * the user never touched. So the splitter remembers what it last wrote, and clears both halves only when
     * the `undefined` is *not* that remembered value.
     *
     * The splitter is a store of the two halves. `setFirst` and `setSecond` change one half and write the whole
     * value outward when that changes it; `receive` is how the caller hands over the whole value whenever it
     * changes from outside. A clear that leaves the whole value as it already was writes nothing, so it cannot be
     * received either, and a held half stays held.
     *
     * @param wholeSignal The whole value, read and written.
     * @param defs.compose Builds the whole value from two present halves. Return `undefined` to report
     * nothing even when both are there, which is how an invalid pair stays unreported.
     * @param defs.decompose Splits a whole value into its halves.
     * @param defs.getIsSame Compares two whole values, so an unchanged write is not passed on.
     * @returns The splitter, starting from the whole value as it is now.
     */
    export const createSplitter = <TWhole, TFirst, TSecond>(
        wholeSignal: [get: () => TWhole | undefined, set: (value: TWhole | undefined) => void],
        defs: SignalMirrorSplitDefs<TWhole, TFirst, TSecond>,
    ): SignalMirrorSplitter<TWhole, TFirst, TSecond> => {
        const [getWhole, setWhole] = wholeSignal;
        const initial = getWhole();

        const store = StoreUtils.create<SignalMirrorSplitHalves<TFirst, TSecond>>(
            {
                first: initial && defs.decompose(initial)[0],
                second: initial && defs.decompose(initial)[1],
            },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        let lastEmitted = initial;

        const emit = () => {
            const { first, second } = store.get();
            const next = first !== undefined && second !== undefined ? defs.compose(first, second) : undefined;

            if (defs.getIsSame(next, getWhole())) return;

            lastEmitted = next;
            setWhole(next);
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            receive: (whole) => {
                if (whole === undefined) {
                    if (defs.getIsSame(lastEmitted, undefined)) return;

                    lastEmitted = undefined;
                    store.set({ first: undefined, second: undefined });

                    return;
                }

                const [first, second] = defs.decompose(whole);

                lastEmitted = whole;
                store.set({ first, second });
            },
            setFirst: (first) => {
                store.update((current) => ({ ...current, first }));
                emit();
            },
            setSecond: (second) => {
                store.update((current) => ({ ...current, second }));
                emit();
            },
        };
    };
}
