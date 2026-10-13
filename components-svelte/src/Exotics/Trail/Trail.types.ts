import type { Snippet } from "svelte";

import type { BaseTrailProps, TrailPlace } from "@thewaver/ss-components";

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

export type TrailProps = BaseTrailProps & {
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
    /** Hands the consumer a controller once the trail is up, for driving it from outside. */
    onMount?: (controller: TrailController) => void;
};
