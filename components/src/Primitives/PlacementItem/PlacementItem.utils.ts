import { type CSSAnimationStyle, CSSUtils } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import type { PlacementBoxContextType } from "../PlacementBox/PlacementBox.context.types";

const NO_ANGLE = 0;
const GLIDING_PROPERTIES = ["left", "top", "width", "height", "rotate"];

/**
 * What one `PlacementItem` works out from its placement and the box it sits in.
 *
 * An item is drawn where its placement says, in units of the box's own width, with whatever the box's effect makes
 * of the pointer, and glides to a new placement only while the box asks it to.
 */
export namespace PlacementItemUtils {
    /**
     * The `transition` an item glides with.
     *
     * Only where the item is and how large and how turned it is are eased; the effect's `transform` and `filter` are
     * left to follow the pointer at once.
     *
     * @param durationMs How long the glide takes, from the box.
     * @param delayMs How long this item waits before it starts.
     */
    export const toTransition = (durationMs: number, delayMs: number) =>
        GLIDING_PROPERTIES.map((property) => `${property} ${durationMs}ms ease ${delayMs}ms`).join(", ");

    /**
     * What the box's effect makes of the pointer for one item.
     *
     * With the pointer away, the effect is still run, against measurements that put the pointer infinitely far off,
     * so the item settles to the effect's own resting look rather than dropping its transform — see
     * {@link ProximityUtils.toRestingEffectDefs}.
     *
     * Every value is read through the context's getters, so a caller that tracks reads picks up each one.
     *
     * @param placement The item's placement.
     * @param context The enclosing box's context.
     * @returns The effect's `transform` and `filter`, or `undefined` when the box has no effect.
     */
    export const computeEffectStyle = (
        placement: PlacementRect,
        context: PlacementBoxContextType,
    ): CSSAnimationStyle | undefined => {
        const computeEffect = context.getComputeEffect();

        if (computeEffect === undefined) return undefined;

        const point = context.getPointerPoint();
        const defs =
            point === undefined
                ? ProximityUtils.toRestingEffectDefs(
                      placement,
                      context.getArrangement(),
                      context.getPrefersReducedMotion(),
                      placement,
                  )
                : ProximityUtils.toEffectDefs(
                      placement,
                      point,
                      context.getArrangement(),
                      context.getPrefersReducedMotion(),
                      placement,
                      context.getOverreach(),
                  );

        return CSSUtils.toAnimationStyle(computeEffect(defs));
    };

    /**
     * The style values an item is drawn with, as plain fields so each framework writes them under its own spelling
     * of the property names.
     *
     * @param rect The item's placement. Its sizes are written in `cqw`, so they resolve against the box.
     * @param stackAt The consumer's stacking order, used where the placement names no `depth` of its own.
     * @param effect What {@link computeEffectStyle} answered. An empty `transform` or `filter` is left unwritten.
     * @param transition What {@link toTransition} answered while gliding, `undefined` otherwise.
     */
    export const computeStyleValues = (
        rect: PlacementRect,
        stackAt: number | undefined,
        effect: CSSAnimationStyle | undefined,
        transition: string | undefined,
    ) => ({
        left: PlacementUtils.toContainerWidth(rect.leftShare),
        top: PlacementUtils.toContainerWidth(rect.topShare),
        width: PlacementUtils.toContainerWidth(rect.widthShare),
        height: PlacementUtils.toContainerWidth(rect.heightShare),
        rotate: `${rect.angle ?? NO_ANGLE}deg`,
        transform: effect?.transform || undefined,
        filter: effect?.filter || undefined,
        zIndex: rect.depth ?? stackAt,
        clipPath: rect.clipPath,
        transition,
    });

    /**
     * Follows an item's glides, telling the caller when the latest one has finished.
     *
     * A glide is the item's CSS transitions, so it is over when every animation running on the element has settled.
     * A glide started before the previous one finished supersedes it: only the latest one reports.
     *
     * @returns `watch`, to call once the element has been written with its new placement and transition. Its
     * `onSettled` runs once every animation then on the element has finished or been cancelled, unless another
     * `watch` was called in the meantime.
     */
    export const createGlideWatcher = () => {
        let glideCount = 0;

        const watch = (element: Element, onSettled: () => void) => {
            glideCount += 1;

            const glide = glideCount;

            void Promise.allSettled(element.getAnimations().map((animation) => animation.finished)).then(() => {
                if (glide === glideCount) onSettled();
            });
        };

        return { watch };
    };
}
