import type { Accessor, JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type TrailPlace = {
    progress: number;
    point: Point2d;
    angle: number;
};

export type TrailStep = {
    progress: number;
    hasLapped: boolean;
};

export type TrailController = {
    getPlace: Accessor<TrailPlace>;
    getIsPlaying: Accessor<boolean>;
    play: () => void;
    pause: () => void;
    seek: (progress: number) => void;
};

export type TrailProps = AccessorProps<{
    path: string;
    size: Size2d;
    durationMs?: number;
    isLooping?: boolean;
    isTurning?: boolean;
    isDisabled?: boolean;
    progressSignal?: SignalSource<number>;
    isPlayingSignal?: SignalSource<boolean>;
    renderTrack?: (getPath: Accessor<string>) => JSX.Element;
    renderTraveller: (getPlace: Accessor<TrailPlace>) => JSX.Element;
    onLap?: () => void;
    onMount?: (controller: TrailController) => void;
}>;
