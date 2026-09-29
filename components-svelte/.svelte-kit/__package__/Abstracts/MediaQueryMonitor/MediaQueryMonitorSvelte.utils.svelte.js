import { untrack } from "svelte";
import { MediaQueryMonitorUtils } from "@thewaver/ss-components";
import { readStore } from "../../Utils/storeUtils.js";
const readWatcher = (watcher, getIsDisabled) => {
    const getMatches = readStore(watcher);
    $effect(() => {
        if (getIsDisabled?.())
            return;
        return untrack(() => watcher.observe());
    });
    return () => (getIsDisabled?.() ? false : getMatches());
};
/** The Svelte side of {@link MediaQueryMonitorUtils}: a media query as a getter. */
export var MediaQueryMonitorSvelteUtils;
(function (MediaQueryMonitorSvelteUtils) {
    /**
     * Watches a media query.
     *
     * {@link MediaQueryMonitorUtils.create} as a getter, joining the shared count for as long as the component lives
     * and is not disabled.
     *
     * Must run while a component is being set up.
     *
     * @param query The query text, as it would be written in CSS. Read once.
     * @param getIsDisabled Pass `true` to not listen at all. For a component that only consults the query when a
     * prop it is optional on has been given — it still has to ask for the getter while setting up, and this is how
     * it asks without joining the count.
     * @returns Whether it currently matches. `false` until the query is first evaluated, which happens as soon as the
     * component has mounted, and `false` for as long as it is disabled.
     */
    MediaQueryMonitorSvelteUtils.create = (query, getIsDisabled) => readWatcher(MediaQueryMonitorUtils.create(query), getIsDisabled);
    /**
     * Whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion can cause
     * real discomfort, and the request is explicit.
     *
     * @param getIsDisabled Pass `true` to not listen at all. See {@link create}.
     * @returns Whether motion should be reduced.
     */
    MediaQueryMonitorSvelteUtils.createReducedMotion = (getIsDisabled) => readWatcher(MediaQueryMonitorUtils.createReducedMotion(), getIsDisabled);
})(MediaQueryMonitorSvelteUtils || (MediaQueryMonitorSvelteUtils = {}));
