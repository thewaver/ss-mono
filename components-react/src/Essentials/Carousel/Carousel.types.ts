import type { ReactNode } from "react";

import type {
    CarouselLabels,
    CarouselOrientation,
    CarouselPickRenderProps,
    CarouselPlacementFn,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselStep,
    CarouselStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

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

export type CarouselState = {
    /** How long a slide is held before the carousel moves on by itself. */
    autoplayDelayMs?: number;
    /** How long the move from one slide to the next takes. */
    transitionDurationMs?: number;
    /** The space between the slides and the controls the consumer draws beside them. */
    gap?: number;
    /** Turns the carousel off, so neither its controls nor its swipes do anything. */
    isDisabled?: boolean;
    /**
     * Whether stepping past the last slide comes round to the first, and back from the first to the last.
     * Defaults to `true`. When off, the Previous control on the first slide and the Next control on the last
     * are disabled and refuse, a swipe past either end springs back, and automatic rotation stops on the last
     * slide by writing `false` to `playback`. With looping off, distances are counted straight rather than the
     * short way round, so a placement that closes into a ring — the drum — shows a seam where the ends meet.
     */
    isLooping?: boolean;
    /** Names the carousel for assistive technology. */
    ariaLabel: string;
};

export type CarouselSlots<T> = {
    /** The slides, in the order they are shown. */
    slides: T[];
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
    /** Runs when a different slide comes up. */
    onIndexChange?: (index: number) => void;
};

export type CarouselProps<T> = CarouselState &
    CarouselLabels &
    CarouselSlots<T> & {
        /** Which way the slides run, which is the way the carousel is swiped. */
        orientation?: CarouselOrientation;
        /**
         * Where each slide is drawn, from how far it is from the one showing. It is handed the slide's distance —
         * counted in slides, fractional while the carousel moves, and the short way round when it loops — with the
         * carousel's box, and answers with the transforms and filters that put the slide there, as a proximity effect
         * does. `CarouselPlacementUtils` ships the track, the drum, cover flow, a depth wave, a cylinder, a stack of
         * folders and a hinge, each tunable; a rule of the consumer's own is any function of the same shape. Every
         * slide fills the carousel's box before it is placed, and the box clips them. A press on a slide drawn beside
         * the one showing brings it up, worked out from where the press landed rather than from which slide is on
         * top; the pickers stay the keyboard's way to do the same.
         */
        computePlacement: CarouselPlacementFn;
        /**
         * Draws the back of a slide, for a placement that turns slides over: the drum, the hinge. The back faces the
         * other way from the front, so whichever way the slide is turned shows the right one; it is hidden from
         * assistive technology. Left out, a turned slide shows its front from behind.
         */
        renderSlideBack?: (slide: T, state: CarouselSlideState) => ReactNode;
    };
