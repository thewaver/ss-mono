import { CSSUtils, EasingUtils, MathUtils, type Point2d, type SwipeDirection } from "@thewaver/ss-utils";

import type { CarouselAxis, CarouselOrientation, CarouselPlacement, CarouselStep } from "./Carousel.types";

/** Halfway, for comparing a turn against half the item count. */
const HALF = 0.5;

/** How finely layers are told apart once they become whole-number `z-index` values. */
const LAYER_RESOLUTION = 100;

/** A whole turn over, which is how a slide's back is drawn facing the other way. */
const TURNED_OVER_DEGREES = 180;

/** A slide's center, where it turns and scales about unless its placement says otherwise. */
const CENTER: Point2d = { x: 0.5, y: 0.5 };

const PERCENT = 100;

/** The furthest a swipe is allowed to drag the slides, as a share of one slide. */
const SWIPE_RATIO_LIMIT = 1;

/** Moves a carousel's index around, taking the shorter way round. */
export namespace CarouselUtils {
    /** How far across the viewport a swipe has to travel, as a share of it, before letting go steps the carousel. */
    export const SWIPE_COMMIT_RATIO = 0.2;

    /** The fewest slides a carousel can move between. Below it, nothing steps, swipes or rotates. */
    export const MIN_ROTATABLE_COUNT = 2;

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

    /**
     * Whether the slides travel across the screen rather than up and down it, which is the way a swipe is taken.
     *
     * @param orientation Which way the carousel runs.
     * @returns `true` when the slides move left and right.
     */
    export const getTravelsAcross = (orientation: CarouselOrientation) => orientation === "horizontal";

    /**
     * Whether a swipe across the carousel should be refused.
     *
     * A carousel whose consumer draws no controls is moved only by that consumer, so its swipes are left to the
     * browser and its axis is never claimed. A disabled carousel, or one with nothing to move between, refuses
     * too.
     *
     * @param hasControls Whether the consumer draws controls for it.
     * @param isDisabled Whether the carousel is disabled.
     * @param count How many slides there are.
     * @returns `true` when the swipe is to be left to the browser.
     */
    export const getIsSwipeDisabled = (hasControls: boolean, isDisabled: boolean, count: number) =>
        !hasControls || isDisabled || count < MIN_ROTATABLE_COUNT;

    /**
     * Holds a swipe's progress to at most one slide either way.
     *
     * @param progressRatio The swipe's progress as a signed share of the viewport.
     * @returns The progress, held between `-1` and `1`.
     */
    export const clampSwipeRatio = (progressRatio: number) =>
        MathUtils.clamp(progressRatio, -SWIPE_RATIO_LIMIT, SWIPE_RATIO_LIMIT);

    /**
     * Which way a committed swipe steps the carousel.
     *
     * Pushing the slides left or up brings the next one in, the way a page is turned; pushing them right or
     * down goes back.
     *
     * @param direction The way the swipe committed.
     * @returns `1` to step forwards, `-1` to step back.
     */
    export const getSwipeStep = (direction: SwipeDirection) => (direction === "left" || direction === "up" ? 1 : -1);

    /**
     * Whether a step control is disabled.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current slide.
     * @param count How many slides there are.
     * @param isLooping Whether stepping past either end continues round.
     * @param isDisabled Whether the whole carousel is disabled.
     * @returns `true` for a disabled carousel, one with nothing to step between, and a step at the end of a
     * carousel that does not loop.
     */
    export const getIsStepDisabled = (
        step: CarouselStep,
        index: number,
        count: number,
        isLooping: boolean,
        isDisabled: boolean,
    ) => isDisabled || count < MIN_ROTATABLE_COUNT || getIsStepAtEnd(step, index, count, isLooping);

    /**
     * Whether the carousel is advancing by itself right now.
     *
     * It needs a delay to advance on, playback switched on, and more than one slide; and it holds while the
     * pointer or focus is inside it, while a swipe is under way, and while it is disabled.
     *
     * @param defs.autoplayDelayMs How long each slide is held. Without one the carousel never advances itself.
     * @param defs.isPlaying Whether playback is on.
     * @param defs.isHeld Whether the pointer, focus or a hidden tab is holding it.
     * @param defs.isSwiping Whether a swipe is under way.
     * @param defs.isDisabled Whether the carousel is disabled.
     * @param defs.count How many slides there are.
     * @returns Whether the next slide is on a timer.
     */
    export const getIsRotating = (defs: {
        autoplayDelayMs: number | undefined;
        isPlaying: boolean;
        isHeld: boolean;
        isSwiping: boolean;
        isDisabled: boolean;
        count: number;
    }) =>
        defs.autoplayDelayMs !== undefined &&
        defs.isPlaying &&
        !defs.isHeld &&
        !defs.isSwiping &&
        !defs.isDisabled &&
        defs.count >= MIN_ROTATABLE_COUNT;

    /**
     * Whether playback should switch itself off, because a carousel that does not loop has reached its last slide.
     *
     * Rotation on such a carousel has nowhere to go from the end, so it stops there for good rather than
     * springing back to the start; switching playback off is what makes the play control say so.
     *
     * @param defs.isLooping Whether the carousel loops. A looping one never stops.
     * @param defs.autoplayDelayMs How long each slide is held, or `undefined` for a carousel that never rotates.
     * @param defs.isPlaying Whether playback is on.
     * @param defs.isDisabled Whether the carousel is disabled.
     * @param defs.count How many slides there are.
     * @param defs.index The current slide.
     * @returns `true` when playback should be set to `false`.
     */
    export const getIsPlaybackAtEnd = (defs: {
        isLooping: boolean;
        autoplayDelayMs: number | undefined;
        isPlaying: boolean;
        isDisabled: boolean;
        count: number;
        index: number;
    }) =>
        !defs.isLooping &&
        defs.autoplayDelayMs !== undefined &&
        defs.isPlaying &&
        !defs.isDisabled &&
        defs.count >= MIN_ROTATABLE_COUNT &&
        defs.index === defs.count - 1;

    /**
     * Whether a change of slide should be announced.
     *
     * A move the user made — a step, a pick, a swipe — is announced; a move made by automatic rotation is not,
     * since reading out every slide as it passes would talk over whatever the user is actually doing.
     *
     * @param previousIndex The slide before, or `undefined` before there was one.
     * @param index The slide now.
     * @param isRotating Whether the carousel is advancing by itself.
     * @returns `true` when the new slide's label should be announced.
     */
    export const getIsAnnounced = (previousIndex: number | undefined, index: number, isRotating: boolean) =>
        previousIndex !== undefined && previousIndex !== index && !isRotating;

    /**
     * How many slides one whole run of `progress` covers: the whole ring on a looping carousel, so `0` to `1` is one
     * lap and `1` is back at the first slide, and first to last on one that stops at its ends.
     *
     * @param count How many slides there are.
     * @param isLooping Whether the carousel comes round from its last slide to its first.
     */
    export const getLapLength = (count: number, isLooping: boolean) => Math.max(isLooping ? count : count - 1, 0);

    /**
     * Where a progress puts the carousel, in slides.
     *
     * @param progress How far along, `0` to `1` — see {@link getLapLength}.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns A position counted in slides from the first, fractional between two of them.
     */
    export const toPosition = (progress: number, count: number, isLooping: boolean) =>
        MathUtils.clamp01(progress) * getLapLength(count, isLooping);

    /**
     * The progress that describes a position, the reverse of {@link toPosition}.
     *
     * A looping carousel's position may have run past either end while it moved the short way round; it is brought
     * back into the lap first. One that stops at its ends is held between them.
     *
     * @param position A position counted in slides from the first.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns `0` to `1`, and `0` with fewer than two slides.
     */
    export const toProgress = (position: number, count: number, isLooping: boolean) => {
        const lap = getLapLength(count, isLooping);

        if (lap <= 0) return 0;

        return isLooping ? (((position % lap) + lap) % lap) / lap : MathUtils.clamp01(position / lap);
    };

    /**
     * How far one slide is from where the carousel is, in slides.
     *
     * On a looping carousel it is the short way round, so with the last slide showing the first sits at `1` rather
     * than at the far end; that is what puts the first slide beside the last instead of rewinding past every slide
     * in between.
     *
     * @param index The slide.
     * @param position Where the carousel is, from {@link toPosition}.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns The signed distance: positive for a slide still to come, negative for one already passed.
     */
    export const getDistance = (index: number, position: number, count: number, isLooping: boolean) => {
        const straight = index - position;

        if (!isLooping || count <= 0) return straight;

        const forward = ((straight % count) + count) % count;

        return forward > count * HALF ? forward - count : forward;
    };

    /**
     * Which slide a position is nearest to, which is the slide counted as showing.
     *
     * @param position Where the carousel is, from {@link toPosition}.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     */
    export const getNearestIndex = (position: number, count: number, isLooping: boolean) =>
        isLooping ? wrapIndex(Math.round(position), count) : MathUtils.clamp(Math.round(position), 0, count - 1);

    /**
     * Where to glide to so that a slide is the one showing, starting from a position.
     *
     * @param position Where the carousel is now.
     * @param index The slide to bring up.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops, in which case the glide goes the short way round.
     * @returns The position to end at, which on a looping carousel may lie past either end of the lap.
     */
    export const getGlideTarget = (position: number, index: number, count: number, isLooping: boolean) =>
        isLooping ? position + getDistance(index, position, count, isLooping) : index;

    /**
     * Moves a position from one place to another over a time, on every animation frame, easing in and out.
     *
     * @param defs.from Where to start.
     * @param defs.to Where to end.
     * @param defs.durationMs How long the move takes. `0` or less lands at once.
     * @param defs.onFrame Called with the position on each frame, and with `to` at the end.
     * @param defs.onEnd Called once the move has arrived.
     * @returns Stops the move where it is.
     */
    export const glide = (defs: {
        from: number;
        to: number;
        durationMs: number;
        onFrame: (position: number) => void;
        onEnd?: () => void;
    }) => {
        let frameId: number | undefined;

        if (defs.durationMs <= 0 || defs.from === defs.to) {
            defs.onFrame(defs.to);
            defs.onEnd?.();

            return () => undefined;
        }

        const startMs = performance.now();

        const advance = () => {
            const ratio = MathUtils.clamp01((performance.now() - startMs) / defs.durationMs);

            frameId = undefined;
            defs.onFrame(MathUtils.lerp(defs.from, defs.to, EasingUtils.ease(ratio)));

            if (ratio >= 1) {
                defs.onEnd?.();

                return;
            }

            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    };

    /**
     * The CSS that puts one slide where its placement says.
     *
     * @param placement What the carousel's placement rule answered for the slide.
     * @param distance The slide's distance, which decides its layer when the placement names none.
     * @returns `transform`, `filter`, `transform-origin` and `z-index`, as dashed CSS properties.
     */
    export const toSlideStyle = (placement: CarouselPlacement, distance: number) => {
        const { transform, filter } = CSSUtils.toAnimationStyle(placement.effect);
        const origin = placement.origin ?? CENTER;

        return {
            "transform": transform || "none",
            "filter": filter || "none",
            "transform-origin": `${origin.x * PERCENT}% ${origin.y * PERCENT}%`,
            "z-index": `${Math.round((placement.layer ?? -Math.abs(distance)) * LAYER_RESOLUTION)}`,
        };
    };

    /**
     * What a slide turns over about, from its placement or else from the way the carousel runs.
     *
     * @param placement What the carousel's placement rule answered for the slide.
     * @param orientation Which way the carousel runs.
     */
    export const getTurnAxis = (placement: CarouselPlacement, orientation: CarouselOrientation): CarouselAxis =>
        placement.axis ?? (orientation === "horizontal" ? "row" : "column");

    /**
     * The transform that turns a slide's back to face the other way, so it shows once the slide has turned over.
     *
     * @param axis What the slide turns over about, from {@link getTurnAxis}.
     */
    export const getBackTransform = (axis: CarouselAxis) =>
        `rotate${axis === "row" ? "Y" : "X"}(${TURNED_OVER_DEGREES}deg)`;

    /**
     * Which slide a press landed on, among the ones drawn beside the slide showing.
     *
     * Slides overlap — a placement that fans or stacks them leaves most of each one under its neighbor — so the
     * topmost box under the press is often not the slide being aimed at. Of every slide whose drawn box holds the
     * point, the one whose middle is nearest wins, which is the one most of the press fell on.
     *
     * @param rects Each slide's drawn box, by index, as the browser reports it after the transform — the box of what
     * the slide draws rather than of the whole carousel it fills; `undefined` for a slide not to be picked.
     * @param point Where the press landed, in the same coordinates.
     * @returns The slide's index, or `undefined` when the press missed every one.
     */
    export const computeHitIndex = (rects: readonly (DOMRect | undefined)[], point: Point2d) => {
        let best: number | undefined;
        let bestDistance = Infinity;

        rects.forEach((rect, index) => {
            if (!rect) return;
            if (point.x < rect.left || point.x > rect.right || point.y < rect.top || point.y > rect.bottom) return;

            const distance = Math.hypot(
                point.x - (rect.left + rect.width * HALF),
                point.y - (rect.top + rect.height * HALF),
            );

            if (distance < bestDistance) {
                best = index;
                bestDistance = distance;
            }
        });

        return best;
    };
}
