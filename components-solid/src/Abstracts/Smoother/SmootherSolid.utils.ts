import { type Accessor, createEffect, onCleanup, untrack } from "solid-js";

import { SmootherUtils } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";

/** The Solid side of {@link SmootherUtils}: trailing values driven by signals, read as a signal. */
export namespace SmootherSolidUtils {
    /**
     * Follows a list of numbers, easing towards each change on animation frames.
     *
     * {@link SmootherUtils.create} fed from two accessors and read as one. The frame being waited for is called
     * off when the owner is disposed.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getTargets The values to follow, read reactively.
     * @param getSmoothingMs How slowly they are followed, as {@link SmootherUtils.getStep} takes it.
     * @returns The trailing values, one per target, in the same order.
     */
    export const create = (getTargets: Accessor<number[]>, getSmoothingMs: Accessor<number>): Accessor<number[]> => {
        const follower = SmootherUtils.create(untrack(getTargets));
        const getValues = accessStore(follower);

        createEffect(() => follower.follow(getTargets(), getSmoothingMs()));

        onCleanup(follower.stop);

        return getValues;
    };
}
