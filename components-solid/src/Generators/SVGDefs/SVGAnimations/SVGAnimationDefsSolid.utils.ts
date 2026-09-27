import type { JSX } from "solid-js";
import { createMemo, createSignal, onCleanup } from "solid-js";

import { type SVGAnimationDefs, SVGAnimationDefsUtils } from "@thewaver/ss-components";

/** The Solid side of {@link SVGAnimationDefsUtils}: an animation's schedule as attributes to spread. */
export namespace SVGAnimationDefsSolidUtils {
    /**
     * Builds the attributes to spread onto every `animate` element of one animation.
     *
     * {@link SVGAnimationDefsUtils.createScheduler} with the pattern index in a signal, so `repeatCount`
     * follows the running pattern. A running animation restarts only by being built again: a new record
     * handed to this makes new elements, and the old ones are discarded mid-flight.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param defs.animationDurationMs How long one iteration lasts.
     * @param defs.animationIterationPatterns The script: how many times to repeat, how long to wait
     * first, and which pattern follows. A pattern with no follower ends the animation.
     * @param defs.onAnimationIteration Called as each pattern finishes, with its index.
     * @param defs.onAnimationEnd Called when a pattern with no follower finishes.
     * @returns A function giving the attributes, including the `ref` that does the scheduling — so it
     * must be spread onto every `animate` element rather than called once and shared.
     */
    export const createAnimateDefs = (defs: SVGAnimationDefs) => {
        const [getPatternIndex, setPatternIndex] = createSignal(0);

        const getPatterns = createMemo(() =>
            SVGAnimationDefsUtils.unrollSelfReferencingPatterns(defs.animationIterationPatterns ?? []),
        );

        const scheduler = SVGAnimationDefsUtils.createScheduler({
            getPatterns,
            getPatternIndex,
            setPatternIndex,
            getDefs: () => defs,
        });

        return (): JSX.AnimateSVGAttributes<SVGAnimateElement> => ({
            get dur() {
                return `${defs.animationDurationMs}ms`;
            },
            get repeatCount() {
                return SVGAnimationDefsUtils.computeRepeatCount(getPatterns()[getPatternIndex()]);
            },
            fill: "freeze",
            begin: "indefinite",
            ref: (el: SVGAnimateElement) => {
                onCleanup(scheduler.attach(el));
            },
        });
    };
}
