import { AngleUtils, type Point2d } from "@thewaver/ss-utils";

import type { PlacementLayoutFn, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import { PlacementLayoutKnobs } from "./PlacementLayouts.knobs";
import type {
    ArcDefs,
    BandDefs,
    CliffDefs,
    ColumnDefs,
    FittedLayoutFn,
    HoneycombDefs,
    PlacementLayoutEntry,
    RowDefs,
    SizedLayout,
    SizedLayoutFn,
    WhorlDefs,
    ZigzagDefs,
} from "./PlacementLayouts.types";

const FULL_TURN_DEGREES = 360;
const HALF = 0.5;
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;
const NOTHING = 0;
const FULL_SHARE = 1;
const AXIS_DEGREES = [-360, -270, -180, -90, 0, 90, 180, 270, 360];
const NO_TILT = 0;
const HEX_HEIGHT_RATIO = 2 / Math.sqrt(3);
const HEX_ROW_STEP_RATIO = 0.75;
const EVEN_ROW = 0;
const ROW_PARITY = 2;
const ARC_SAMPLES = 512;
const CURVE_WIDTH = 1;
const NO_SPREAD_DEGREES = 0;
const NO_HOLE = 0;
const WHOLE_RADIUS = 1;
const CELL_WIDTH = 1;
const ITEM_QUARTERS = 2;
const HEX_CLIP_PATH = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const QUARTER = 0.25;
const WHORL_SIZE = 3;
const CLIFF_SIZE = 3;
const CLIFF_CENTER = 0.5;
const CLIFF_SHIFT_RATIOS = [0, 0.5, -0.25];
const CLIFF_DROP_RATIOS = [0, 0.5, 0.75];

const toSum = (values: number[]) => values.reduce((total, value) => total + value, NOTHING);

type ArcBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    tiltDegrees?: number;
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

const toArcExtent = (boxes: ArcBox[], fromAngle: number, toAngle: number, radiusX: number, radiusY: number) => {
    const angles = [fromAngle, toAngle, ...AXIS_DEGREES.filter((angle) => angle > fromAngle && angle < toAngle)];
    const xs: number[] = [];
    const ys: number[] = [];

    for (const angle of angles) {
        const radians = angle * AngleUtils.RADIANS_PER_DEGREE;

        xs.push(Math.cos(radians) * radiusX);
        ys.push(Math.sin(radians) * radiusY);
    }

    for (const box of boxes) {
        const radians = (box.tiltDegrees ?? NO_TILT) * AngleUtils.RADIANS_PER_DEGREE;
        const cos = Math.abs(Math.cos(radians));
        const sin = Math.abs(Math.sin(radians));
        const halfWidth = (box.width * cos + box.height * sin) * HALF;
        const halfHeight = (box.width * sin + box.height * cos) * HALF;

        xs.push(box.x - halfWidth, box.x + halfWidth);
        ys.push(box.y - halfHeight, box.y + halfHeight);
    }

    return {
        left: Math.min(...xs),
        top: Math.min(...ys),
        right: Math.max(...xs),
        bottom: Math.max(...ys),
    };
};

const toEllipsePoint = (radiusX: number, radiusY: number, degrees: number) => {
    const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;

    return { x: Math.cos(radians) * radiusX, y: Math.sin(radians) * radiusY };
};

const toEvenArcAngles = (
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

        total += Math.hypot(point.x - previous.x, point.y - previous.y);
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

const toFittedLayout = (placements: PlacementRect[]) => ({
    placements,
    heightRatio: placements.reduce(
        (lowest, placement) => Math.max(lowest, placement.top + placement.height * HALF),
        NOTHING,
    ),
});

/**
 * Lays a run of equal boxes along one axis, the first one's near edge against the start of the box.
 *
 * The cross axis is centered for a column and left where the caller put it for a row, which is what
 * makes {@link toFittedLayout}'s height come out as the run's own extent rather than as the box's.
 */
const toRun = (itemCount: number, size: Point2d, gap: number, isVertical: boolean): PlacementRect[] => {
    const step = (isVertical ? size.y : size.x) + gap;

    return Array.from({ length: itemCount }, (_unused, index) => ({
        left: isVertical ? FULL_SHARE * HALF : size.x * HALF + step * index,
        top: isVertical ? size.y * HALF + step * index : size.y * HALF,
        width: size.x,
        height: size.y,
    }));
};

const computeWhorl = (itemCount: number, itemStepRatio: number, whorlStepRatio: number): PlacementRect[] =>
    Array.from({ length: itemCount }, (_, index) => {
        const itemSize = QUARTER * ITEM_QUARTERS;
        const itemDrop = itemSize * itemStepRatio;
        const whorlTop = Math.floor(index / WHORL_SIZE) * (itemDrop + itemSize * whorlStepRatio);
        const place = index % WHORL_SIZE;

        return {
            top: QUARTER + whorlTop + (place === 0 ? NOTHING : itemDrop),
            left: QUARTER * (place === 0 ? 2 : place === 1 ? 1 : 3),
            width: itemSize,
            height: itemSize,
        };
    });

/**
 * The arrangements this library ships, as factories a consumer can tune or take as they are.
 *
 * A layout is nothing more than a function from an item count to a list of boxes — see
 * {@link PlacementUtils} for what those boxes mean — so these are examples of writing one rather than
 * the only ones a control will accept. Two families are worth telling apart: a sized layout states the
 * width it was authored at, so a menu can grow its levels in the ratios the layout chose, and a fitted
 * one has no size of its own and fills whatever room it is given.
 *
 * Every number is unit-less. The arrangement is the library's and the pixels are the consumer's, which
 * is the same split an SVG draws.
 */
export namespace PlacementLayoutUtils {
    /**
     * The angle a straight span of a given length subtends at a given radius.
     *
     * A band's items are sized across the band rather than by angle, so a caller that knows how wide an item
     * has to be needs the arc that width costs at the radius it sits on — which shrinks as the radius grows.
     * Spans wider than the circle saturate at half a turn rather than returning `NaN`.
     *
     * @param radius Distance from the center to the span.
     * @param chord Length of the span, in the same units as the radius.
     * @returns The angle in degrees, from `0` to `180`.
     */
    export const toChordAngle = (radius: number, chord: number) =>
        2 *
        Math.asin(Math.min(FULL_SHARE, (chord * HALF) / Math.max(radius, Number.EPSILON))) *
        AngleUtils.DEGREES_PER_RADIAN;

    /**
     * Places items round a band, at even angles.
     *
     * Each item is given the wedge of the ring it sits in as well as its box, so a control can hand its
     * painter a shape rather than a rectangle. A spread below a whole turn opens the band into an arc of
     * wedges, and the box is snapped to what the items actually cover rather than to the whole circle.
     *
     * @param defs How wide the band is, which way it faces, and how its items sit on it.
     * @returns A layout function, sized — it states the width it was drawn at.
     */
    export const createRing = (defs?: BandDefs): SizedLayoutFn => {
        const base = PlacementLayoutKnobs.BAND_DEFAULTS;
        const spreadDegrees = Math.min(
            Math.max(defs?.spreadDegrees ?? base.spreadDegrees, NO_SPREAD_DEGREES),
            FULL_TURN_DEGREES,
        );
        const facingDegrees = defs?.facingDegrees ?? base.facingDegrees;
        const holeRatio = Math.min(Math.max(defs?.holeRatio ?? base.holeRatio, NO_HOLE), WHOLE_RADIUS);
        const bandWidth = WHOLE_RADIUS - holeRatio;
        const wedgeGapDegrees = defs?.wedgeGapDegrees ?? base.wedgeGapDegrees;
        const tiltRatio = defs?.tiltRatio ?? base.tiltRatio;
        const itemRadiusRatio = defs?.itemRadiusRatio ?? base.itemRadiusRatio;
        const itemHeightRatio = defs?.itemHeightRatio ?? base.itemHeightRatio;
        const itemMaxWidthRatio = defs?.itemMaxWidthRatio ?? base.itemMaxWidthRatio;
        const computeItemArcs = defs?.computeItemArcs;
        const innerRadius = holeRatio;
        const outerRadius = WHOLE_RADIUS;
        const itemRadius = innerRadius + bandWidth * itemRadiusRatio;

        return ({ itemCount }): SizedLayout => {
            const declared = computeItemArcs?.() ?? [];
            const asked = Array.from({ length: itemCount }, (_unused, index) => declared[index]);
            const askedTotal = toSum(asked.map((arc) => arc ?? NOTHING));
            const freeCount = asked.filter((arc) => arc === undefined).length;
            const evenArc = Math.max(spreadDegrees - askedTotal, NOTHING) / Math.max(freeCount, SINGLE_ITEM);
            const wanted = asked.map((arc) => arc ?? evenArc);
            const total = toSum(wanted);
            const arcs = wanted.map((arc) => (arc * spreadDegrees) / Math.max(total, Number.EPSILON));
            const blockArc = toSum(arcs);
            const start = facingDegrees - blockArc * HALF;

            const boxes: ArcBox[] = [];
            let walked = NOTHING;

            for (let index = NOTHING; index < itemCount; index++) {
                const fromAngle = start + walked + wedgeGapDegrees * HALF;
                const toAngle = start + walked + arcs[index] - wedgeGapDegrees * HALF;
                const centerAngle = (fromAngle + toAngle) * HALF;
                const radians = centerAngle * AngleUtils.RADIANS_PER_DEGREE;
                const itemWidth = Math.min(
                    2 *
                        itemRadius *
                        Math.sin(Math.max(toAngle - fromAngle, NOTHING) * HALF * AngleUtils.RADIANS_PER_DEGREE),
                    bandWidth * itemMaxWidthRatio,
                );

                walked += arcs[index];

                boxes.push({
                    x: Math.cos(radians) * itemRadius,
                    y: Math.sin(radians) * itemRadius,
                    width: itemWidth,
                    height: itemWidth * itemHeightRatio,
                    tiltDegrees: centerAngle * tiltRatio,
                    fromAngle,
                    toAngle,
                });
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
                angle: box.tiltDegrees,
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

            return {
                placements,
                extent: width,
                heightRatio: height / width,
                pickRule: "angle",
                reachRule: "arc",
                origin,
            };
        };
    };

    /** {@link createRing} at its defaults. */
    export const ring = createRing();

    /**
     * Places items along a curve, evenly spaced by the distance walked rather than by angle.
     *
     * The difference matters once the curve is not a circle: stepping by angle bunches the items where an
     * ellipse is flat. A height ratio away from one is what flattens or stretches it, and the items can
     * be tilted to follow the curve or left upright.
     *
     * @param defs How far the curve sweeps, which way it faces, how round it is, and how large its items are.
     * @returns A layout function, sized — it states the width it was drawn at.
     */
    export const createArc = (defs?: ArcDefs): SizedLayoutFn => {
        const curveHeightRatio = defs?.curveHeightRatio ?? PlacementLayoutKnobs.ARC_DEFAULTS.curveHeightRatio;
        const spreadDegrees = defs?.spreadDegrees ?? PlacementLayoutKnobs.ARC_DEFAULTS.spreadDegrees;
        const facingDegrees = defs?.facingDegrees ?? PlacementLayoutKnobs.ARC_DEFAULTS.facingDegrees;
        const tiltRatio = defs?.tiltRatio ?? PlacementLayoutKnobs.ARC_DEFAULTS.tiltRatio;
        const itemWidth = defs?.itemWidthRatio ?? PlacementLayoutKnobs.ARC_DEFAULTS.itemWidthRatio;
        const itemHeight = itemWidth * (defs?.itemHeightRatio ?? PlacementLayoutKnobs.ARC_DEFAULTS.itemHeightRatio);

        return ({ itemCount }): SizedLayout => {
            const radiusX = CURVE_WIDTH * HALF;
            const radiusY = curveHeightRatio * HALF;
            const widestSpread =
                (FULL_TURN_DEGREES * Math.max(itemCount - SINGLE_ITEM, NOTHING)) / Math.max(itemCount, SINGLE_ITEM);
            const spread = Math.min(Math.max(spreadDegrees, NO_SPREAD_DEGREES), widestSpread);
            const fromAngle = facingDegrees - spread * HALF;
            const toAngle = fromAngle + spread;
            const angles = toEvenArcAngles(itemCount, radiusX, radiusY, fromAngle, toAngle);

            const boxes = angles.map<ArcBox>((angle) => {
                const point = toEllipsePoint(radiusX, radiusY, angle);

                return { x: point.x, y: point.y, width: itemWidth, height: itemHeight, tiltDegrees: angle * tiltRatio };
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
                    angle: box.tiltDegrees,
                })),
                extent: width,
                heightRatio: height / width,
                pickRule: "angle",
                reachRule: "arc",
                origin,
                radii: { x: radiusX / width, y: radiusY / width },
            };
        };
    };

    /** {@link createArc} at its defaults. */
    export const arc = createArc();

    /**
     * Places items in a line across the box, filling its width.
     *
     * The arrangement a control would have had without a layout at all, which is what it is here for: it
     * is the shape where the right answer is obvious by eye, so an effect or a walk that is wrong in it is
     * plainly wrong. It declares that nearness in it is measured horizontally, so an item a long way above
     * the row is still beside what it is above.
     *
     * @param defs The gap between items, as a share of an item's width, and how tall an item is against it.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createRow = (defs?: RowDefs): FittedLayoutFn => {
        const gapRatio = defs?.gapRatio ?? PlacementLayoutKnobs.ROW_DEFAULTS.gapRatio;
        const itemHeightRatio = defs?.itemHeightRatio ?? PlacementLayoutKnobs.ROW_DEFAULTS.itemHeightRatio;

        return ({ itemCount }) => {
            const spans = Math.max(itemCount + (itemCount - SINGLE_ITEM) * gapRatio, SINGLE_ITEM);
            const width = FULL_SHARE / spans;

            return {
                ...toFittedLayout(toRun(itemCount, { x: width, y: width * itemHeightRatio }, width * gapRatio, false)),
                reachRule: "horizontal",
            };
        };
    };

    /** {@link createRow} at its defaults. */
    export const row = createRow();

    /**
     * Places items in a line down the box.
     *
     * A row read down rather than across, and the one difference is that a column chooses how much of the
     * width to take while a row has no choice but to fill it. Nearness in it is measured vertically.
     *
     * @param defs How wide an item is against the box, how tall it is against itself, and the gap between.
     * @returns A layout function, fitted — its height is whatever the items come to.
     */
    export const createColumn = (defs?: ColumnDefs): FittedLayoutFn => {
        const gapRatio = defs?.gapRatio ?? PlacementLayoutKnobs.COLUMN_DEFAULTS.gapRatio;
        const itemWidthRatio = defs?.itemWidthRatio ?? PlacementLayoutKnobs.COLUMN_DEFAULTS.itemWidthRatio;
        const itemHeightRatio = defs?.itemHeightRatio ?? PlacementLayoutKnobs.COLUMN_DEFAULTS.itemHeightRatio;
        const height = itemWidthRatio * itemHeightRatio;

        return ({ itemCount }) => ({
            ...toFittedLayout(toRun(itemCount, { x: itemWidthRatio, y: height }, height * gapRatio, true)),
            reachRule: "vertical",
        });
    };

    /** {@link createColumn} at its defaults. */
    export const column = createColumn();

    /**
     * Packs items into staggered rows of hexagonal cells.
     *
     * Every cell carries the clip path that makes it a hexagon, so a consumer gets the shape without
     * drawing it. Rows alternate by half a cell, which is what makes the packing tighter than a grid.
     *
     * @param defs How many cells to a row, and the gap between them as a share of a cell.
     * @returns A layout function, sized — it states the width it was drawn at.
     */
    export const createHoneycomb = (defs?: HoneycombDefs): SizedLayoutFn => {
        const cellWidth = CELL_WIDTH;
        const perRow = Math.max(defs?.perRow ?? PlacementLayoutKnobs.HONEYCOMB_DEFAULTS.perRow, SINGLE_ITEM);
        const gap = (defs?.gapRatio ?? PlacementLayoutKnobs.HONEYCOMB_DEFAULTS.gapRatio) * cellWidth;

        return ({ itemCount }): SizedLayout => {
            const cellHeight = cellWidth * HEX_HEIGHT_RATIO;
            const columnStep = cellWidth + gap;
            const rowStep = cellHeight * HEX_ROW_STEP_RATIO + gap;
            const rowCount = Math.max(Math.ceil(itemCount / perRow), SINGLE_ITEM);
            const columnCount = Math.min(itemCount, perRow);
            const hasStaggeredRow = rowCount > SINGLE_ITEM;
            const width = columnStep * columnCount + (hasStaggeredRow ? columnStep * HALF : NOTHING);
            const height = rowStep * (rowCount - SINGLE_ITEM) + cellHeight;

            const placements = Array.from({ length: itemCount }, (_unused, index): PlacementRect => {
                const row = Math.floor(index / perRow);
                const stagger = row % ROW_PARITY === EVEN_ROW ? NOTHING : columnStep * HALF;

                return {
                    left: (stagger + columnStep * (index % perRow) + cellWidth * HALF) / width,
                    top: (rowStep * row + cellHeight * HALF) / width,
                    width: cellWidth / width,
                    height: cellHeight / width,
                    clipPath: HEX_CLIP_PATH,
                };
            });

            return { placements, extent: width, heightRatio: height / width, pickRule: "nearest" };
        };
    };

    /** {@link createHoneycomb} at its defaults. */
    export const honeycomb = createHoneycomb();

    /**
     * Steps items down and across in threes, like a stack of cards dealt down a slope.
     *
     * @param defs How far each group of three drops below the one before it.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createCliff = (defs?: CliffDefs): FittedLayoutFn => {
        const cliffStepRatio = defs?.cliffStepRatio ?? PlacementLayoutKnobs.CLIFF_DEFAULTS.cliffStepRatio;
        const itemSize = QUARTER * ITEM_QUARTERS;
        const leaderLeft =
            CLIFF_CENTER - itemSize * ((Math.min(...CLIFF_SHIFT_RATIOS) + Math.max(...CLIFF_SHIFT_RATIOS)) * HALF);

        return ({ itemCount }) =>
            toFittedLayout(
                Array.from({ length: itemCount }, (_unused, index) => {
                    const place = index % CLIFF_SIZE;

                    return {
                        top:
                            itemSize * HALF +
                            itemSize * (Math.floor(index / CLIFF_SIZE) * cliffStepRatio + CLIFF_DROP_RATIOS[place]),
                        left: leaderLeft + itemSize * CLIFF_SHIFT_RATIOS[place],
                        width: itemSize,
                        height: itemSize,
                    };
                }),
            );
    };

    /** {@link createCliff} at its defaults. */
    export const cliff = createCliff();

    /**
     * Turns items about each other in threes, each group set below the one before it.
     *
     * The three whorls in the registry are this factory at three spacings, and they stay three entries
     * because a whorl is read against the shape put into it — a circle, a hexagon and a square each want
     * different spacing, so the second entry shows something the first does not.
     *
     * @param defs How far an item steps within its group, and how far a group steps from the last.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createWhorl = (defs?: WhorlDefs): FittedLayoutFn => {
        const itemStepRatio = defs?.itemStepRatio ?? PlacementLayoutKnobs.WHORL_DEFAULTS.itemStepRatio;
        const whorlStepRatio = defs?.whorlStepRatio ?? PlacementLayoutKnobs.WHORL_DEFAULTS.whorlStepRatio;

        return ({ itemCount }) => toFittedLayout(computeWhorl(itemCount, itemStepRatio, whorlStepRatio));
    };

    /** {@link createWhorl} at its defaults. */
    export const whorl = createWhorl();

    /**
     * Walks items down the box, turning back on itself every few steps.
     *
     * @param defs How many items make up one leg before it turns.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createZigzag = (defs?: ZigzagDefs): FittedLayoutFn => {
        const segmentLength = defs?.segmentLength ?? PlacementLayoutKnobs.ZIGZAG_DEFAULTS.segmentLength;
        const step = 1 / (1 + segmentLength);
        const peak = segmentLength - 1;

        return ({ itemCount }) =>
            toFittedLayout(
                Array.from({ length: itemCount }, (_unused, index) => ({
                    top: step * (index + 1),
                    left: step * (peak - Math.abs((index % (peak * 2)) - peak) + 1),
                    width: step * 2,
                    height: step * 2,
                })),
            );
    };

    /** {@link createZigzag} at its defaults. */
    export const zigzag = createZigzag();

    /**
     * Turns a registry entry into the arrangement it names.
     *
     * @param entry The family and, where it has been tuned, the defs to tune it by.
     * @returns The layout function, ready to hand to a control's `computeLayout`.
     */
    export const toLayoutFn = (entry: PlacementLayoutEntry): PlacementLayoutFn => {
        switch (entry.family) {
            case "ring":
                return createRing(entry.defs);
            case "arc":
                return createArc(entry.defs);
            case "row":
                return createRow(entry.defs);
            case "column":
                return createColumn(entry.defs);
            case "honeycomb":
                return createHoneycomb(entry.defs);
            case "cliff":
                return createCliff(entry.defs);
            case "whorl":
                return createWhorl(entry.defs);
            case "zigzag":
                return createZigzag(entry.defs);
        }
    };
}
