import { MathUtils, RotationUtils, type SwipeDirection } from "@thewaver/ss-utils";

import type { CarouselAxis, CarouselOrientation, CarouselStep } from "./Carousel.types";

/** Halfway, for comparing a turn against half the item count. */
const HALF = 0.5;

/** How far one slide is from the next along a track, as a percentage of the track's own length. */
const SLIDE_PERCENT = 100;

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
     * Whether the slides travel across the screen rather than up and down it.
     *
     * A track runs the way its orientation says; a drum turns about its axis, and a drum on the upright axis
     * carries its faces across. This decides both which way a swipe is taken and which way the track slides.
     *
     * @param isDrum Whether the carousel is a drum rather than a track.
     * @param axis The drum's axis. Ignored for a track.
     * @param orientation The track's orientation. Ignored for a drum.
     * @returns `true` when the slides move left and right.
     */
    export const getTravelsAcross = (isDrum: boolean, axis: CarouselAxis, orientation: CarouselOrientation) =>
        isDrum ? axis === "row" : orientation === "horizontal";

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
     * How far a drum is turned once its current slide changes.
     *
     * A drum's angle keeps accumulating rather than being worked out from the index, so a step from the last
     * slide to the first turns one face forwards rather than all the way back round. When the number of slides
     * changes the spacing changes with it, and the angle is set afresh from the index.
     *
     * @param angle The angle the drum is turned to now, in degrees.
     * @param previous The index and count the angle was last worked out for, or `undefined` the first time.
     * @param index The current slide.
     * @param count How many slides there are.
     * @returns The angle to turn to, in degrees.
     */
    export const computeTurnAngle = (
        angle: number,
        previous: { index: number; count: number } | undefined,
        index: number,
        count: number,
    ) => {
        const stepAngle = RotationUtils.getStepAngle(count);

        if (previous === undefined || previous.count !== count) return -stepAngle * index;

        if (previous.index === index) return angle;

        return angle - getTurnSteps(previous.index, index, count) * stepAngle;
    };

    /**
     * How far a drum is drawn turned, counting a swipe under way.
     *
     * @param turnAngle The angle the drum rests at, from {@link computeTurnAngle}.
     * @param swipeRatio The swipe's progress, from {@link clampSwipeRatio}.
     * @param count How many slides there are.
     * @returns The angle to draw, in degrees.
     */
    export const getDrumAngle = (turnAngle: number, swipeRatio: number, count: number) =>
        turnAngle + swipeRatio * RotationUtils.getStepAngle(count);

    /**
     * The transform that slides a track to its current slide, counting a swipe under way.
     *
     * @param travelsAcross Whether the track runs across, from {@link getTravelsAcross}.
     * @param swipeRatio The swipe's progress, from {@link clampSwipeRatio}.
     * @param index The current slide.
     * @returns A CSS `translateX` or `translateY`, in percent of the track.
     */
    export const getTrackTransform = (travelsAcross: boolean, swipeRatio: number, index: number) =>
        `translate${travelsAcross ? "X" : "Y"}(${(swipeRatio - index) * SLIDE_PERCENT}%)`;
}
