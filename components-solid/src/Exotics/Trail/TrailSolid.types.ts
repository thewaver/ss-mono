import type { Accessor, JSX } from "solid-js";

import type { BaseTrailCbs, BaseTrailValues, TrailPlace } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../Utils/typeUtils";

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

export type TrailProps = AccessorValues<BaseTrailValues> &
    BaseTrailCbs & {
        /**
         * How far the run has gone, `0` to `1`. It is the only thing that moves the travelers.
         *
         * With a lone traveler it is that traveler's place along the path. With followers on a path that stops,
         * the run lasts until the last of them arrives, so `1` is everybody at the end.
         */
        progress?: SignalSource<number>;
        /** Whether the traveler is walking. It is the only thing that starts or stops it. */
        playback?: SignalSource<boolean>;
        /** Draws the path itself, where it should be visible. */
        renderTrack?: (getPath: Accessor<string>) => JSX.Element;
        /**
         * Draws a traveler, and is told where on the path it is and which way it faces.
         *
         * Called once per entry of `followerOffsets`, with that entry's index, so the lead and its followers can
         * be drawn differently.
         */
        renderTraveler: (getPlace: Accessor<TrailPlace>, index: number) => JSX.Element;
        /** Hands the consumer a controller once the trail is up, for driving it from outside. */
        onMount?: (controller: TrailController) => void;
    };
