import type { SliceAnimationPlaybackDirection } from "./SliceAnimationPlayback.types";

export namespace SliceAnimationPlayback {
    export const DIRECTIONS: readonly SliceAnimationPlaybackDirection[] = [
        "normal",
        "reverse",
        "stack",
        "stack_reverse",
        "pipe",
        "pipe_reverse",
    ];
}
