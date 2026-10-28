import type { BaseRGBAnimationProps } from "@thewaver/ss-components";

export type RGBAnimationProps = BaseRGBAnimationProps & {
    /**
     * Whether the animation is running. Bind it with `bind:playback`; it is the only thing that starts or pauses it,
     * and the pause a page owes a visitor for motion that starts by itself. Playing when left out.
     */
    playback?: boolean;
    /**
     * How far through the current pass the animation is, `0`–`1`. Bind it with `bind:progress`. The component writes
     * it as the pass runs, and writing it moves the pass there: while playing it carries on from the new point, and
     * with playback paused it scrubs, the channels drawn at whatever is written. It goes back to `0` at the start of
     * each pass and when `src` changes.
     */
    progress?: number;
};
