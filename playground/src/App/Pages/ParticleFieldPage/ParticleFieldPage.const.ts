import { ParticleFieldUtils } from "@thewaver/ss-components";
import type { Point2d, Rect } from "@thewaver/ss-utils";

export const computeParticleTimeline = (t: number, holdShare: number) => {
    const edge = (1 - holdShare) * 0.5;

    if (edge <= 0) return 1;

    if (t < edge) return t / edge;

    if (t > 1 - edge) return (1 - t) / edge;

    return 1;
};

export const computeParticlePos = (rect: Rect, isScattered: boolean): Point2d =>
    isScattered
        ? { x: rect.x + Math.random() * rect.width, y: rect.y + Math.random() * rect.height }
        : ParticleFieldUtils.toCenter(rect);
