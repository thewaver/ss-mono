import type { BaseCellAnimationProps } from "@thewaver/ss-components";

export type CellAnimationProps = BaseCellAnimationProps & {
    /**
     * Whether the animation is running. Bind it with `bind:playback`; it is the only thing that starts or pauses it.
     * Playing when left out.
     */
    playback?: boolean;
    /**
     * How far through the current pass the grid is, `0`–`1`. Bind it with `bind:progress`. The component writes it as
     * the pass runs, and writing it moves the pass there: while playing it carries on from the new point, and with
     * playback paused it scrubs, the grid drawn at whatever is written. It goes back to `0` at the start of each pass
     * and when `src` changes.
     */
    progress?: number;
};
