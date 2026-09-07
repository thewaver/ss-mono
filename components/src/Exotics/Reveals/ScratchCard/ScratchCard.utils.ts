import { type Point2d, type Rect, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ScratchCardBrushShape } from "./ScratchCard.types";

const NOTHING = 0;
const HALF = 0.5;
const NO_EDGE_THICKNESSES = [0];
const CIRCLE_CLIP_PATH = "circle(50%)";
const BLUR_SPREAD = 3;
const COORDINATE_DIGITS = 1;

export namespace ScratchCardUtils {
    export const computeBrushPoints = (shape: ScratchCardBrushShape) =>
        shape.computePoints?.({ width: shape.radius * 2, height: shape.radius * 2 });

    export const computeBrushClipPath = (shape: ScratchCardBrushShape) => {
        const points = computeBrushPoints(shape);

        if (!points) return CIRCLE_CLIP_PATH;

        return `path("${ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, shape.joinRadii, shape.lameExponents).outerPath}")`;
    };

    export const computeBrushBox = (point: Point2d, radius: number): Rect => ({
        x: point.x - radius,
        y: point.y - radius,
        width: radius * 2,
        height: radius * 2,
    });

    export const computeBlurDeviation = (radius: number, softness: number) => ((1 - softness) * radius) / BLUR_SPREAD;

    export const computeStampPath = (point: Point2d, radius: number, points: Point2d[] | undefined) => {
        const at = (value: number) => value.toFixed(COORDINATE_DIGITS);

        if (!points) {
            const left = at(point.x - radius);
            const right = at(point.x + radius);
            const y = at(point.y);

            return `M${left} ${y}A${radius} ${radius} 0 1 0 ${right} ${y}A${radius} ${radius} 0 1 0 ${left} ${y}Z`;
        }

        const offset = { x: point.x - radius, y: point.y - radius };
        const [first, ...rest] = points;
        const start = `M${at(first.x + offset.x)} ${at(first.y + offset.y)}`;

        return rest.reduce((d, p) => `${d}L${at(p.x + offset.x)} ${at(p.y + offset.y)}`, start) + "Z";
    };

    export const computeProbePoints = (point: Point2d, radius: number): Point2d[] => [
        point,
        { x: point.x + radius, y: point.y },
        { x: point.x - radius, y: point.y },
        { x: point.x, y: point.y + radius },
        { x: point.x, y: point.y - radius },
    ];

    export const computeSamplePoints = (size: Size2d, precision: number): Point2d[] => {
        const side = Math.max(Math.round(precision), 1);
        const points: Point2d[] = [];

        for (let row = NOTHING; row < side; row++) {
            for (let column = NOTHING; column < side; column++) {
                points.push({ x: ((column + HALF) * size.width) / side, y: ((row + HALF) * size.height) / side });
            }
        }

        return points;
    };

    export const computeClearedRatio = (insideCount: number, sampleCount: number) =>
        sampleCount > NOTHING ? Math.min(insideCount / sampleCount, 1) : NOTHING;
}
