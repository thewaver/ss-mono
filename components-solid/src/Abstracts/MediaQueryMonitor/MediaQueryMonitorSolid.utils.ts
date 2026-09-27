import { type Accessor, createEffect, onCleanup } from "solid-js";

import { MediaQueryMonitorUtils, type MediaQueryWatcher } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";

/** Reads a watcher as an accessor, listening only while it is not disabled. */
const accessWatcher = (watcher: MediaQueryWatcher, getIsDisabled?: Accessor<boolean>) => {
    const getMatches = accessStore(watcher);

    createEffect(() => {
        if (getIsDisabled?.()) return;

        onCleanup(watcher.observe());
    });

    return () => (getIsDisabled?.() ? false : getMatches());
};

/** The Solid side of {@link MediaQueryMonitorUtils}: a media query as a signal. */
export namespace MediaQueryMonitorSolidUtils {
    /**
     * Watches a media query.
     *
     * {@link MediaQueryMonitorUtils.create} as an accessor, joining the shared count for as long as the owner
     * lives and is not disabled.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param query The query text, as it would be written in CSS.
     * @param getIsDisabled Pass `true` to not listen at all. For a component that only consults the query
     * when a prop it is optional on has been given — it still has to ask for the accessor while setting
     * up, and this is how it asks without joining the count.
     * @returns Whether it currently matches. `false` until the query is first evaluated, which happens
     * as soon as the effect runs, and `false` for as long as it is disabled.
     */
    export const create = (query: string, getIsDisabled?: Accessor<boolean>) =>
        accessWatcher(MediaQueryMonitorUtils.create(query), getIsDisabled);

    /**
     * Whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion
     * can cause real discomfort, and the request is explicit.
     *
     * @param getIsDisabled Pass `true` to not listen at all. See {@link create}.
     * @returns Whether motion should be reduced.
     */
    export const createReducedMotion = (getIsDisabled?: Accessor<boolean>) =>
        accessWatcher(MediaQueryMonitorUtils.createReducedMotion(), getIsDisabled);
}
