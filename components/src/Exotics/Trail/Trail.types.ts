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
    /** The path the traveller walks, as SVG path data. */
    path: string;
    /** The box the path's coordinates are measured in, so the path scales with whatever room it is given. */
    size: Size2d;
    /** How long the traveller takes to walk the path once, end to end. */
    durationMs?: number;
    /** Sends the traveller round again as soon as it reaches the end. */
    isLooping?: boolean;
    /** Turns the traveller to point the way it is going, rather than leaving it upright the whole way round. */
    isTurning?: boolean;
    /** Turns the trail off, so the traveller stands still. */
    isDisabled?: boolean;
    /** How far along the path the traveller is. It is the only thing that moves it. */
    progressSignal?: SignalSource<number>;
    /** Whether the traveller is walking. It is the only thing that starts or stops it. */
    isPlayingSignal?: SignalSource<boolean>;
    /** Draws the path itself, where it should be visible. */
    renderTrack?: (getPath: Accessor<string>) => JSX.Element;
    /** Draws the traveller, and is told where on the path it is and which way it faces. */
    renderTraveler: (getPlace: Accessor<TrailPlace>) => JSX.Element;
    /** Runs each time the traveller reaches the end of the path. */
    onLap?: () => void;
    /** Hands the consumer a controller once the trail is up, for driving it from outside. */
    onMount?: (controller: TrailController) => void;
}>;
