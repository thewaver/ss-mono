import { MathUtils } from "@thewaver/ss-utils";

export namespace CellAnimationPlayback {
    export const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"] as const;
    export type Direction = (typeof DIRECTIONS)[number];

    export type PlaybackOpts = {
        dir?: Direction;
        holdMs?: number;
    };

    const DEFAULT_DIRECTION: Direction = "normal";
    const DEFAULT_HOLD_MS = 0;

    const isAlternating = (dir: Direction) => dir === "alternate" || dir === "alternate-reverse";

    const computeAlternated = (progress: number, outward: number) => {
        if (outward <= 0) return 1;
        if (progress < outward) return progress / outward;
        if (progress < 1 - outward) return 1;

        return (1 - progress) / outward;
    };

    export const computeCycleDurationMs = (durationMs: number, opts?: PlaybackOpts) => {
        if (!isAlternating(opts?.dir ?? DEFAULT_DIRECTION)) return durationMs;

        return durationMs * 2 + Math.max(opts?.holdMs ?? DEFAULT_HOLD_MS, 0);
    };

    export const computeGlobalTimeline = (timeline: number, durationMs: number, opts?: PlaybackOpts) => {
        const dir = opts?.dir ?? DEFAULT_DIRECTION;
        const progress = MathUtils.clamp01(timeline);

        if (!isAlternating(dir)) return dir === "reverse" ? 1 - progress : progress;

        const cycleMs = computeCycleDurationMs(durationMs, opts);
        const outward = cycleMs > 0 ? MathUtils.clamp01(durationMs / cycleMs) : 0;
        const alternated = computeAlternated(progress, outward);

        return dir === "alternate-reverse" ? 1 - alternated : alternated;
    };
}
