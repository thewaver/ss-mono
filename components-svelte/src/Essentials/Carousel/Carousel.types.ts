import type { Snippet } from "svelte";

import type {
    BaseCarouselProps,
    CarouselPickRenderProps,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselState,
    CarouselStep,
    CarouselStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type { CarouselState };

export type CarouselControlProps<TExtra extends object = {}> = InteractionControlProps<TExtra> & {
    /** Whether this is the slide currently showing. */
    isCurrent: boolean;
    /** Runs when this slide is activated. */
    onActivate: () => void;
};

export type CarouselControls = {
    /** Which slide is showing. */
    index: number;
    /** How many slides there are. */
    count: number;
    /** Whether the carousel is advancing by itself. */
    isPlaying: boolean;
    /** Whether the pointer, focus or a hidden tab is holding it still. */
    isHeld: boolean;
    /** Draws one of the move controls, with `{@render controls.renderStep("next")}`. */
    renderStep: Snippet<[step: CarouselStep]>;
    /** Draws the picker that jumps straight to one slide. */
    renderPick: Snippet<[index: number]>;
    /** Draws the play and pause control. */
    renderRotationControl: Snippet;
};

export type CarouselSlots<T> = {
    /**
     * Which slide is showing. Writing it moves the carousel there, gliding the short way round on one that loops.
     * While `progress` is written from outside, it follows whichever slide is nearest. Bind it with `bind:index` to
     * drive or follow it; left unbound, the carousel keeps its own, starting at the first slide.
     */
    index?: number;
    /**
     * Where the carousel is, `0` to `1`, for driving it from outside — from a scroll position or a pointer, say. On a
     * looping carousel `0` to `1` is one whole lap, so `1` is the first slide again; on one that stops at its ends it
     * runs from the first slide to the last. The carousel writes it as it glides, so it can also be read. A carousel
     * driven this way is one given no controls, so its swipes and presses are left to the page. Bind it with
     * `bind:progress` to drive or follow it.
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
    /** Draws one of the move controls. */
    renderStep?: Snippet<[step: CarouselStep, renderProps: InteractionFlags<CarouselStepRenderProps>]>;
    /** Draws one of the pickers that jump straight to a slide. */
    renderPick?: Snippet<[index: number, renderProps: InteractionFlags<CarouselPickRenderProps>]>;
    /** Draws the play and pause control. */
    renderRotationControl?: Snippet<[flags: InteractionFlags<CarouselRotationFlags>]>;
    /**
     * Draws the controls as a group, for a consumer that wants them somewhere other than where the carousel would put
     * them. A carousel drawn without it takes no swipes either, since the consumer is then the one moving it.
     */
    renderControls?: Snippet<[controls: CarouselControls]>;
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
