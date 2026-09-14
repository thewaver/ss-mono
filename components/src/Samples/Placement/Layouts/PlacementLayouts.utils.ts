import type { PlacementLayoutFn, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type {
    ArcDefs,
    BandDefs,
    CliffDefs,
    FittedLayoutFn,
    HoneycombDefs,
    PlacementLayoutEntry,
    SizedLayout,
    SizedLayoutFn,
    WhorlDefs,
    ZigzagDefs,
} from "./PlacementLayouts.types";

const FULL_TURN_DEGREES = 360;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const HALF = 0.5;
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;
const FULL_SHARE = 1;
const AXIS_DEGREES = [-360, -270, -180, -90, 0, 90, 180, 270, 360];
type BandBase = Required<Omit<BandDefs, "computeItemArcs">>;
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
const toSum = (values: number[]) => values.reduce((total, value) => total + value, NO_ITEMS);
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
        const radians = angle / DEGREES_PER_RADIAN;

        xs.push(Math.cos(radians) * radiusX);
        ys.push(Math.sin(radians) * radiusY);
    }

    for (const box of boxes) {
        const radians = (box.tiltDegrees ?? NO_TILT) / DEGREES_PER_RADIAN;
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
    const radians = degrees / DEGREES_PER_RADIAN;

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
    const walked: number[] = [NO_ITEMS];
    let previous = toEllipsePoint(radiusX, radiusY, fromAngle);
    let total = NO_ITEMS;

    for (let sample = SINGLE_ITEM; sample <= ARC_SAMPLES; sample++) {
        const point = toEllipsePoint(radiusX, radiusY, fromAngle + step * sample);

        total += Math.hypot(point.x - previous.x, point.y - previous.y);
        walked.push(total);
        previous = point;
    }

    const gaps = itemCount - SINGLE_ITEM;
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
const WHORL_SIZE = 3;
const CLIFF_SIZE = 3;
const CLIFF_CENTRE = 0.5;
const CLIFF_SHIFT_RATIOS = [0, 0.5, -0.25];
const CLIFF_DROP_RATIOS = [0, 0.5, 0.75];
const QUARTER = 0.25;
const toFittedLayout = (placements: PlacementRect[]) => ({
    placements,
    heightRatio: placements.reduce((lowest, placement) => Math.max(lowest, placement.top + placement.height * 0.5), 0),
});

const computeWhorl = (itemCount: number, itemStepRatio: number, whorlStepRatio: number): PlacementRect[] =>
    Array.from({ length: itemCount }, (_, index) => {
        const itemSize = QUARTER * ITEM_QUARTERS;
        const itemDrop = itemSize * itemStepRatio;
        const whorlTop = Math.floor(index / WHORL_SIZE) * (itemDrop + itemSize * whorlStepRatio);
        const place = index % WHORL_SIZE;

        return {
            top: QUARTER + whorlTop + (place === 0 ? NO_ITEMS : itemDrop),
            left: QUARTER * (place === 0 ? 2 : place === 1 ? 1 : 3),
            width: itemSize,
            height: itemSize,
        };
    });
export namespace PlacementLayoutUtils {
    /**
     * The angle a straight span of a given length subtends at a given radius.
     *
     * A band's items are sized across the band rather than by angle, so a caller that knows how wide an item
     * has to be needs the arc that width costs at the radius it sits on — which shrinks as the radius grows.
     * Spans wider than the circle saturate at half a turn rather than returning `NaN`.
     *
     * @param radius Distance from the centre to the span.
     * @param chord Length of the span, in the same units as the radius.
     * @returns The angle in degrees, from `0` to `180`.
     */
    export const toChordAngle = (radius: number, chord: number) =>
        2 * Math.asin(Math.min(FULL_SHARE, (chord * HALF) / Math.max(radius, Number.EPSILON))) * DEGREES_PER_RADIAN;

    export const BAND_DEFAULTS: BandBase = {
        spreadDegrees: 360,
        facingDegrees: -90,
        holeRatio: 0.5,
        wedgeGapDegrees: 3,
        tiltRatio: 0,
        itemRadiusRatio: 0.5,
        itemHeightRatio: 1,
        itemMaxWidthRatio: 1,
    };

    export const ARC_DEFAULTS: Required<ArcDefs> = {
        curveHeightRatio: 1,
        spreadDegrees: 180,
        facingDegrees: -90,
        tiltRatio: 0,
        itemWidthRatio: 0.25,
        itemHeightRatio: 1,
    };

    export const HONEYCOMB_DEFAULTS: Required<HoneycombDefs> = {
        perRow: 3,
        gapRatio: 0,
    };

    export const WHORL_DEFAULTS: Required<WhorlDefs> = {
        itemStepRatio: 0.75,
        whorlStepRatio: 0.75,
    };

    export const CLIFF_DEFAULTS: Required<CliffDefs> = {
        cliffStepRatio: 1.5,
    };

    export const ZIGZAG_DEFAULTS: Required<ZigzagDefs> = {
        segmentLength: 2,
    };

    export const createRing = (defs?: BandDefs): SizedLayoutFn => {
        const base = BAND_DEFAULTS;
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
            const askedTotal = toSum(asked.map((arc) => arc ?? NO_ITEMS));
            const freeCount = asked.filter((arc) => arc === undefined).length;
            const evenArc = Math.max(spreadDegrees - askedTotal, NO_ITEMS) / Math.max(freeCount, SINGLE_ITEM);
            const wanted = asked.map((arc) => arc ?? evenArc);
            const total = toSum(wanted);
            const arcs = wanted.map((arc) => (arc * spreadDegrees) / Math.max(total, Number.EPSILON));
            const blockArc = toSum(arcs);
            const start = facingDegrees - blockArc * HALF;

            const boxes: ArcBox[] = [];
            let walked = NO_ITEMS;

            for (let index = NO_ITEMS; index < itemCount; index++) {
                const fromAngle = start + walked + wedgeGapDegrees * HALF;
                const toAngle = start + walked + arcs[index] - wedgeGapDegrees * HALF;
                const centreAngle = (fromAngle + toAngle) * HALF;
                const radians = centreAngle / DEGREES_PER_RADIAN;
                const itemWidth = Math.min(
                    2 * itemRadius * Math.sin((Math.max(toAngle - fromAngle, NO_ITEMS) * HALF) / DEGREES_PER_RADIAN),
                    bandWidth * itemMaxWidthRatio,
                );

                walked += arcs[index];

                boxes.push({
                    x: Math.cos(radians) * itemRadius,
                    y: Math.sin(radians) * itemRadius,
                    width: itemWidth,
                    height: itemWidth * itemHeightRatio,
                    tiltDegrees: centreAngle * tiltRatio,
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

            return { placements, extent: width, heightRatio: height / width, pickRule: "angle", origin };
        };
    };

    export const ring = createRing();

    export const createArc = (defs?: ArcDefs): SizedLayoutFn => {
        const curveHeightRatio = defs?.curveHeightRatio ?? ARC_DEFAULTS.curveHeightRatio;
        const spreadDegrees = defs?.spreadDegrees ?? ARC_DEFAULTS.spreadDegrees;
        const facingDegrees = defs?.facingDegrees ?? ARC_DEFAULTS.facingDegrees;
        const tiltRatio = defs?.tiltRatio ?? ARC_DEFAULTS.tiltRatio;
        const itemWidth = defs?.itemWidthRatio ?? ARC_DEFAULTS.itemWidthRatio;
        const itemHeight = itemWidth * (defs?.itemHeightRatio ?? ARC_DEFAULTS.itemHeightRatio);

        return ({ itemCount }): SizedLayout => {
            const radiusX = CURVE_WIDTH * HALF;
            const radiusY = curveHeightRatio * HALF;
            const widestSpread =
                (FULL_TURN_DEGREES * Math.max(itemCount - SINGLE_ITEM, NO_ITEMS)) / Math.max(itemCount, SINGLE_ITEM);
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
                origin,
                radii: { x: radiusX / width, y: radiusY / width },
            };
        };
    };

    export const arc = createArc();

    export const createHoneycomb = (defs?: HoneycombDefs): SizedLayoutFn => {
        const cellWidth = CELL_WIDTH;
        const perRow = Math.max(defs?.perRow ?? HONEYCOMB_DEFAULTS.perRow, SINGLE_ITEM);
        const gap = (defs?.gapRatio ?? HONEYCOMB_DEFAULTS.gapRatio) * cellWidth;

        return ({ itemCount }): SizedLayout => {
            const cellHeight = cellWidth * HEX_HEIGHT_RATIO;
            const columnStep = cellWidth + gap;
            const rowStep = cellHeight * HEX_ROW_STEP_RATIO + gap;
            const rowCount = Math.max(Math.ceil(itemCount / perRow), SINGLE_ITEM);
            const columnCount = Math.min(itemCount, perRow);
            const hasStaggeredRow = rowCount > SINGLE_ITEM;
            const width = columnStep * columnCount + (hasStaggeredRow ? columnStep * HALF : NO_ITEMS);
            const height = rowStep * (rowCount - SINGLE_ITEM) + cellHeight;

            const placements = Array.from({ length: itemCount }, (_unused, index): PlacementRect => {
                const row = Math.floor(index / perRow);
                const stagger = row % ROW_PARITY === EVEN_ROW ? NO_ITEMS : columnStep * HALF;

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

    export const honeycomb = createHoneycomb();

    export const createCliff = (defs?: CliffDefs): FittedLayoutFn => {
        const cliffStepRatio = defs?.cliffStepRatio ?? CLIFF_DEFAULTS.cliffStepRatio;
        const itemSize = QUARTER * ITEM_QUARTERS;
        const leaderLeft =
            CLIFF_CENTRE - itemSize * ((Math.min(...CLIFF_SHIFT_RATIOS) + Math.max(...CLIFF_SHIFT_RATIOS)) * HALF);

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

    export const cliff = createCliff();

    export const createWhorl = (defs?: WhorlDefs): FittedLayoutFn => {
        const itemStepRatio = defs?.itemStepRatio ?? WHORL_DEFAULTS.itemStepRatio;
        const whorlStepRatio = defs?.whorlStepRatio ?? WHORL_DEFAULTS.whorlStepRatio;

        return ({ itemCount }) => toFittedLayout(computeWhorl(itemCount, itemStepRatio, whorlStepRatio));
    };

    export const whorl = createWhorl();

    export const createZigzag = (defs?: ZigzagDefs): FittedLayoutFn => {
        const segmentLength = defs?.segmentLength ?? ZIGZAG_DEFAULTS.segmentLength;
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

    export const zigzag = createZigzag();

    export const DEFAULTS_BY_FAMILY = {
        arc: ARC_DEFAULTS,
        honeycomb: HONEYCOMB_DEFAULTS,
        cliff: CLIFF_DEFAULTS,
        ring: BAND_DEFAULTS,
        whorl: WHORL_DEFAULTS,
        zigzag: ZIGZAG_DEFAULTS,
    };

    export const toLayoutFn = (entry: PlacementLayoutEntry): PlacementLayoutFn => {
        switch (entry.family) {
            case "ring":
                return createRing(entry.defs);
            case "arc":
                return createArc(entry.defs);
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
