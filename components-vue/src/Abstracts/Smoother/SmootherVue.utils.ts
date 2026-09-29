import { type MaybeRefOrGetter, onScopeDispose, toValue } from "vue";

import { SmootherUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStableList } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/** The Vue side of `SmootherUtils`: trailing values driven by reactive targets, read as a ref. */
export namespace SmootherVueUtils {
    /**
     * Follows a list of numbers, easing towards each change on animation frames.
     *
     * `SmootherUtils.create` fed from the current targets. The frame being waited for is called off on unmount.
     *
     * Must run inside a component's `setup`.
     *
     * @param targets The values to follow. A list with the same entries as the last one counts as unchanged.
     * @param smoothingMs How slowly they are followed, as `SmootherUtils.getStep` takes it.
     * @returns A ref of the trailing values, one per target, in the same order.
     */
    export const useSmoothed = (targets: MaybeRefOrGetter<number[]>, smoothingMs: MaybeRefOrGetter<number>) => {
        const stableTargets = useStableList(() => toValue(targets));

        const follower = SmootherUtils.create(stableTargets.value);

        watchAfterRender([stableTargets, () => toValue(smoothingMs)], ([list, smoothing]) =>
            follower.follow(list, smoothing),
        );

        onScopeDispose(follower.stop);

        return useStore(follower);
    };
}
