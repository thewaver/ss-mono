import { untrack } from "svelte";

import { SmootherUtils } from "@thewaver/ss-components";

import { readStore } from "../../Utils/storeUtils.js";

/** The Svelte side of {@link SmootherUtils}: trailing values driven by getters, read as a getter. */
export namespace SmootherSvelteUtils {
    /**
     * Follows a list of numbers, easing towards each change on animation frames.
     *
     * {@link SmootherUtils.create} fed from two getters and read as one. The frame being waited for is called off
     * when the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param getTargets The values to follow, read reactively.
     * @param getSmoothingMs How slowly they are followed, as {@link SmootherUtils.getStep} takes it.
     * @returns The trailing values, one per target, in the same order.
     */
    export const create = (getTargets: () => number[], getSmoothingMs: () => number): (() => number[]) => {
        const follower = SmootherUtils.create(untrack(getTargets));
        const getValues = readStore(follower);

        $effect(() => {
            const targets = getTargets();
            const smoothingMs = getSmoothingMs();

            untrack(() => follower.follow(targets, smoothingMs));
        });

        $effect(() => follower.stop);

        return getValues;
    };
}
