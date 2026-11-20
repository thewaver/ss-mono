import { AngleUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";

export const FULL_TURN_DEGREES = 360;
export const QUARTER_TURN_DEGREES = 90;
export const HALF = 0.5;
export const SINGLE_ITEM = 1;
export const NO_ITEMS = 0;
export const NOTHING = 0;
export const FULL_SHARE = 1;
export const AXIS_DEGREES = [-360, -270, -180, -90, 0, 90, 180, 270, 360];
export const HEX_HEIGHT_RATIO = 2 / Math.sqrt(3);
export const HEX_ROW_STEP_RATIO = 0.75;
export const EVEN_ROW = 0;
export const ROW_PARITY = 2;
export const ARC_SAMPLES = 512;
export const OVAL_WIDTH = 1;
export const UNSCALED = 1;
export const NO_SPREAD_DEGREES = 0;
export const NO_HOLE = 0;
export const WHOLE_RADIUS = 1;
export const CELL_WIDTH = 1;
export const ITEM_QUARTERS = 2;
export const HEX_CLIP_PATH = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
export const QUARTER = 0.25;
export const WHORL_SIZE = 3;
export const CLIFF_SIZE = 3;
export const CLIFF_CENTER = 0.5;
export const CLIFF_SHIFT_RATIOS = [0, 0.5, -0.25];
export const CLIFF_DROP_RATIOS = [0, 0.5, 0.75];

export const toSum = (values: number[]) => values.reduce((total, value) => total + value, NOTHING);

export type ArcBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    tiltDegrees?: number;
    fromAngle?: number;
    toAngle?: number;
};

export type ArcExtent = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

export const toTurnExtent = (outerRadius: number): ArcExtent => ({
    left: -outerRadius,
    top: -outerRadius,
    right: outerRadius,
    bottom: outerRadius,
});

export type ArcSpan = {
    low: number;
    high: number;
};

export const toSpan = (values: number[]): ArcSpan => ({ low: Math.min(...values), high: Math.max(...values) });

export const toHalfSize = (width: number, height: number, tiltDegrees: number): Point2d => {
    const radians = tiltDegrees * AngleUtils.RADIANS_PER_DEGREE;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));

    return { x: (width * cos + height * sin) * HALF, y: (width * sin + height * cos) * HALF };
};

export const toFillingScale = (room: number, span: ArcSpan) => {
    const length = span.high - span.low;

    return length > NOTHING ? (room * 2) / length : Number.POSITIVE_INFINITY;
};

export const toFittingScale = (room: number, halfSize: number, reach: number) =>
    halfSize > room || reach === NOTHING ? Number.POSITIVE_INFINITY : (room - halfSize) / Math.abs(reach);

export const toEllipsePoint = (radiusX: number, radiusY: number, degrees: number) => {
    const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;

    return { x: Math.cos(radians) * radiusX, y: Math.sin(radians) * radiusY };
};

export const toEvenArcAngles = (
    itemCount: number,
    radiusX: number,
    radiusY: number,
    fromAngle: number,
    toAngle: number,
): number[] => {
    if (itemCount <= NO_ITEMS) return [];
    if (itemCount === SINGLE_ITEM) return [(fromAngle + toAngle) * HALF];

    const step = (toAngle - fromAngle) / ARC_SAMPLES;
    const walked: number[] = [NOTHING];
    let previous = toEllipsePoint(radiusX, radiusY, fromAngle);
    let total = NOTHING;

    for (let sample = SINGLE_ITEM; sample <= ARC_SAMPLES; sample++) {
        const point = toEllipsePoint(radiusX, radiusY, fromAngle + step * sample);

        total += Point2dUtils.getDistance(previous, point);
        walked.push(total);
        previous = point;
    }

    const gaps = itemCount - SINGLE_ITEM;
    const angles: number[] = [];
    let sample = NOTHING;

    for (let index = NOTHING; index < itemCount; index++) {
        const target = (total * index) / gaps;

        while (sample < ARC_SAMPLES - SINGLE_ITEM && walked[sample + SINGLE_ITEM] < target) sample++;

        const spanned = walked[sample + SINGLE_ITEM] - walked[sample];
        const share = spanned <= NOTHING ? NOTHING : (target - walked[sample]) / spanned;

        angles.push(fromAngle + step * (sample + share));
    }

    return angles;
};

export const toFittedLayout = (placements: PlacementRect[]) => ({
    placements,
    heightRatio: placements.reduce(
        (lowest, placement) => Math.max(lowest, placement.topShare + placement.heightShare * HALF),
        NOTHING,
    ),
});

export const toRun = (itemCount: number, size: Point2d, gap: number, isVertical: boolean): PlacementRect[] => {
    const step = (isVertical ? size.y : size.x) + gap;

    return Array.from({ length: itemCount }, (_unused, index) => ({
        leftShare: isVertical ? FULL_SHARE * HALF : size.x * HALF + step * index,
        topShare: isVertical ? size.y * HALF + step * index : size.y * HALF,
        widthShare: size.x,
        heightShare: size.y,
    }));
};

export const computeWhorl = (itemCount: number, itemStepRatio: number, whorlStepRatio: number): PlacementRect[] =>
    Array.from({ length: itemCount }, (_, index) => {
        const itemSize = QUARTER * ITEM_QUARTERS;
        const itemDrop = itemSize * itemStepRatio;
        const whorlTop = Math.floor(index / WHORL_SIZE) * (itemDrop + itemSize * whorlStepRatio);
        const place = index % WHORL_SIZE;

        return {
            topShare: QUARTER + whorlTop + (place === 0 ? NOTHING : itemDrop),
            leftShare: QUARTER * (place === 0 ? 2 : place === 1 ? 1 : 3),
            widthShare: itemSize,
            heightShare: itemSize,
        };
    });
