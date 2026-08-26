import type { Accessor, JSX, Signal } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "../../Abstracts/Barrel/Barrel.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";
import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapper.types";

export type CarouselVariant = "track" | "drum";

export type CarouselDir = "row" | "column";

export type CarouselAxis = BarrelAxis;

export type CarouselFace = BarrelFace;

export type CarouselStep = "previous" | "next";

export type CarouselSlideState = {
    index: number;
    count: number;
    face: CarouselFace;
    isCurrent: boolean;
};

export type CarouselStepFlags = {
    step: CarouselStep;
    targetIndex: number;
};

export type CarouselPickFlags = {
    index: number;
    isCurrent: boolean;
};

export type CarouselRotationFlags = {
    isPlaying: boolean;
    isHeld: boolean;
};

export type CarouselControlProps = AccessorProps<
    InteractionControlProps & {
        isCurrent: boolean;
    }
> & {
    onActivate: () => void;
};

export type CarouselControls = {
    getIndex: Accessor<number>;
    getCount: Accessor<number>;
    getIsPlaying: Accessor<boolean>;
    getIsHeld: Accessor<boolean>;
    renderStep: (step: CarouselStep) => JSX.Element;
    renderPick: (index: number) => JSX.Element;
    renderRotationControl: () => JSX.Element;
};

export type CarouselState = {
    autoplayDelayMs?: number;
    transitionDurationMs?: number;
    gap?: number;
    isDisabled?: boolean;
    ariaLabel: string;
};

export type CarouselLabels = {
    computeSlideLabel?: (index: number, count: number) => string;
    computeStepLabel?: (step: CarouselStep) => string;
    computeRotationLabel?: (isPlaying: boolean) => string;
};

export type CarouselSlots<T> = {
    slides: MaybeAccessor<T[]>;
    indexSignal?: Signal<number>;
    playingSignal?: Signal<boolean>;
    renderSlide: (getSlide: Accessor<T>, getState: Accessor<CarouselSlideState>) => JSX.Element;
    renderStep?: (getStep: Accessor<CarouselStep>, getFlags: () => InteractionFlags<CarouselStepFlags>) => JSX.Element;
    renderPick?: (getIndex: Accessor<number>, getFlags: () => InteractionFlags<CarouselPickFlags>) => JSX.Element;
    renderRotationControl?: (getFlags: () => InteractionFlags<CarouselRotationFlags>) => JSX.Element;
    renderControls?: (controls: CarouselControls) => JSX.Element;
    onIndexChange?: (index: number) => void;
};

export type CarouselProps<T> = AccessorProps<
    CarouselState &
        CarouselLabels & {
            variant: CarouselVariant;
            dir?: CarouselDir;
            axis?: CarouselAxis;
            slideSize?: Size2d;
        }
> &
    CarouselSlots<T> & {
        renderSlideBack?: (getSlide: Accessor<T>, getState: Accessor<CarouselSlideState>) => JSX.Element;
    };

export type TrackCarouselProps<T> = AccessorProps<
    CarouselState &
        CarouselLabels & {
            dir?: CarouselDir;
        }
> &
    CarouselSlots<T>;

export type DrumCarouselProps<T> = AccessorProps<
    CarouselState &
        CarouselLabels & {
            axis?: CarouselAxis;
            slideSize: Size2d;
        }
> &
    CarouselSlots<T> & {
        renderSlideBack: (getSlide: Accessor<T>, getState: Accessor<CarouselSlideState>) => JSX.Element;
    };
