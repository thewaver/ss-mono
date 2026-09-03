import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { TrailStep } from "./Trail.types";

const NOTHING = 0;
const FULL_LAP = 1;

export namespace TrailUtils {
    export const getSteppedProgress = (
        progress: number,
        elapsedMs: number,
        durationMs: number,
        isLooping: boolean,
    ): TrailStep => {
        if (durationMs <= 0) return { progress: FULL_LAP, hasLapped: true };

        const stepped = MathUtils.clamp01(progress) + Math.max(NOTHING, elapsedMs) / durationMs;

        if (stepped < FULL_LAP) return { progress: stepped, hasLapped: false };
        if (!isLooping) return { progress: FULL_LAP, hasLapped: true };

        return { progress: stepped % FULL_LAP, hasLapped: true };
    };

    export const getSampleSpan = (length: number, at: number, step: number) => ({
        from: Math.max(NOTHING, at - step),
        to: Math.min(length, at + step),
    });

    export const getAngle = (from: Point2d, to: Point2d) =>
        Point2dUtils.radiansToDegrees(Math.atan2(to.y - from.y, to.x - from.x));
}
