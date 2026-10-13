import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type TrailPlace = {
    progress: number;
    point: Point2d;
    angle: number;
};

export type TrailStep = {
    progress: number;
    hasLapped: boolean;
};

export type BaseTrailValues = {
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
};

export type BaseTrailCbs = {
    /** Runs each time the traveler reaches the end of the path. */
    onLap?: () => void;
};

export type BaseTrailProps = BaseTrailValues & BaseTrailCbs;
