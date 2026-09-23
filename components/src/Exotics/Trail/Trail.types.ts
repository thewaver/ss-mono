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
    /**
     * Moves the traveler to a point along the path.
     *
     * @param progress Where to go, `0`–`1`. Values outside that are clamped rather than refused.
     * @returns `false` when the clamped position is the one it already holds.
     */
    seek: (progress: number) => boolean;
};

export type TrailProps = AccessorProps<{
    /** The path the traveler walks, as SVG path data. */
    path: string;
    /** The box the path's coordinates are measured in, so the path scales with whatever room it is given. */
    size: Size2d;
    /** How long the traveler takes to walk the path once, end to end. */
    durationMs?: number;
    /** Sends the traveler round again as soon as it reaches the end. */
    isLooping?: boolean;
    /** Turns the traveler to point the way it is going, rather than leaving it upright the whole way round. */
    isTurning?: boolean;
    /** Turns the trail off, so the traveler stands still. */
    isDisabled?: boolean;
    /**
     * Puts several travelers on the one path, each this share of the path behind the lead, which is `0`.
     *
     * One entry per traveler, in the order `renderTraveler` is handed their indices, so `[0, 0.1, 0.2]` is a
     * lead and two followers a tenth of the path apart. Every traveler runs off the same clock and the same
     * progress. On a looping path the followers come round behind the lead from the start; on one that stops,
     * they wait bunched at the start until the lead is their offset ahead, and the run ends when the last one
     * arrives. Offsets below zero count as zero. Leaving it out is a lone traveler.
     */
    followerOffsets?: number[];
    /**
     * How far the run has gone, `0` to `1`. It is the only thing that moves the travelers.
     *
     * With a lone traveler it is that traveler's place along the path. With followers on a path that stops,
     * the run lasts until the last of them arrives, so `1` is everybody at the end.
     */
    progressSignal?: SignalSource<number>;
    /** Whether the traveler is walking. It is the only thing that starts or stops it. */
    playbackSignal?: SignalSource<boolean>;
    /** Draws the path itself, where it should be visible. */
    renderTrack?: (getPath: Accessor<string>) => JSX.Element;
    /**
     * Draws a traveler, and is told where on the path it is and which way it faces.
     *
     * Called once per entry of `followerOffsets`, with that entry's index, so the lead and its followers can
     * be drawn differently.
     */
    renderTraveler: (getPlace: Accessor<TrailPlace>, index: number) => JSX.Element;
    /** Runs each time the traveler reaches the end of the path. */
    onLap?: () => void;
    /** Hands the consumer a controller once the trail is up, for driving it from outside. */
    onMount?: (controller: TrailController) => void;
}>;
