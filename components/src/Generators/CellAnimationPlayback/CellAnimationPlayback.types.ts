export type CellAnimationPlaybackDirection = "normal" | "reverse" | "stack" | "stack_reverse" | "pipe" | "pipe_reverse";

export type CellAnimationPlaybackOpts = {
    dir?: CellAnimationPlaybackDirection;
    holdMs?: number;
};
