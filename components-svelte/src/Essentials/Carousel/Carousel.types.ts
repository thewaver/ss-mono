import type { Snippet } from "svelte";

import type { BaseCarouselProps, CarouselSlideState, CarouselState, CarouselStep } from "@thewaver/ss-components";

export type { CarouselState };

export type CarouselControls = {
    /**
     * Which slide is showing, counting from zero — with `computeGroups`, which group. Read inside an effect, a `$derived` or markup, it is followed as the
     * carousel moves, which is how a consumer's buttons keep up with it.
     */
    getIndex: () => number;
    /**
     * How many slides there are — with `computeGroups`, how many groups, which is how many pickers to draw. Followed
     * the same way as `getIndex`.
     */
    getCount: () => number;
    /** Whether the carousel is advancing by itself. Followed the same way as `getIndex`. */
    getIsPlaying: () => boolean;
    /**
     * Whether the pointer, focus, a hidden tab or the page is holding it still for now. Followed the same way as
     * `getIndex`.
     */
    getIsHeld: () => boolean;
    /**
     * Whether a step would do anything, so a button standing for it can be disabled. Followed the same way as
     * `getIndex`.
     *
     * @param step Which way the step would go.
     * @returns `false` when the carousel is disabled, has nothing to step between, or does not loop and is at that end.
     */
    getCanStep: (step: CarouselStep) => boolean;
    /**
     * Moves one slide on or back, as a swipe would — with `computeGroups`, one group.
     *
     * @param step Which way to move.
     * @returns `false` when the step is refused — see {@link CarouselControls.getCanStep}.
     */
    step: (step: CarouselStep) => boolean;
    /**
     * Brings one slide up, gliding the short way round on a carousel that loops.
     *
     * @param index The slide, counting from zero — with `computeGroups`, the group.
     * @returns `false` when the carousel is disabled, the slide does not exist, or it is already showing.
     */
    pick: (index: number) => boolean;
    /**
     * Starts or stops the carousel advancing by itself.
     *
     * @param isPlaying Whether it should advance.
     * @returns `false` when the carousel is disabled or was already in that state.
     */
    setIsPlaying: (isPlaying: boolean) => boolean;
    /**
     * Holds the carousel still for now, or lets it go, on behalf of the page — for the pointer or keyboard focus
     * resting on controls the page drew outside the carousel, which it cannot see. The carousel's own holds stay in
     * force until they lift by themselves, and whether it is playing is left alone.
     *
     * @param isHeld Whether the page is holding it.
     * @returns `false` when the page's hold was already in that state.
     */
    setIsHeldByPage: (isHeld: boolean) => boolean;
};

export type CarouselSlots<T> = {
    /**
     * Which slide is showing. Writing it moves the carousel there, gliding the short way round on one that loops.
     * While `progress` is written from outside, it follows whichever slide is nearest. With `computeGroups` it counts
     * groups, since a slide in two overlapping groups cannot say which of them is showing. Bind it with `bind:index`
     * to drive or follow it; left unbound, the carousel keeps its own, starting at the first slide.
     */
    index?: number;
    /**
     * Where the carousel is, `0` to `1`, for driving it from outside — from a scroll position or a pointer, say. On a
     * looping carousel `0` to `1` is one whole lap, so `1` is the first slide again; on one that stops at its ends it
     * runs from the first slide to the last. With `computeGroups`, `0` is the first group at rest and the far end the
     * last group at rest, or the first again on a looping carousel. The carousel writes it as it glides, so it can
     * also be read. A carousel driven this way is moved by the page, so its swipes and presses are left to the page.
     * Bind it with `bind:progress` to drive or follow it; whether it was passed is read once, as the carousel is
     * built.
     */
    progress?: number;
    /**
     * Whether the carousel is advancing by itself. Bind it with `bind:playback` to drive or follow it; left unbound,
     * the carousel keeps its own, starting on.
     */
    playback?: boolean;
    /**
     * Draws one slide. It is handed where the slide stands relative to the one showing, its distance from it
     * included, so a slide can dim or label itself by how far away it is.
     */
    renderSlide: Snippet<[slide: T, state: CarouselSlideState]>;
    /**
     * Hands the consumer the controls once the carousel is up, for driving it from outside.
     *
     * **Anything that moves a slide without a swipe, and anything that stops it rotating, has to be built on these.**
     * The carousel draws its slides and nothing else, so the buttons belong to whoever is drawing the page and may sit
     * anywhere on it. That matters beyond layout: a swipe is a dragging movement, so
     * {@link https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html WCAG 2.5.7} asks for a single-pointer
     * route that is not a drag — `step` and `pick` are it — and a carousel that advances by itself needs a way to pause
     * it under {@link https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html WCAG 2.2.2}, which
     * `setIsPlaying` is. Wiring them up is the consumer's to do.
     */
    onMount?: (controls: CarouselControls) => void;
};

export type CarouselProps<T> = BaseCarouselProps<T> &
    CarouselSlots<T> & {
        /**
         * Draws the back of a slide, for a placement that turns slides over: the drum, the hinge. The back faces the
         * other way from the front, so whichever way the slide is turned shows the right one; it is hidden from
         * assistive technology. Left out, a turned slide shows its front from behind.
         */
        renderSlideBack?: Snippet<[slide: T, state: CarouselSlideState]>;
    };
