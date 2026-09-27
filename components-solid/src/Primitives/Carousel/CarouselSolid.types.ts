import type { Accessor, JSX } from "solid-js";

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

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";
import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapperSolid.types";

export type CarouselControlProps = AccessorProps<
    InteractionControlProps & {
        /** Whether this is the slide currently showing. */
        isCurrent: boolean;
        /** Runs when this slide is activated. */
        onActivate: () => void;
    }
>;

export type CarouselControls = {
    getIndex: Accessor<number>;
    getCount: Accessor<number>;
    getIsPlaying: Accessor<boolean>;
    getIsHeld: Accessor<boolean>;
    renderStep: (step: CarouselStep) => JSX.Element;
    renderPick: (index: number) => JSX.Element;
    renderRotationControl: () => JSX.Element;
};

export type CarouselSlots<T> = {
    /** The slides, in the order they are shown. */
    slides: MaybeAccessor<T[]>;
    /** Which slide is showing. It is the only thing that moves the carousel. */
    indexSignal?: SignalSource<number>;
    /** Whether the carousel is advancing by itself. It is the only thing that starts or stops it. */
    playbackSignal?: SignalSource<boolean>;
    /** Draws one slide. It is handed where the slide stands relative to the one showing. */
    renderSlide: (getSlide: Accessor<T>, getState: Accessor<CarouselSlideState>) => JSX.Element;
    /** Draws one of the move controls. */
    renderStep?: (
        getStep: Accessor<CarouselStep>,
        getRenderProps: () => InteractionFlags<CarouselStepRenderProps>,
    ) => JSX.Element;
    /** Draws one of the pickers that jump straight to a slide. */
    renderPick?: (
        getIndex: Accessor<number>,
        getRenderProps: () => InteractionFlags<CarouselPickRenderProps>,
    ) => JSX.Element;
    /** Draws the play and pause control. */
    renderRotationControl?: (getFlags: () => InteractionFlags<CarouselRotationFlags>) => JSX.Element;
    /**
     * Draws the controls as a group, for a consumer that wants them somewhere other than where the carousel would put
     * them.
     */
    renderControls?: (controls: CarouselControls) => JSX.Element;
    /** Runs when a different slide comes up. */
    onIndexChange?: (index: number) => void;
};

export type CarouselProps<T> = AccessorProps<
    CarouselState &
        CarouselLabels & {
            /** Which of the carousel's looks this is. */
            variant: CarouselVariant;
            /** Which way the slides run. */
            orientation?: CarouselOrientation;
            /** Which way round the slides turn. */
            axis?: CarouselAxis;
            /** How large one slide is. */
            slideSize?: Size2d;
        }
> &
    CarouselSlots<T> & {
        /** Draws the back of a slide, for a look where slides turn over rather than moving aside. */
        renderSlideBack?: (getSlide: Accessor<T>, getState: Accessor<CarouselSlideState>) => JSX.Element;
    };

export type TrackCarouselProps<T> = AccessorProps<
    CarouselState &
        CarouselLabels & {
            /** Which way the slides run. */
            orientation?: CarouselOrientation;
        }
> &
    CarouselSlots<T>;

export type DrumCarouselProps<T> = AccessorProps<
    CarouselState &
        CarouselLabels & {
            /** Which way round the slides turn. */
            axis?: CarouselAxis;
            /** How large one slide is. */
            slideSize: Size2d;
        }
> &
    CarouselSlots<T> & {
        /** Draws the back of a slide, for a look where slides turn over rather than moving aside. */
        renderSlideBack: (getSlide: Accessor<T>, getState: Accessor<CarouselSlideState>) => JSX.Element;
    };
