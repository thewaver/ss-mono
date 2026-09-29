import { useEffect, useState } from "react";

import { SmootherUtils } from "@thewaver/ss-components";

import { useStableList } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/** The React side of `SmootherUtils`: trailing values driven by props, read as state. */
export namespace SmootherReactUtils {
    /**
     * Follows a list of numbers, easing towards each change on animation frames.
     *
     * `SmootherUtils.create` fed from this render's values. The frame being waited for is called off on unmount.
     *
     * @param targets The values to follow. A list with the same entries as last render counts as unchanged.
     * @param smoothingMs How slowly they are followed, as `SmootherUtils.getStep` takes it.
     * @returns The trailing values, one per target, in the same order.
     */
    export const useSmoothed = (targets: number[], smoothingMs: number) => {
        const stableTargets = useStableList(targets);

        const [follower] = useState(() => SmootherUtils.create(stableTargets));

        useEffect(() => follower.follow(stableTargets, smoothingMs), [follower, stableTargets, smoothingMs]);

        useEffect(() => follower.stop, [follower]);

        return useStore(follower);
    };
}
