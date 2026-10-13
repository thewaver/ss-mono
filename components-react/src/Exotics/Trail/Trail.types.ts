import type { ReactNode } from "react";

import type { BaseTrailProps, TrailPlace } from "@thewaver/ss-components";

export type TrailController = {
    /** Where the lead traveler is and which way it faces, as last drawn. */
    getPlace: () => TrailPlace;
    /** Whether the trail is walking. */
    getIsPlaying: () => boolean;
    /**
     * Moves the traveler to a point along the path.
     *
     * @param progress Where to go, `0`–`1`. Values outside that are clamped rather than refused.
     * @returns `false` when the clamped position is the one it already holds.
     */
    seek: (progress: number) => boolean;
    /**
     * Calls `listener` whenever anything the getters report has changed, until the returned function is called. The
     * getters answer with what the trail last drew, so this and one getter are what `useSyncExternalStore` takes —
     * which is how a consumer's readout follows the traveler.
     */
    subscribe: (listener: () => void) => () => void;
};

export type TrailProps = BaseTrailProps & {
    /**
     * How far the run has gone, `0` to `1`. It is the only thing that moves the travelers.
     *
     * With a lone traveler it is that traveler's place along the path. With followers on a path that stops,
     * the run lasts until the last of them arrives, so `1` is everybody at the end.
     */
    progress?: readonly [number, (value: number) => void];
    /** Whether the traveler is walking. It is the only thing that starts or stops it. */
    playback?: readonly [boolean, (value: boolean) => void];
    /** Draws the path itself, where it should be visible. */
    renderTrack?: (path: string) => ReactNode;
    /**
     * Draws a traveler, and is told where on the path it is and which way it faces.
     *
     * Called once per entry of `followerOffsets`, with that entry's index, so the lead and its followers can
     * be drawn differently.
     */
    renderTraveler: (place: TrailPlace, index: number) => ReactNode;
    /** Hands the consumer a controller once the trail is up, for driving it from outside. */
    onMount?: (controller: TrailController) => void;
};
