import type { CellAnimationPlaybackDirection } from "./CellAnimationPlayback.types";

export namespace CellAnimationPlayback {
    export const DIRECTIONS: readonly CellAnimationPlaybackDirection[] = [
        "normal",
        "reverse",
        "alternate",
        "alternate-reverse",
    ];
}
