import type { ReactNode } from "react";

import type {
    CarouselAxis,
    CarouselLabels,
    CarouselOrientation,
    CarouselPickRenderProps,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselStep,
    CarouselStepRenderProps,
    CarouselVariant,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapper.types";

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
    /** The space between slides. */
    gap?: number;
    /** Turns the carousel off, so neither its controls nor its swipes do anything. */
    isDisabled?: boolean;
    /**
     * Whether stepping past the last slide comes round to the first, and back from the first to the last.
     * Defaults to `true`. When off, the Previous control on the first slide and the Next control on the last
     * are disabled and refuse, a swipe past either end springs back, and automatic rotation stops on the last
     * slide by writing `false` to `playback`. A drum carousel is a closed ring whose last face sits
     * beside its first, so the default is the right one there: turned off, the drum stops against a seam
     * nothing on screen shows.
     */
    isLooping?: boolean;
    /** Names the carousel for assistive technology. */
    ariaLabel: string;
};

export type CarouselSlots<T> = {
    /** The slides, in the order they are shown. */
    slides: T[];
    /** Which slide is showing. It is the only thing that moves the carousel. */
    index?: readonly [number, (value: number) => void];
    /** Whether the carousel is advancing by itself. It is the only thing that starts or stops it. */
    playback?: readonly [boolean, (value: boolean) => void];
    /** Draws one slide. It is handed where the slide stands relative to the one showing. */
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
        /** Which of the carousel's looks this is. */
        variant: CarouselVariant;
        /** Which way the slides run. */
        orientation?: CarouselOrientation;
        /** Which way round the slides turn. */
        axis?: CarouselAxis;
        /** How large one slide is. */
        slideSize?: Size2d;
        /** Draws the back of a slide, for a look where slides turn over rather than moving aside. */
        renderSlideBack?: (slide: T, state: CarouselSlideState) => ReactNode;
    };

export type TrackCarouselProps<T> = CarouselState &
    CarouselLabels &
    CarouselSlots<T> & {
        /** Which way the slides run. */
        orientation?: CarouselOrientation;
    };

export type DrumCarouselProps<T> = CarouselState &
    CarouselLabels &
    CarouselSlots<T> & {
        /** Which way round the slides turn. */
        axis?: CarouselAxis;
        /** How large one slide is. */
        slideSize: Size2d;
        /** Draws the back of a slide, for a look where slides turn over rather than moving aside. */
        renderSlideBack: (slide: T, state: CarouselSlideState) => ReactNode;
    };
