import type { ReactNode } from "react";

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

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { CarouselState };

export type CarouselControlProps = InteractionControlProps & {
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
    /** Draws one of the move controls. */
    renderStep: (step: CarouselStep) => ReactNode;
    /**
     * Draws the picker that jumps straight to one slide. It carries its index as its key, so a list of them needs
     * none.
     */
    renderPick: (index: number) => ReactNode;
    /** Draws the play and pause control. */
    renderRotationControl: () => ReactNode;
};

export type CarouselSlots<T> = {
    /**
     * Which slide is showing. Writing it moves the carousel there, gliding the short way round on one that loops.
     * While `progress` is written from outside, it follows whichever slide is nearest.
     */
    index?: readonly [number, (value: number) => void];
    /**
     * Where the carousel is, `0` to `1`, for driving it from outside — from a scroll position or a pointer, say. On a
     * looping carousel `0` to `1` is one whole lap, so `1` is the first slide again; on one that stops at its ends it
     * runs from the first slide to the last. The carousel writes it as it glides, so it can also be read. A carousel
     * driven this way is one given no controls, so its swipes and presses are left to the page.
     */
    progress?: readonly [number, (value: number) => void];
    /** Whether the carousel is advancing by itself. It is the only thing that starts or stops it. */
    playback?: readonly [boolean, (value: boolean) => void];
    /**
     * Draws one slide. It is handed where the slide stands relative to the one showing, its distance from it
     * included, so a slide can dim or label itself by how far away it is.
     */
    renderSlide: (slide: T, state: CarouselSlideState) => ReactNode;
    /** Draws one of the move controls. */
    renderStep?: (step: CarouselStep, renderProps: InteractionFlags<CarouselStepRenderProps>) => ReactNode;
    /** Draws one of the pickers that jump straight to a slide. */
    renderPick?: (index: number, renderProps: InteractionFlags<CarouselPickRenderProps>) => ReactNode;
    /** Draws the play and pause control. */
    renderRotationControl?: (flags: InteractionFlags<CarouselRotationFlags>) => ReactNode;
    /**
     * Draws the controls as a group, for a consumer that wants them somewhere other than where the carousel would put
     * them. A carousel drawn without it takes no swipes either, since the consumer is then the one moving it.
     */
    renderControls?: (controls: CarouselControls) => ReactNode;
};

export type CarouselProps<T> = BaseCarouselProps<T> &
    CarouselSlots<T> & {
        /**
         * Draws the back of a slide, for a placement that turns slides over: the drum, the hinge. The back faces the
         * other way from the front, so whichever way the slide is turned shows the right one; it is hidden from
         * assistive technology. Left out, a turned slide shows its front from behind.
         */
        renderSlideBack?: (slide: T, state: CarouselSlideState) => ReactNode;
    };
