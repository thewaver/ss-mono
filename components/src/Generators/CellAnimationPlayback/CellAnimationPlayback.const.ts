import type { CellAnimationPlaybackDirection } from "./CellAnimationPlayback.types";

export namespace CellAnimationPlayback {
    export const DIRECTIONS: readonly CellAnimationPlaybackDirection[] = [
        "normal",
        "reverse",
        "stack",
        "stack-reverse",
        "pipe",
        "pipe-reverse",
    ];
}
