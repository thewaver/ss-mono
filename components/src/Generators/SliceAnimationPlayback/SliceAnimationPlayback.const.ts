import type { SliceAnimationPlaybackDirection } from "./SliceAnimationPlayback.types";

export const SLICE_ANIMATION_PLAYBACK_DEFAULTS = {
    holdMs: 0,
};

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
