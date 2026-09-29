import type { VNodeChild } from "vue";

import type {
    CarouselAxis,
    CarouselLabels,
    CarouselOrientation,
    CarouselPickRenderProps,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselState,
    CarouselStep,
    CarouselStepRenderProps,
    CarouselVariant,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapper.types";

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
    renderStep: (step: CarouselStep) => VNodeChild;
    /**
     * Draws the picker that jumps straight to one slide. It carries its index as its key, so a list of them needs
     * none.
     */
    renderPick: (index: number) => VNodeChild;
    /** Draws the play and pause control. */
    renderRotationControl: () => VNodeChild;
};

export type CarouselContentProps<T> = {
    /** The slides, in the order they are shown. */
    "slides": T[];
    /** Which slide is showing. It is the only thing that moves the carousel. */
    "index"?: number;
    /** Receives the carousel's own moves, which is what `v-model:index` binds. */
    "onUpdate:index"?: (index: number) => void;
    /** Whether the carousel is advancing by itself. It is the only thing that starts or stops it. */
    "playback"?: boolean;
    /** Receives the carousel starting or stopping itself, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    /** Runs when a different slide comes up. */
    "onIndexChange"?: (index: number) => void;
};

export type CarouselSlots<T> = {
    /** Draws one slide. It is handed where the slide stands relative to the one showing. */
    renderSlide: (props: { slide: T; state: CarouselSlideState }) => VNodeChild;
    /** Draws one of the move controls. */
    renderStep?: (props: {
        step: CarouselStep;
        renderProps: InteractionFlags<CarouselStepRenderProps>;
    }) => VNodeChild;
    /** Draws one of the pickers that jump straight to a slide. */
    renderPick?: (props: { index: number; renderProps: InteractionFlags<CarouselPickRenderProps> }) => VNodeChild;
    /** Draws the play and pause control. */
    renderRotationControl?: (flags: InteractionFlags<CarouselRotationFlags>) => VNodeChild;
    /**
     * Draws the controls as a group, for a consumer that wants them somewhere other than where the carousel would put
     * them. A carousel drawn without it takes no swipes either, since the consumer is then the one moving it.
     */
    renderControls?: (controls: CarouselControls) => VNodeChild;
};

export type CarouselBackSlot<T> = {
    /** Draws the back of a slide, for a look where slides turn over rather than moving aside. */
    renderSlideBack: (props: { slide: T; state: CarouselSlideState }) => VNodeChild;
};

export type CarouselProps<T> = CarouselState &
    CarouselLabels &
    CarouselContentProps<T> & {
        /** Which of the carousel's looks this is. */
        variant: CarouselVariant;
        /** Which way the slides run. */
        orientation?: CarouselOrientation;
        /** Which way round the slides turn. */
        axis?: CarouselAxis;
        /** How large one slide is. */
        slideSize?: Size2d;
    };

export type TrackCarouselProps<T> = CarouselState &
    CarouselLabels &
    CarouselContentProps<T> & {
        /** Which way the slides run. */
        orientation?: CarouselOrientation;
    };

export type DrumCarouselProps<T> = CarouselState &
    CarouselLabels &
    CarouselContentProps<T> & {
        /** Which way round the slides turn. */
        axis?: CarouselAxis;
        /** How large one slide is. */
        slideSize: Size2d;
    };

export type DrumCarouselSlots<T> = CarouselSlots<T> & CarouselBackSlot<T>;
