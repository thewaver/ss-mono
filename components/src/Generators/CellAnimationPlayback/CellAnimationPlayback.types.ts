export type CellAnimationPlaybackDirection = "normal" | "reverse" | "stack" | "stack-reverse" | "pipe" | "pipe-reverse";

export type CellAnimationPlaybackOpts = {
    dir?: CellAnimationPlaybackDirection;
    holdMs?: number;
};
