import { type SVGProps, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { type SVGAnimationDefs, SVGAnimationDefsUtils } from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";

const FIRST_PATTERN_INDEX = 0;

/** The React side of `SVGAnimationDefsUtils`: an animation's schedule as a key and attributes to spread. */
export namespace SVGAnimationDefsReactUtils {
    /**
     * Schedules every `animate` element of one animation.
     *
     * `SVGAnimationDefsUtils.createScheduler` with the pattern index in state, so `repeatCount` follows the running
     * pattern. A running SMIL animation cannot be rewound or retimed in place, so it restarts by being built again:
     * `key` is `SVGAnimationDefsUtils.computeIdentity` of the record, and an element keyed on it is replaced when the
     * duration or a pattern changes and kept, still running, when a render hands over a record describing the same
     * animation.
     *
     * @param defs.animationDurationMs How long one iteration lasts.
     * @param defs.animationIterationPatterns The script: how many times to repeat, how long to wait first, and which
     * pattern follows. A pattern with no follower ends the animation.
     * @param defs.onAnimationIteration Called as each pattern finishes, with its index.
     * @param defs.onAnimationEnd Called when a pattern with no follower finishes.
     * @returns `key`, to give every `animate` element — combined with something of the caller's own where one
     * parent holds several — and `attributes`, to spread onto every one of them, including the `ref` that does the
     * scheduling.
     */
    export const useAnimateDefs = (defs: SVGAnimationDefs) => {
        const identity = SVGAnimationDefsUtils.computeIdentity(defs);

        const patterns = useMemo(
            () => SVGAnimationDefsUtils.unrollSelfReferencingPatterns(defs.animationIterationPatterns ?? []),
            [identity],
        );

        const [cursor, setCursor] = useState({ identity, patternIndex: 0 });
        const patternIndex = cursor.identity === identity ? cursor.patternIndex : 0;

        const latest = useLatest({ defs, patterns, patternIndex, identity });

        const [ref] = useState(() => {
            const scheduler = SVGAnimationDefsUtils.createScheduler({
                getPatterns: () => latest.current.patterns,
                getPatternIndex: () => latest.current.patternIndex,
                setPatternIndex: (index) =>
                    flushSync(() => setCursor({ identity: latest.current.identity, patternIndex: index })),
                getDefs: () => latest.current.defs,
            });

            return (element: SVGAnimateElement | null) => (element ? scheduler.attach(element) : undefined);
        });

        const attributes: SVGProps<SVGAnimateElement> = {
            dur: `${defs.animationDurationMs}ms`,
            repeatCount: SVGAnimationDefsUtils.computeRepeatCount(patterns[patternIndex]),
            fill: "freeze",
            begin: SVGAnimationDefsUtils.getIsPageClocked(patterns[FIRST_PATTERN_INDEX]) ? "0s" : "indefinite",
            ref,
        };

        return { key: identity, attributes };
    };
}
