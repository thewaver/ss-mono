export type SliceAnimationPlaybackDirection =
    "normal" | "reverse" | "stack" | "stack_reverse" | "pipe" | "pipe_reverse";

export type SliceAnimationPlaybackOpts = {
    dir?: SliceAnimationPlaybackDirection;
    holdMs?: number;
};
