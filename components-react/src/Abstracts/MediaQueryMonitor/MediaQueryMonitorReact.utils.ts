import { useEffect, useMemo } from "react";

import { MediaQueryMonitorUtils, type MediaQueryWatcher } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";

/** Reads a watcher as state, listening only while it is not disabled. */
const useWatcher = (watcher: MediaQueryWatcher, isDisabled: boolean) => {
    useEffect(() => (isDisabled ? undefined : watcher.observe()), [watcher, isDisabled]);

    const matches = useStore(watcher);

    return isDisabled ? false : matches;
};

/** The React side of `MediaQueryMonitorUtils`: a media query as state. */
export namespace MediaQueryMonitorReactUtils {
    /**
     * Watches a media query.
     *
     * `MediaQueryMonitorUtils.create`, joining the shared count while mounted and not disabled.
     *
     * @param query The query text, as it would be written in CSS.
     * @param isDisabled Pass `true` to not listen at all, for a component that only consults the query when an
     * optional prop has been given.
     * @returns Whether it currently matches. `false` until the query is first evaluated, and `false` for as long as
     * it is disabled.
     */
    export const useMediaQuery = (query: string, isDisabled = false) =>
        useWatcher(
            useMemo(() => MediaQueryMonitorUtils.create(query), [query]),
            isDisabled,
        );

    /**
     * Whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion can cause
     * real discomfort, and the request is explicit.
     *
     * @param isDisabled Pass `true` to not listen at all. See {@link useMediaQuery}.
     * @returns Whether motion should be reduced.
     */
    export const useReducedMotion = (isDisabled = false) =>
        useWatcher(
            useMemo(() => MediaQueryMonitorUtils.createReducedMotion(), []),
            isDisabled,
        );
}
