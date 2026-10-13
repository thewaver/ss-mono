import type { VNodeChild } from "vue";

import type { BaseTrailProps, TrailPlace } from "@thewaver/ss-components";

export type TrailController = {
    /**
     * Where the lead traveler is and which way it faces. It reads the trail's reactive state, so a template or a
     * `computed` calling it follows the traveler.
     */
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
};

export type TrailProps = BaseTrailProps & {
    /**
     * How far the run has gone, `0` to `1`. It is the only thing that moves the travelers.
     *
     * With a lone traveler it is that traveler's place along the path. With followers on a path that stops,
     * the run lasts until the last of them arrives, so `1` is everybody at the end.
     */
    "progress"?: number;
    /** Receives the run's progress as it goes, which is what `v-model:progress` binds. */
    "onUpdate:progress"?: (progress: number) => void;
    /** Whether the traveler is walking. It is the only thing that starts or stops it. */
    "playback"?: boolean;
    /** Receives the trail stopping itself at the end of a run, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    /** Hands the consumer a controller once the trail is up, for driving it from outside. */
    "onMount"?: (controller: TrailController) => void;
};

export type TrailSlots = {
    /** Draws the path itself, where it should be visible. */
    renderTrack: (path: string) => VNodeChild;
    /**
     * Draws a traveler, and is told where on the path it is and which way it faces.
     *
     * Drawn once per entry of `followerOffsets`, with that entry's index, so the lead and its followers can
     * be drawn differently.
     */
    renderTraveler: (props: { place: TrailPlace; index: number }) => VNodeChild;
};
