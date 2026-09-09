import type { PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type {
    ArcDefs,
    BandDefs,
    FanDefs,
    FittedLayoutFn,
    HoneycombDefs,
    RadialTreeDefs,
    SizedLayout,
    SizedLayoutFn,
} from "./PlacementLayouts.types";

const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const CENTRE = 0.5;
const HALF = 0.5;
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;
const ROOT_LEVEL = 0;
const ROOT_PATH: number[] = [];
const NO_PARENT_WIDTH = 0;
const UPWARD_DEGREES = -90;
const FULL_SHARE = 1;
const AXIS_DEGREES = [-360, -270, -180, -90, 0, 90, 180, 270, 360];

type BandBase = Required<Omit<BandDefs, "centreRadiusPx" | "computeItemArcs">> & Pick<BandDefs, "centreRadiusPx">;

const RING_BASE: BandBase = {
    holeRadiusPx: 64,
    bandWidthPx: 84,
    levelGapPx: 8,
    wedgeGapDegrees: 3,
    wedgeArcPx: 120,
    hasCentreItem: false,
    labelRadiusRatio: 0.5,
    labelHeightRatio: 0.7,
    labelMaxWidthRatio: 1.6,
};

const HEMISPHERE_BASE: BandBase = {
    ...RING_BASE,
    holeRadiusPx: 110,
    bandWidthPx: 110,
    labelHeightRatio: 0.8,
    centreRadiusPx: 64,
};

const FAN_ITEM_WIDTH_PX = 168;
const FAN_ITEM_HEIGHT_PX = 40;
const FAN_STEP_DEGREES = 20;
const FAN_MAX_SPREAD_DEGREES = 160;
const FAN_GAP_PX = 14;
const FAN_TILT = 0.75;
const NO_TILT = 0;

const HONEYCOMB_CELL_WIDTH_PX = 76;
const HONEYCOMB_PER_ROW = 3;
const HONEYCOMB_GAP_PX = 4;
const HEX_HEIGHT_RATIO = 2 / Math.sqrt(3);
const HEX_ROW_STEP_RATIO = 0.75;
const EVEN_ROW = 0;
const ROW_PARITY = 2;
const ARC_WIDTH_PX = 320;
const ARC_HEIGHT_PX = 320;
const ARC_SPREAD_DEGREES = 180;
const ARC_ITEM_WIDTH_PX = 96;
const ARC_ITEM_HEIGHT_PX = 40;
const ARC_SAMPLES = 512;

const HEX_CLIP_PATH = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const toArc = (itemCount: number, radius: number, spreadDegrees: number, from: number): number[] => {
    if (itemCount <= SINGLE_ITEM) return [from];

    const spread = spreadDegrees / DEGREES_PER_RADIAN;
    const step = spread / (itemCount - SINGLE_ITEM);

    return Array.from({ length: itemCount }, (_unused, index) => from - spread / 2 + step * index);
};

const toPlacements = (
    angles: number[],
    radius: number,
    width: number,
    size: { w: number; h: number },
    tilt = NO_TILT,
) =>
    angles.map<PlacementRect>((angle) => ({
        left: CENTRE + (Math.cos(angle) * radius) / width,
        top: CENTRE + (Math.sin(angle) * radius) / width,
        width: size.w / width,
        height: size.h / width,
        angle: angle * DEGREES_PER_RADIAN * tilt,
    }));

const toChordAngle = (radius: number, chordPx: number) =>
    2 * Math.asin(Math.min(FULL_SHARE, (chordPx * HALF) / Math.max(radius, Number.EPSILON))) * DEGREES_PER_RADIAN;

const toSum = (values: number[]) => values.reduce((total, value) => total + value, NO_ITEMS);

type ArcBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    fromAngle?: number;
    toAngle?: number;
};

type ArcExtent = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

const toTurnExtent = (outerRadius: number): ArcExtent => ({
    left: -outerRadius,
    top: -outerRadius,
    right: outerRadius,
    bottom: outerRadius,
});

/**
 * The extremes of an elliptical arc are reached either at one of its two ends or where an axis crosses it,
 * so those are the only angles worth asking about and the answer is exact rather than sampled. The boxes
 * placed along it are thrown in because an item overhangs the curve it sits on.
 */
const toArcExtent = (boxes: ArcBox[], fromAngle: number, toAngle: number, radiusX: number, radiusY: number) => {
    const angles = [fromAngle, toAngle, ...AXIS_DEGREES.filter((angle) => angle > fromAngle && angle < toAngle)];
    const xs: number[] = [];
    const ys: number[] = [];

    for (const angle of angles) {
        const radians = angle / DEGREES_PER_RADIAN;

        xs.push(Math.cos(radians) * radiusX);
        ys.push(Math.sin(radians) * radiusY);
    }

    for (const box of boxes) {
        xs.push(box.x - box.width * HALF, box.x + box.width * HALF);
        ys.push(box.y - box.height * HALF, box.y + box.height * HALF);
    }

    return {
        left: Math.min(...xs),
        top: Math.min(...ys),
        right: Math.max(...xs),
        bottom: Math.max(...ys),
    };
};

const toEllipsePoint = (radiusX: number, radiusY: number, degrees: number) => {
    const radians = degrees / DEGREES_PER_RADIAN;

    return { x: Math.cos(radians) * radiusX, y: Math.sin(radians) * radiusY };
};

/**
 * Equal steps of angle are equal steps of distance on a circle and nowhere else: on an ellipse they crowd
 * toward the narrow ends, so a rating bent across a wide flat arc would bunch at both tips. This walks the
 * curve in small chords, keeps a running total of how far along each sample is, and then reads back the
 * angles at which that total hits each item's share — so the items are evenly spaced along the curve
 * whatever it has been stretched into, and a circle comes out exactly as equal angles would have left it.
 */
const toEvenArcAngles = (
    itemCount: number,
    radiusX: number,
    radiusY: number,
    fromAngle: number,
    toAngle: number,
    isClosed: boolean,
): number[] => {
    if (itemCount <= NO_ITEMS) return [];
    if (itemCount === SINGLE_ITEM) return [(fromAngle + toAngle) * HALF];

    const step = (toAngle - fromAngle) / ARC_SAMPLES;
    const walked: number[] = [NO_ITEMS];
    let previous = toEllipsePoint(radiusX, radiusY, fromAngle);
    let total = NO_ITEMS;

    for (let sample = SINGLE_ITEM; sample <= ARC_SAMPLES; sample++) {
        const point = toEllipsePoint(radiusX, radiusY, fromAngle + step * sample);

        total += Math.hypot(point.x - previous.x, point.y - previous.y);
        walked.push(total);
        previous = point;
    }

    const gaps = isClosed ? itemCount : itemCount - SINGLE_ITEM;
    const angles: number[] = [];
    let sample = NO_ITEMS;

    for (let index = NO_ITEMS; index < itemCount; index++) {
        const target = (total * index) / gaps;

        while (sample < ARC_SAMPLES - SINGLE_ITEM && walked[sample + SINGLE_ITEM] < target) sample++;

        const spanned = walked[sample + SINGLE_ITEM] - walked[sample];
        const share = spanned <= NO_ITEMS ? NO_ITEMS : (target - walked[sample]) / spanned;

        angles.push(fromAngle + step * (sample + share));
    }

    return angles;
};

export const createBand = (spreadDegrees: number, defs?: BandDefs): SizedLayoutFn => {
    const base = spreadDegrees >= FULL_TURN_DEGREES ? RING_BASE : HEMISPHERE_BASE;
    const holeRadiusPx = defs?.holeRadiusPx ?? base.holeRadiusPx;
    const bandWidthPx = defs?.bandWidthPx ?? base.bandWidthPx;
    const levelGapPx = defs?.levelGapPx ?? base.levelGapPx;
    const wedgeGapDegrees = defs?.wedgeGapDegrees ?? base.wedgeGapDegrees;
    const wedgeArcPx = defs?.wedgeArcPx ?? base.wedgeArcPx;
    const centreRadiusPx = defs?.centreRadiusPx ?? base.centreRadiusPx ?? holeRadiusPx;
    const hasCentreItem = defs?.hasCentreItem ?? base.hasCentreItem;
    const labelRadiusRatio = defs?.labelRadiusRatio ?? base.labelRadiusRatio;
    const labelHeightRatio = defs?.labelHeightRatio ?? base.labelHeightRatio;
    const labelMaxWidthRatio = defs?.labelMaxWidthRatio ?? base.labelMaxWidthRatio;
    const computeItemArcs = defs?.computeItemArcs;
    const isClosed = spreadDegrees >= FULL_TURN_DEGREES;

    return ({ itemCount, path = ROOT_PATH, parentWidth = NO_PARENT_WIDTH, parentPlacement }): SizedLayout => {
        const isRoot = path.length === ROOT_LEVEL;
        const hasCentre = hasCentreItem && isRoot;
        const arcCount = Math.max(hasCentre ? itemCount - SINGLE_ITEM : itemCount, NO_ITEMS);
        const innerRadius = isRoot ? holeRadiusPx : parentWidth * HALF + levelGapPx;
        const outerRadius = innerRadius + bandWidthPx;
        const labelRadius = innerRadius + bandWidthPx * labelRadiusRatio;

        const declared = computeItemArcs?.(path) ?? [];
        const asked = Array.from({ length: arcCount }, (_unused, index) => declared[index]);
        const askedTotal = toSum(asked.map((arc) => arc ?? NO_ITEMS));
        const freeCount = asked.filter((arc) => arc === undefined).length;
        const evenArc = isRoot
            ? Math.max(spreadDegrees - askedTotal, NO_ITEMS) / Math.max(freeCount, SINGLE_ITEM)
            : toChordAngle(labelRadius, wedgeArcPx);
        const wanted = asked.map((arc) => arc ?? evenArc);
        const total = toSum(wanted);
        const scale = isRoot || total > spreadDegrees ? spreadDegrees / Math.max(total, Number.EPSILON) : FULL_SHARE;
        const arcs = wanted.map((arc) => arc * scale);
        const blockArc = toSum(arcs);
        const fillsTurn = isClosed && isRoot;
        const centreOn = parentPlacement?.sector
            ? (parentPlacement.sector.fromAngle + parentPlacement.sector.toAngle) * HALF
            : UPWARD_DEGREES;
        const windowStart = UPWARD_DEGREES - spreadDegrees * HALF;
        const loose = centreOn - (fillsTurn ? (arcs[0] ?? NO_ITEMS) : blockArc) * HALF;
        const start = isClosed ? loose : Math.min(Math.max(loose, windowStart), windowStart + spreadDegrees - blockArc);

        const boxes: ArcBox[] = [];
        let walked = NO_ITEMS;

        for (let index = NO_ITEMS; index < arcCount; index++) {
            const fromAngle = start + walked + wedgeGapDegrees * HALF;
            const toAngle = start + walked + arcs[index] - wedgeGapDegrees * HALF;
            const centreAngle = (fromAngle + toAngle) * HALF;
            const radians = centreAngle / DEGREES_PER_RADIAN;
            const labelWidth = Math.min(
                2 * labelRadius * Math.sin((Math.max(toAngle - fromAngle, NO_ITEMS) * HALF) / DEGREES_PER_RADIAN),
                bandWidthPx * labelMaxWidthRatio,
            );

            walked += arcs[index];

            boxes.push({
                x: Math.cos(radians) * labelRadius,
                y: Math.sin(radians) * labelRadius,
                width: labelWidth,
                height: bandWidthPx * labelHeightRatio,
                fromAngle,
                toAngle,
            });
        }

        if (hasCentre) {
            boxes.push({ x: NO_ITEMS, y: NO_ITEMS, width: centreRadiusPx * 2, height: centreRadiusPx * 2 });
        }

        const extent = toTurnExtent(outerRadius);
        const width = extent.right - extent.left;
        const height = extent.bottom - extent.top;
        const origin = { x: -extent.left / width, y: -extent.top / width };

        const placements = boxes.map<PlacementRect>((box) => ({
            left: origin.x + box.x / width,
            top: origin.y + box.y / width,
            width: box.width / width,
            height: box.height / width,
            sector:
                box.fromAngle === undefined || box.toAngle === undefined
                    ? undefined
                    : {
                          innerRadius: innerRadius / width,
                          outerRadius: outerRadius / width,
                          fromAngle: box.fromAngle,
                          toAngle: box.toAngle,
                          origin,
                      },
        }));

        return { placements, width, heightRatio: height / width, pickRule: "angle", origin };
    };
};

export const createRing = (defs?: BandDefs) => createBand(FULL_TURN_DEGREES, defs);

export const createHemisphere = (defs?: BandDefs) => createBand(HALF_TURN_DEGREES, defs);

export const ring = createRing();

export const hemisphere = createHemisphere();

/**
 * Boxes spaced evenly along an elliptical arc that is given its own width and height, so the same call
 * draws a circle, a wide flat sweep or anything between. It places no wedges and nests into nothing,
 * which is what separates it from the band: a band sizes itself from radii and hands that size down to
 * the level inside it, and this one is told how big to be.
 */
export const createArc = (defs?: ArcDefs): SizedLayoutFn => {
    const widthPx = defs?.widthPx ?? ARC_WIDTH_PX;
    const heightPx = defs?.heightPx ?? ARC_HEIGHT_PX;
    const spreadDegrees = defs?.spreadDegrees ?? ARC_SPREAD_DEGREES;
    const itemWidthPx = defs?.itemWidthPx ?? ARC_ITEM_WIDTH_PX;
    const itemHeightPx = defs?.itemHeightPx ?? ARC_ITEM_HEIGHT_PX;

    return ({ itemCount }): SizedLayout => {
        const radiusX = widthPx * HALF;
        const radiusY = heightPx * HALF;
        const isClosed = spreadDegrees >= FULL_TURN_DEGREES;
        const fromAngle = isClosed ? UPWARD_DEGREES : UPWARD_DEGREES - spreadDegrees * HALF;
        const toAngle = fromAngle + spreadDegrees;
        const angles = toEvenArcAngles(itemCount, radiusX, radiusY, fromAngle, toAngle, isClosed);

        const boxes = angles.map<ArcBox>((angle) => {
            const point = toEllipsePoint(radiusX, radiusY, angle);

            return { x: point.x, y: point.y, width: itemWidthPx, height: itemHeightPx };
        });

        const extent = toArcExtent(boxes, fromAngle, toAngle, radiusX, radiusY);
        const width = extent.right - extent.left;
        const height = extent.bottom - extent.top;
        const origin = { x: -extent.left / width, y: -extent.top / width };

        return {
            placements: boxes.map<PlacementRect>((box) => ({
                left: origin.x + box.x / width,
                top: origin.y + box.y / width,
                width: box.width / width,
                height: box.height / width,
            })),
            width,
            heightRatio: height / width,
            pickRule: "angle",
            origin,
            radii: { x: radiusX / width, y: radiusY / width },
        };
    };
};

export const arc = createArc();

export const createFan = (defs?: FanDefs): SizedLayoutFn => {
    const itemWidthPx = defs?.itemWidthPx ?? FAN_ITEM_WIDTH_PX;
    const itemHeightPx = defs?.itemHeightPx ?? FAN_ITEM_HEIGHT_PX;
    const stepDegrees = defs?.stepDegrees ?? FAN_STEP_DEGREES;
    const maxSpreadDegrees = defs?.maxSpreadDegrees ?? FAN_MAX_SPREAD_DEGREES;
    const gapPx = defs?.gapPx ?? FAN_GAP_PX;
    const tiltRatio = defs?.tiltRatio ?? FAN_TILT;

    return ({ itemCount }): SizedLayout => {
        const spreadDegrees = Math.min(stepDegrees * Math.max(itemCount - SINGLE_ITEM, NO_ITEMS), maxSpreadDegrees);
        const spread = spreadDegrees / DEGREES_PER_RADIAN;
        const spacing = itemHeightPx + gapPx;
        const radius = Math.max(
            (spacing * Math.max(itemCount - SINGLE_ITEM, SINGLE_ITEM)) / Math.max(spread, Number.EPSILON),
            itemWidthPx,
        );
        const width = (radius + itemWidthPx / 2) * 2;
        const height = (radius * Math.sin(spread / 2) + itemHeightPx / 2) * 2;
        const angles = toArc(itemCount, radius, spreadDegrees, 0);

        return {
            placements: toPlacements(angles, radius, width, { w: itemWidthPx, h: itemHeightPx }, tiltRatio).map(
                (placement) => ({ ...placement, top: CENTRE * (height / width) + (placement.top - CENTRE) }),
            ),
            width,
            heightRatio: height / width,
            pickRule: "angle",
        };
    };
};

export const fan = createFan();

export const createHoneycomb = (defs?: HoneycombDefs): SizedLayoutFn => {
    const cellWidthPx = defs?.cellWidthPx ?? HONEYCOMB_CELL_WIDTH_PX;
    const perRow = Math.max(defs?.perRow ?? HONEYCOMB_PER_ROW, SINGLE_ITEM);
    const gapPx = defs?.gapPx ?? HONEYCOMB_GAP_PX;

    return ({ itemCount }): SizedLayout => {
        const cellHeightPx = cellWidthPx * HEX_HEIGHT_RATIO;
        const columnStepPx = cellWidthPx + gapPx;
        const rowStepPx = cellHeightPx * HEX_ROW_STEP_RATIO + gapPx;
        const rowCount = Math.max(Math.ceil(itemCount / perRow), SINGLE_ITEM);
        const columnCount = Math.min(itemCount, perRow);
        const hasStaggeredRow = rowCount > SINGLE_ITEM;
        const width = columnStepPx * columnCount + (hasStaggeredRow ? columnStepPx * HALF : NO_ITEMS);
        const height = rowStepPx * (rowCount - SINGLE_ITEM) + cellHeightPx;

        const placements = Array.from({ length: itemCount }, (_unused, index): PlacementRect => {
            const row = Math.floor(index / perRow);
            const stagger = row % ROW_PARITY === EVEN_ROW ? NO_ITEMS : columnStepPx * HALF;

            return {
                left: (stagger + columnStepPx * (index % perRow) + cellWidthPx * HALF) / width,
                top: (rowStepPx * row + cellHeightPx * HALF) / width,
                width: cellWidthPx / width,
                height: cellHeightPx / width,
                clipPath: HEX_CLIP_PATH,
            };
        });

        return { placements, width, heightRatio: height / width, pickRule: "nearest" };
    };
};

export const honeycomb = createHoneycomb();

const RADIAL_INNER_RADIUS_PX = 96;
const RADIAL_RING_GAP_PX = 104;
const RADIAL_ITEM_WIDTH_PX = 92;
const RADIAL_ITEM_HEIGHT_PX = 32;
const CENTRED_ROOT_COUNT = 1;
const NO_RADIUS = 0;
const NO_DEPTH = 0;

type RadialSpan = {
    from: number;
    to: number;
    depth: number;
};

/**
 * Children share the angular slice their parent was given, and each generation sits a ring further out.
 * The layout is told which item each item hangs from and works the rest out itself — depth is what the
 * chain of parents says it is, and a slice is what is left of the one above.
 */
const toRadialSpans = (itemCount: number, itemParents: (number | undefined)[], spreadDegrees: number) => {
    const byParent = new Map<number | undefined, number[]>();

    for (let index = NO_ITEMS; index < itemCount; index++) {
        const parent = itemParents[index];
        const siblings = byParent.get(parent) ?? [];

        siblings.push(index);
        byParent.set(parent, siblings);
    }

    const spans: RadialSpan[] = Array.from({ length: itemCount }, () => ({
        from: NO_ITEMS,
        to: NO_ITEMS,
        depth: NO_DEPTH,
    }));

    const assign = (parent: number | undefined, from: number, to: number, depth: number) => {
        const siblings = byParent.get(parent) ?? [];
        const step = (to - from) / Math.max(siblings.length, SINGLE_ITEM);

        siblings.forEach((child, order) => {
            const childFrom = from + step * order;

            spans[child] = { from: childFrom, to: childFrom + step, depth };
            assign(child, childFrom, childFrom + step, depth + SINGLE_ITEM);
        });
    };

    assign(undefined, UPWARD_DEGREES, UPWARD_DEGREES + spreadDegrees, NO_DEPTH);

    return { spans, rootCount: (byParent.get(undefined) ?? []).length };
};

export const createRadialTree = (defs?: RadialTreeDefs): SizedLayoutFn => {
    const innerRadiusPx = defs?.innerRadiusPx ?? RADIAL_INNER_RADIUS_PX;
    const ringGapPx = defs?.ringGapPx ?? RADIAL_RING_GAP_PX;
    const itemWidthPx = defs?.itemWidthPx ?? RADIAL_ITEM_WIDTH_PX;
    const itemHeightPx = defs?.itemHeightPx ?? RADIAL_ITEM_HEIGHT_PX;
    const spreadDegrees = defs?.spreadDegrees ?? FULL_TURN_DEGREES;

    return ({ itemCount, itemParents = [] }): SizedLayout => {
        const { spans, rootCount } = toRadialSpans(itemCount, itemParents, spreadDegrees);
        const radiusAt = (depth: number) =>
            depth === NO_DEPTH && rootCount === CENTRED_ROOT_COUNT ? NO_RADIUS : innerRadiusPx + ringGapPx * depth;
        const deepest = spans.reduce((lowest, span) => Math.max(lowest, span.depth), NO_DEPTH);
        const width = (radiusAt(deepest) + itemWidthPx * HALF) * 2;
        const origin = { x: CENTRE, y: CENTRE };

        const placements = spans.map<PlacementRect>((span) => {
            const radians = ((span.from + span.to) * HALF) / DEGREES_PER_RADIAN;
            const radius = radiusAt(span.depth);

            return {
                left: CENTRE + (Math.cos(radians) * radius) / width,
                top: CENTRE + (Math.sin(radians) * radius) / width,
                width: itemWidthPx / width,
                height: itemHeightPx / width,
            };
        });

        return { placements, width, heightRatio: 1, pickRule: "nearest", origin };
    };
};

export const radialTree = createRadialTree();

const WHORL_SIZE = 3;
const QUARTER = 0.25;

const toFittedLayout = (placements: PlacementRect[]) => ({
    placements,
    heightRatio: placements.reduce((lowest, placement) => Math.max(lowest, placement.top + placement.height * 0.5), 0),
});

const computeWhorl = (itemCount: number, itemSpacing: number, whorlSpacing: number): PlacementRect[] =>
    Array.from({ length: itemCount }, (_, index) => {
        const whorlTop = Math.floor(index / WHORL_SIZE) * QUARTER * whorlSpacing;
        const place = index % WHORL_SIZE;

        return {
            top: QUARTER + whorlTop + (place === 0 ? 0 : QUARTER * itemSpacing),
            left: QUARTER * (place === 0 ? 2 : place === 1 ? 1 : 3),
            width: QUARTER * 2,
            height: QUARTER * 2,
        };
    });

const podium: FittedLayoutFn = ({ itemCount }) =>
    toFittedLayout(
        Array.from({ length: itemCount }, (_, index) => {
            const whorlTop = Math.floor(index / WHORL_SIZE) * QUARTER * WHORL_SIZE;
            const place = index % WHORL_SIZE;
            const top = QUARTER + whorlTop;
            const left = QUARTER * 1.75;
            const size = QUARTER * 2;

            if (place === 1) {
                return { top: top + QUARTER, left: left + QUARTER, width: size, height: size };
            }

            if (place === 2) {
                return { top: top + QUARTER * 1.5, left: left - QUARTER * 0.5, width: size, height: size };
            }

            return { top, left, width: size, height: size };
        }),
    );

const whorlCircle: FittedLayoutFn = ({ itemCount }) => toFittedLayout(computeWhorl(itemCount, 1.75, 3.5));

const whorlHex: FittedLayoutFn = ({ itemCount }) => toFittedLayout(computeWhorl(itemCount, 1.5, 3));

const whorlSquare: FittedLayoutFn = ({ itemCount }) => toFittedLayout(computeWhorl(itemCount, 2, 4));

const ZIGZAG_SEGMENT_LENGTH = 2;

const zigzag: FittedLayoutFn = ({ itemCount }) => {
    const step = 1 / (1 + ZIGZAG_SEGMENT_LENGTH);
    const peak = ZIGZAG_SEGMENT_LENGTH - 1;

    return toFittedLayout(
        Array.from({ length: itemCount }, (_, index) => ({
            top: step * (index + 1),
            left: step * (peak - Math.abs((index % (peak * 2)) - peak) + 1),
            width: step * 2,
            height: step * 2,
        })),
    );
};

/**
 * The arrangements that came in with `Formation`, which take their width from the box they are given rather
 * than stating one. They are `PlacementLayoutFn`s like the rest, so any placed control can be handed one.
 */
export namespace FittedLayouts {
    export const SAMPLE_LAYOUTS = {
        podium,
        whorlCircle,
        whorlHex,
        whorlSquare,
        zigzag,
    } satisfies Record<string, FittedLayoutFn>;

    export type SampleKey = keyof typeof SAMPLE_LAYOUTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_LAYOUTS) as SampleKey[];
}
