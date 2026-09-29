import type { Snippet } from "svelte";
import type { TrailPlace } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";
export type TrailController = {
    /**
     * Where the lead traveler is and which way it faces. It is live: read in an effect, a `$derived` or markup, it
     * follows the traveler.
     */
    getPlace: () => TrailPlace;
    /** Whether the trail is walking. It is live, as `getPlace` is. */
    getIsPlaying: () => boolean;
    /**
     * Moves the traveler to a point along the path.
     *
     * @param progress Where to go, `0`–`1`. Values outside that are clamped rather than refused.
     * @returns `false` when the clamped position is the one it already holds.
     */
    seek: (progress: number) => boolean;
};
export type TrailProps = {
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
     * the run lasts until the last of them arrives, so `1` is everybody at the end. Bind it with `bind:progress` to
     * drive or follow it.
     */
    progress?: number;
    /**
     * Whether the traveler is walking. Bind it with `bind:playback`; it is the only thing that starts or stops it.
     * Walking when left out.
     */
    playback?: boolean;
    /** Draws the path itself, where it should be visible. */
    renderTrack?: Snippet<[path: string]>;
    /**
     * Draws a traveler, and is told where on the path it is and which way it faces.
     *
     * Called once per entry of `followerOffsets`, with that entry's index, so the lead and its followers can
     * be drawn differently.
     */
    renderTraveler: Snippet<[place: TrailPlace, index: number]>;
    /** Runs each time the traveler reaches the end of the path. */
    onLap?: () => void;
    /** Hands the consumer a controller once the trail is up, for driving it from outside. */
    onMount?: (controller: TrailController) => void;
};
