import type { SVGAttributes } from "svelte/elements";
import { type SVGAnimationDefs } from "@thewaver/ss-components";
/** The Svelte side of `SVGAnimationDefsUtils`: an animation's schedule as a key and attributes to spread. */
export declare namespace SVGAnimationDefsSvelteUtils {
    /**
     * Schedules every `animate` element of one animation.
     *
     * `SVGAnimationDefsUtils.createScheduler` with the pattern index held in state, so `repeatCount` follows the
     * running pattern. A running SMIL animation cannot be rewound or retimed in place, so it restarts by being built
     * again: `getKey` answers `SVGAnimationDefsUtils.computeIdentity` of the record, and elements drawn inside
     * `{#key}` on it are replaced when the duration or a pattern changes and kept, still running, when a new record
     * describes the same animation.
     *
     * Must run while a component is being set up.
     *
     * @param getDefs The animation, read reactively: how long one iteration lasts, the script of patterns — how many
     * times to repeat, how long to wait first, and which pattern follows — and the `onAnimationIteration` and
     * `onAnimationEnd` callbacks, read as each pattern finishes.
     * @returns `getKey`, to key the `animate` elements on, and `getAttributes`, to spread onto every one of them —
     * the attachment that does the scheduling included, so each element spread with it joins the schedule.
     */
    const createAnimateDefs: (getDefs: () => SVGAnimationDefs) => {
        getKey: () => string;
        getAttributes: () => SVGAttributes<SVGAnimateElement>;
    };
}
