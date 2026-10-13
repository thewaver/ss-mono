import type { BaseCellAnimationProps } from "@thewaver/ss-components";

export type CellAnimationProps = BaseCellAnimationProps & {
    /** Whether the animation is running. It is the only thing that starts or pauses it. */
    playback?: readonly [boolean, (value: boolean) => void];
    /**
     * How far through the current pass the grid is, `0`–`1`. The component writes it as the pass runs, and writing it
     * moves the pass there: while playing it carries on from the new point, and with playback paused it scrubs, the
     * grid drawn at whatever is written. It goes back to `0` at the start of each pass and when `src` changes.
     */
    progress?: readonly [number, (value: number) => void];
};
