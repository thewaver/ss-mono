import { type MaybeRefOrGetter, computed, shallowRef, toValue, watch } from "vue";

import { MediaQueryMonitorUtils, type MediaQueryWatcher } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** Reads a watcher as a ref, listening only while it is not disabled. */
const useWatcher = (getWatcher: () => MediaQueryWatcher, isDisabled: MaybeRefOrGetter<boolean>) => {
    const watcherRef = computed(getWatcher);
    const matches = shallowRef(watcherRef.value.get());

    watch(
        watcherRef,
        (watcher, _, onCleanup) => {
            matches.value = watcher.get();

            onCleanup(
                watcher.subscribe(() => {
                    matches.value = watcher.get();
                }),
            );
        },
        { immediate: true },
    );

    watchAfterRender([watcherRef, () => toValue(isDisabled)], ([watcher, isOff]) =>
        isOff ? undefined : watcher.observe(),
    );

    return computed(() => (toValue(isDisabled) ? false : matches.value));
};

/** The Vue side of `MediaQueryMonitorUtils`: a media query as a ref. */
export namespace MediaQueryMonitorVueUtils {
    /**
     * Watches a media query.
     *
     * `MediaQueryMonitorUtils.create`, joining the shared count while mounted and not disabled, and made again when
     * the query changes.
     *
     * Must run inside a component's `setup`.
     *
     * @param query The query text, as it would be written in CSS.
     * @param isDisabled Pass `true` to not listen at all, for a component that only consults the query when an
     * optional prop has been given.
     * @returns A computed ref of whether it currently matches. `false` until the query is first evaluated, and
     * `false` for as long as it is disabled.
     */
    export const useMediaQuery = (query: MaybeRefOrGetter<string>, isDisabled: MaybeRefOrGetter<boolean> = false) =>
        useWatcher(() => MediaQueryMonitorUtils.create(toValue(query)), isDisabled);

    /**
     * Whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion can cause
     * real discomfort, and the request is explicit.
     *
     * Must run inside a component's `setup`.
     *
     * @param isDisabled Pass `true` to not listen at all. See {@link useMediaQuery}.
     * @returns A computed ref of whether motion should be reduced.
     */
    export const useReducedMotion = (isDisabled: MaybeRefOrGetter<boolean> = false) => {
        const watcher = MediaQueryMonitorUtils.createReducedMotion();

        return useWatcher(() => watcher, isDisabled);
    };
}
