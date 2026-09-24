export type CellAnimationPlaybackDirection = "normal" | "reverse" | "alternate" | "alternate-reverse";

export type CellAnimationPlaybackOpts = {
    dir?: CellAnimationPlaybackDirection;
    holdMs?: number;
};
