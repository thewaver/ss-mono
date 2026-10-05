import { type MaybeRefOrGetter, type VNode, computed, onScopeDispose, shallowRef, toValue } from "vue";

import {
    type SVGAnimationDefs,
    SVGAnimationDefsUtils,
    type SVGAnimationIterationPattern,
} from "@thewaver/ss-components";

const FIRST_PATTERN_INDEX = 0;

/** The attributes spread onto every `animate` element of one animation. */
type AnimateAttributes = {
    dur: string;
    repeatCount: number | "indefinite";
    fill: "freeze";
    begin: "0s" | "indefinite";
    onVnodeMounted: (vnode: VNode) => void;
    onVnodeBeforeUnmount: (vnode: VNode) => void;
};

/** The Vue side of `SVGAnimationDefsUtils`: an animation's schedule as a key and attributes to spread. */
export namespace SVGAnimationDefsVueUtils {
    /**
     * Schedules every `animate` element of one animation.
     *
     * `SVGAnimationDefsUtils.createScheduler` with the pattern index in a ref, so `repeatCount` follows the running
     * pattern. A running SMIL animation cannot be rewound or retimed in place, so it restarts by being built again:
     * `key` is `SVGAnimationDefsUtils.computeIdentity` of the record, and an element keyed on it is replaced when the
     * duration or a pattern changes and kept, still running, when a render hands over a record describing the same
     * animation.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param defs.animationDurationMs How long one iteration lasts.
     * @param defs.animationIterationPatterns The script: how many times to repeat, how long to wait first, and which
     * pattern follows. A pattern with no follower ends the animation.
     * @param defs.onAnimationIteration Called as each pattern finishes, with its index.
     * @param defs.onAnimationEnd Called when a pattern with no follower finishes.
     * @returns Computed refs of `key`, to give every `animate` element — combined with something of the caller's own
     * where one parent holds several — and `attributes`, to spread onto every one of them, including the element
     * hooks that do the scheduling.
     */
    export const useAnimateDefs = (defs: MaybeRefOrGetter<SVGAnimationDefs>) => {
        const identity = computed(() => SVGAnimationDefsUtils.computeIdentity(toValue(defs)));

        const unrolled = computed<{ identity: string; patterns: SVGAnimationIterationPattern[] }>((previous) =>
            previous?.identity === identity.value
                ? previous
                : {
                      identity: identity.value,
                      patterns: SVGAnimationDefsUtils.unrollSelfReferencingPatterns(
                          toValue(defs).animationIterationPatterns ?? [],
                      ),
                  },
        );

        const patterns = computed(() => unrolled.value.patterns);
        const cursor = shallowRef({ identity: identity.value, patternIndex: 0 });
        const patternIndex = computed(() => (cursor.value.identity === identity.value ? cursor.value.patternIndex : 0));
        const detachers = new Map<SVGAnimateElement, () => void>();

        const scheduler = SVGAnimationDefsUtils.createScheduler({
            getPatterns: () => patterns.value,
            getPatternIndex: () => patternIndex.value,
            setPatternIndex: (index) => {
                cursor.value = { identity: identity.value, patternIndex: index };

                const repeatCount = String(SVGAnimationDefsUtils.computeRepeatCount(patterns.value[index]));

                for (const element of detachers.keys()) element.setAttribute("repeatCount", repeatCount);
            },
            getDefs: () => toValue(defs),
        });

        const detach = (element: SVGAnimateElement) => {
            detachers.get(element)?.();
            detachers.delete(element);
        };

        onScopeDispose(() => {
            for (const element of [...detachers.keys()]) detach(element);
        });

        const attributes = computed<AnimateAttributes>(() => ({
            dur: `${toValue(defs).animationDurationMs}ms`,
            repeatCount: SVGAnimationDefsUtils.computeRepeatCount(patterns.value[patternIndex.value]),
            fill: "freeze",
            begin: SVGAnimationDefsUtils.getIsPageClocked(patterns.value[FIRST_PATTERN_INDEX]) ? "0s" : "indefinite",
            onVnodeMounted: (vnode) => {
                const element = vnode.el as SVGAnimateElement;

                detach(element);
                detachers.set(element, scheduler.attach(element));
            },
            onVnodeBeforeUnmount: (vnode) => detach(vnode.el as SVGAnimateElement),
        }));

        return { key: identity, attributes };
    };
}
