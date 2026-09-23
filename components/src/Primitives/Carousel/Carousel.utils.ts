import { MathUtils } from "@thewaver/ss-utils";

import type { CarouselStep } from "./Carousel.types";

/** Halfway, for comparing a turn against half the item count. */
const HALF = 0.5;

/** Moves a carousel's index around, taking the shorter way round. */
export namespace CarouselUtils {
    /** Brings an index into range, wrapping at both ends. */
    export const wrapIndex = MathUtils.wrapIndex;

    /**
     * Where an index lands, or nowhere when it runs off the end of a carousel that does not loop.
     *
     * The one rule for every way a carousel moves — a step, a swipe, a pick, the next turn of automatic
     * rotation — so none of them can wrap where another would stop.
     *
     * @param index The index asked for, which may lie outside the range.
     * @param count How many items there are.
     * @param isLooping Whether running off one end comes round to the other.
     * @returns The index brought into range, or `undefined` when it is outside the range and the carousel
     * does not loop.
     */
    export const resolveIndex = (index: number, count: number, isLooping: boolean) => {
        if (!isLooping && (index < 0 || index >= count)) return undefined;

        return wrapIndex(index, count);
    };

    /**
     * Which item a step control moves to.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current item.
     * @param count How many items there are.
     * @param isLooping Whether stepping past either end continues round. Defaults to `true`.
     * @returns The new index — wrapped when looping, and otherwise the current index where the step would
     * run off the end, so a control there can tell it has nowhere to go.
     */
    export const getStepTarget = (step: CarouselStep, index: number, count: number, isLooping = true) =>
        resolveIndex(index + (step === "previous" ? -1 : 1), count, isLooping) ?? wrapIndex(index, count);

    /**
     * Whether a step control has nowhere to go.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current item.
     * @param count How many items there are.
     * @param isLooping Whether stepping past either end continues round.
     * @returns `true` only on a carousel that does not loop, for Previous on the first item and Next on the
     * last; a looping carousel always has somewhere to step.
     */
    export const getIsStepAtEnd = (step: CarouselStep, index: number, count: number, isLooping: boolean) =>
        resolveIndex(index + (step === "previous" ? -1 : 1), count, isLooping) === undefined;

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
