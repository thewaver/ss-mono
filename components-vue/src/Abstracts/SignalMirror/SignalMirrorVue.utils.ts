import { type MaybeRefOrGetter, type Ref, type WritableComputedRef, computed, shallowRef, toValue, watch } from "vue";

import { type SignalMirrorSplitDefs, SignalMirrorUtils } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";

/**
 * Gives a component one piece of state to work with whether or not the consumer supplied one.
 *
 * A control that can be either controlled or uncontrolled would otherwise branch on that everywhere it touches its
 * own value. These hand back one writable ref in every case, so the question of who owns the value is settled once,
 * at the top. A two-way prop is already one such ref through `useTwoWay`; these are for state arriving any other way.
 */
export namespace SignalMirrorVueUtils {
    /**
     * Uses the consumer's ref if they gave one, and a ref of the composable's own if they did not.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param source The consumer's ref, or `undefined`. Read once.
     * @param initial What the composable's own ref starts at.
     * @returns The ref in play.
     */
    export const useOptional = <T>(source: Ref<T> | undefined, initial: T): Ref<T> => source ?? shallowRef(initial);

    /**
     * Mirrors an outer value into an inner one of a different type, in both directions.
     *
     * For when a component works in one representation and its consumer holds another. Each direction converts,
     * then checks whether the other side already agrees, which is what keeps the two from bouncing a value back and
     * forth.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param outer The consumer's value.
     * @param setOuter Writes it back.
     * @param opts.toInner Converts inwards.
     * @param opts.toOuter Converts outwards.
     * @param opts.getIsSame Compares two outer values. Identity when omitted, which is wrong for any value held as an
     * object, since a conversion produces a new one each time.
     * @returns The inner value, as a writable ref. Writing it writes the outer value too, unless that already agrees.
     */
    export const useMirror = <TOuter, TInner>(
        outer: MaybeRefOrGetter<TOuter>,
        setOuter: (value: TOuter) => void,
        opts: {
            toInner: (value: TOuter) => TInner;
            toOuter: (value: TInner) => TOuter;
            getIsSame?: (a: TOuter, b: TOuter) => boolean;
        },
    ): WritableComputedRef<TInner> => {
        const getIsSame = (a: TOuter, b: TOuter) => (opts.getIsSame ?? Object.is)(a, b);
        const inner = shallowRef(opts.toInner(toValue(outer)));

        watch(
            () => toValue(outer),
            (value) => {
                if (!getIsSame(value, opts.toOuter(inner.value))) inner.value = opts.toInner(value);
            },
        );

        return computed({
            get: () => inner.value,
            set: (value) => {
                const next = opts.toOuter(value);

                inner.value = value;

                if (!getIsSame(toValue(outer), next)) setOuter(next);
            },
        });
    };

    /**
     * Mirrors an outer value into an inner one of the same type.
     *
     * {@link useMirror} without the conversions, for when the inner copy exists to absorb writes the consumer may
     * reject or clamp.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param outer The consumer's value.
     * @param setOuter Writes it back.
     * @param getIsSame Compares two values. Identity when omitted.
     * @returns The inner value, as a writable ref.
     */
    export const useValueMirror = <T>(
        outer: MaybeRefOrGetter<T>,
        setOuter: (value: T) => void,
        getIsSame?: (a: T, b: T) => boolean,
    ) => useMirror<T, T>(outer, setOuter, { toInner: (value) => value, toOuter: (value) => value, getIsSame });

    /**
     * Splits one composite value into a writable ref per half.
     *
     * `SignalMirrorUtils.createSplitter` with its halves read as refs and the whole value handed to it whenever it
     * changes; the rule that tells an outside clear from the echo of an inside one is the splitter's. A consumer
     * clearing a value that is already `undefined` changes nothing Vue can see, so a held half stays held.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param whole The whole value, read and written.
     * @param defs What `SignalMirrorUtils.createSplitter` takes.
     * @returns `first` and `second`, a writable ref per half. Either can be set to `undefined`, which leaves the whole
     * value `undefined` until both are filled in again.
     */
    export const useSplit = <TWhole, TFirst, TSecond>(
        whole: Ref<TWhole | undefined>,
        defs: SignalMirrorSplitDefs<TWhole, TFirst, TSecond>,
    ) => {
        const splitter = SignalMirrorUtils.createSplitter<TWhole, TFirst, TSecond>(
            [
                () => whole.value,
                (value) => {
                    whole.value = value;
                },
            ],
            defs,
        );

        watch(whole, (value) => splitter.receive(value));

        const halves = useStore(splitter);

        return {
            first: computed({ get: () => halves.value.first, set: splitter.setFirst }),
            second: computed({ get: () => halves.value.second, set: splitter.setSecond }),
        };
    };
}
