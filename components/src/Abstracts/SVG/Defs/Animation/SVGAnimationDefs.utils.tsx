import type { JSX } from "solid-js";
import { createMemo, createSignal, onCleanup } from "solid-js";

import type { SVGAnimationDefs, SVGAnimationIterationPattern } from "./SVGAnimationDefs.types";

/**
 * Drives SVG's own `animate` elements from a script of iteration patterns.
 *
 * SMIL animation is used rather than CSS because several `animate` elements can be begun in the
 * same instant and stay in step, which is what a filter's worth of animated primitives needs.
 * The cost is that its scheduling has to be driven by hand, and that is what this does.
 */
export namespace SVGAnimationDefsUtils {
    /**
     * Rewrites a pattern that loops to itself as a pair that alternate.
     *
     * An `animate` element cannot be told to begin again while it is the one that just ended — the
     * event that would restart it is the event it is still delivering — so a self-loop would stall. Two
     * patterns pointing at each other run identically and do not.
     *
     * @param patterns The patterns as written, each naming which pattern follows it.
     * @returns The same patterns with any self-loop expanded into a pair. The originals are copied
     * rather than modified, and no pattern loses its identity, so indices already in the list stay
     * valid.
     */
    export const unrollSelfReferencingPatterns = (
        patterns: SVGAnimationIterationPattern[],
    ): SVGAnimationIterationPattern[] => {
        if (patterns.length === 0) return patterns;

        const result = patterns.map((p) => ({ ...p }));
        const originalLength = result.length;

        for (let i = 0; i < originalLength; i++) {
            const pattern = result[i];

            if (pattern.nextIndex === i) {
                const duplicateIndex = result.length;

                pattern.nextIndex = duplicateIndex;
                result.push({ ...pattern, nextIndex: i });
            }
        }

        return result;
    };

    /**
     * Builds the attributes to spread onto every `animate` element of one animation.
     *
     * All the elements sharing these attributes are begun together and end together, and one of them —
     * whichever is still in the document — is picked to drive the schedule, so the callbacks fire once
     * per iteration rather than once per element. Beginning is deferred to the next frame, because an
     * element that has not yet been laid out cannot be told to start.
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

        const getPatterns = createMemo(() => unrollSelfReferencingPatterns(defs.animationIterationPatterns ?? []));

        const elements = new Set<SVGAnimateElement>();

        const getLeadElement = () => {
            for (const candidate of elements) {
                if (candidate.isConnected) return candidate;
            }

            return undefined;
        };

        return (): JSX.AnimateSVGAttributes<SVGAnimateElement> => ({
            get dur() {
                return `${defs.animationDurationMs}ms`;
            },
            get repeatCount() {
                const pattern = getPatterns()[getPatternIndex()];
                return !pattern || pattern.count === Infinity ? "indefinite" : pattern.count;
            },
            fill: "freeze",
            begin: "indefinite",
            ref: (el: SVGAnimateElement) => {
                elements.add(el);

                const frameId = requestAnimationFrame(() => {
                    if (!el.isConnected) return;

                    el.beginElementAt((getPatterns()[0]?.beginDelayMs ?? 0) / 1000);
                });

                const handleEndEvent = () => {
                    if (el !== getLeadElement()) return;

                    const currentIndex = getPatternIndex();
                    const nextIndex = getPatterns()[currentIndex]?.nextIndex;

                    defs.onAnimationIteration?.(currentIndex);

                    if (nextIndex === undefined) {
                        defs.onAnimationEnd?.();
                        return;
                    }

                    setPatternIndex(nextIndex);

                    const delaySecs = (getPatterns()[nextIndex]?.beginDelayMs ?? 0) / 1000;

                    for (const element of elements) {
                        if (element.isConnected) {
                            element.beginElementAt(delaySecs);
                        }
                    }
                };

                el.addEventListener("endEvent", handleEndEvent);

                onCleanup(() => {
                    cancelAnimationFrame(frameId);
                    el.removeEventListener("endEvent", handleEndEvent);
                    elements.delete(el);
                });
            },
        });
    };
}
