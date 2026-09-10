import { MathUtils } from "@thewaver/ss-utils";

import type { CarouselStep } from "./Carousel.types";

/** Halfway, for comparing a turn against half the item count. */
const HALF = 0.5;

/** Moves a carousel's index around, taking the shorter way round. */
export namespace CarouselUtils {
    /** Brings an index into range, wrapping at both ends. */
    export const wrapIndex = MathUtils.wrapIndex;

    /**
     * Which item a step control moves to.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current item.
     * @param count How many items there are.
     * @returns The new index, wrapped — so stepping past either end continues round.
     */
    export const getStepTarget = (step: CarouselStep, index: number, count: number) =>
        wrapIndex(index + (step === "previous" ? -1 : 1), count);

    /**
     * How many places to turn to get from one item to another, the shorter way round.
     *
     * The sign is what matters: a carousel of ten going from item 1 to item 9 turns two places backwards
     * rather than eight forwards, so the animation goes the way the user expects.
     *
     * @param from The current item.
     * @param to The item to reach.
     * @param count How many items there are.
     * @returns The number of places, negative to go backwards. Ties go forwards.
     */
    export const getTurnSteps = (from: number, to: number, count: number) => {
        if (count <= 0) return 0;

        const forward = wrapIndex(to - from, count);

        return forward > count * HALF ? forward - count : forward;
    };
}
