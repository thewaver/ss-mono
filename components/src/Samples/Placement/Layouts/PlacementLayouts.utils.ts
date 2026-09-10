import type { PlacementLayoutFn, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type {
    ArcDefs,
    BandDefs,
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
const ROOT_LEVEL = 0;
const ROOT_PATH: number[] = [];
const NO_PARENT_EXTENT = 0;
const UPWARD_DEGREES = -90;
const FULL_SHARE = 1;
const AXIS_DEGREES = [-360, -270, -180, -90, 0, 90, 180, 270, 360];
type BandBase = Required<Omit<BandDefs, "centreRadius" | "computeItemArcs">> & Pick<BandDefs, "centreRadius">;
const NO_TILT = 0;
const HEX_HEIGHT_RATIO = 2 / Math.sqrt(3);
const HEX_ROW_STEP_RATIO = 0.75;
const EVEN_ROW = 0;
const ROW_PARITY = 2;
const ARC_SAMPLES = 512;
const HEX_CLIP_PATH = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const toChordAngle = (radius: number, chord: number) =>
    2 * Math.asin(Math.min(FULL_SHARE, (chord * HALF) / Math.max(radius, Number.EPSILON))) * DEGREES_PER_RADIAN;
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
const WHORL_SIZE = 3;
const QUARTER = 0.25;
const toFittedLayout = (placements: PlacementRect[]) => ({
    placements,
    heightRatio: placements.reduce((lowest, placement) => Math.max(lowest, placement.top + placement.height * 0.5), 0),
});
const PODIUM_LEFT_RATIO = 1.75;
const PODIUM_SECOND_DROP = 1;
const PODIUM_THIRD_DROP = 1.5;
const PODIUM_THIRD_SHIFT = 0.5;

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
export namespace PlacementLayoutUtils {
    export const BAND_DEFAULTS: BandBase = {
        spreadDegrees: 360,
        holeRadius: 25,
        bandWidth: 25,
        levelGap: 2,
        wedgeGapDegrees: 3,
        wedgeArc: 25,
        hasCentreItem: false,
        labelRadiusRatio: 0.5,
        labelHeightRatio: 1,
        labelMaxWidthRatio: 1,
        tiltRatio: 0,
    };

    export const ARC_DEFAULTS: Required<ArcDefs> = {
        width: 100,
        height: 100,
        spreadDegrees: 180,
        facingDegrees: -90,
        tiltRatio: 0,
        itemWidth: 25,
        itemHeight: 25,
    };

    export const HONEYCOMB_DEFAULTS: Required<HoneycombDefs> = {
        cellWidth: 25,
        perRow: 3,
        gap: 0,
    };

    export const WHORL_DEFAULTS: Required<WhorlDefs> = {
        itemSpacing: 1.75,
        whorlSpacing: 3.5,
    };

    export const ZIGZAG_DEFAULTS: Required<ZigzagDefs> = {
        segmentLength: 2,
    };

    export const createRing = (defs?: BandDefs): SizedLayoutFn => {
        const base = BAND_DEFAULTS;
        const spreadDegrees = defs?.spreadDegrees ?? base.spreadDegrees;
        const holeRadius = defs?.holeRadius ?? base.holeRadius;
        const bandWidth = defs?.bandWidth ?? base.bandWidth;
        const levelGap = defs?.levelGap ?? base.levelGap;
        const wedgeGapDegrees = defs?.wedgeGapDegrees ?? base.wedgeGapDegrees;
        const wedgeArc = defs?.wedgeArc ?? base.wedgeArc;
        const centreRadius = defs?.centreRadius ?? base.centreRadius ?? holeRadius;
        const tiltRatio = defs?.tiltRatio ?? NO_TILT;
        const hasCentreItem = defs?.hasCentreItem ?? base.hasCentreItem;
        const labelRadiusRatio = defs?.labelRadiusRatio ?? base.labelRadiusRatio;
        const labelHeightRatio = defs?.labelHeightRatio ?? base.labelHeightRatio;
        const labelMaxWidthRatio = defs?.labelMaxWidthRatio ?? base.labelMaxWidthRatio;
        const computeItemArcs = defs?.computeItemArcs;
        const isClosed = spreadDegrees >= FULL_TURN_DEGREES;

        return ({ itemCount, path = ROOT_PATH, parentExtent = NO_PARENT_EXTENT, parentPlacement }): SizedLayout => {
            const isRoot = path.length === ROOT_LEVEL;
            const hasCentre = hasCentreItem && isRoot;
            const arcCount = Math.max(hasCentre ? itemCount - SINGLE_ITEM : itemCount, NO_ITEMS);
            const innerRadius = isRoot ? holeRadius : parentExtent * HALF + levelGap;
            const outerRadius = innerRadius + bandWidth;
            const labelRadius = innerRadius + bandWidth * labelRadiusRatio;

            const declared = computeItemArcs?.(path) ?? [];
            const asked = Array.from({ length: arcCount }, (_unused, index) => declared[index]);
            const askedTotal = toSum(asked.map((arc) => arc ?? NO_ITEMS));
            const freeCount = asked.filter((arc) => arc === undefined).length;
            const evenArc = isRoot
                ? Math.max(spreadDegrees - askedTotal, NO_ITEMS) / Math.max(freeCount, SINGLE_ITEM)
                : toChordAngle(labelRadius, wedgeArc);
            const wanted = asked.map((arc) => arc ?? evenArc);
            const total = toSum(wanted);
            const scale =
                isRoot || total > spreadDegrees ? spreadDegrees / Math.max(total, Number.EPSILON) : FULL_SHARE;
            const arcs = wanted.map((arc) => arc * scale);
            const blockArc = toSum(arcs);
            const fillsTurn = isClosed && isRoot;
            const centreOn = parentPlacement?.sector
                ? (parentPlacement.sector.fromAngle + parentPlacement.sector.toAngle) * HALF
                : UPWARD_DEGREES;
            const windowStart = UPWARD_DEGREES - spreadDegrees * HALF;
            const loose = centreOn - (fillsTurn ? (arcs[0] ?? NO_ITEMS) : blockArc) * HALF;
            const start = isClosed
                ? loose
                : Math.min(Math.max(loose, windowStart), windowStart + spreadDegrees - blockArc);

            const boxes: ArcBox[] = [];
            let walked = NO_ITEMS;

            for (let index = NO_ITEMS; index < arcCount; index++) {
                const fromAngle = start + walked + wedgeGapDegrees * HALF;
                const toAngle = start + walked + arcs[index] - wedgeGapDegrees * HALF;
                const centreAngle = (fromAngle + toAngle) * HALF;
                const radians = centreAngle / DEGREES_PER_RADIAN;
                const labelWidth = Math.min(
                    2 * labelRadius * Math.sin((Math.max(toAngle - fromAngle, NO_ITEMS) * HALF) / DEGREES_PER_RADIAN),
                    bandWidth * labelMaxWidthRatio,
                );

                walked += arcs[index];

                boxes.push({
                    x: Math.cos(radians) * labelRadius,
                    y: Math.sin(radians) * labelRadius,
                    width: labelWidth,
                    height: labelWidth * labelHeightRatio,
                    tiltDegrees: centreAngle * tiltRatio,
                    fromAngle,
                    toAngle,
                });
            }

            if (hasCentre) {
                boxes.push({ x: NO_ITEMS, y: NO_ITEMS, width: centreRadius * 2, height: centreRadius * 2 });
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
        const boxWidth = defs?.width ?? ARC_DEFAULTS.width;
        const boxHeight = defs?.height ?? ARC_DEFAULTS.height;
        const spreadDegrees = defs?.spreadDegrees ?? ARC_DEFAULTS.spreadDegrees;
        const facingDegrees = defs?.facingDegrees ?? ARC_DEFAULTS.facingDegrees;
        const tiltRatio = defs?.tiltRatio ?? ARC_DEFAULTS.tiltRatio;
        const itemWidth = defs?.itemWidth ?? ARC_DEFAULTS.itemWidth;
        const itemHeight = defs?.itemHeight ?? ARC_DEFAULTS.itemHeight;

        return ({ itemCount }): SizedLayout => {
            const radiusX = boxWidth * HALF;
            const radiusY = boxHeight * HALF;
            const isClosed = spreadDegrees >= FULL_TURN_DEGREES;
            const fromAngle = isClosed ? facingDegrees : facingDegrees - spreadDegrees * HALF;
            const toAngle = fromAngle + spreadDegrees;
            const angles = toEvenArcAngles(itemCount, radiusX, radiusY, fromAngle, toAngle, isClosed);

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
        const cellWidth = defs?.cellWidth ?? HONEYCOMB_DEFAULTS.cellWidth;
        const perRow = Math.max(defs?.perRow ?? HONEYCOMB_DEFAULTS.perRow, SINGLE_ITEM);
        const gap = defs?.gap ?? HONEYCOMB_DEFAULTS.gap;

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

    export const createPodiumLozenge =
        (): FittedLayoutFn =>
        ({ itemCount }) =>
            toFittedLayout(
                Array.from({ length: itemCount }, (_unused, index) => {
                    const whorlTop = Math.floor(index / WHORL_SIZE) * QUARTER * WHORL_SIZE;
                    const place = index % WHORL_SIZE;
                    const top = QUARTER + whorlTop;
                    const left = QUARTER * PODIUM_LEFT_RATIO;
                    const size = QUARTER * 2;

                    if (place === 1) {
                        return {
                            top: top + QUARTER * PODIUM_SECOND_DROP,
                            left: left + QUARTER,
                            width: size,
                            height: size,
                        };
                    }

                    if (place === 2) {
                        return {
                            top: top + QUARTER * PODIUM_THIRD_DROP,
                            left: left - QUARTER * PODIUM_THIRD_SHIFT,
                            width: size,
                            height: size,
                        };
                    }

                    return { top, left, width: size, height: size };
                }),
            );

    export const podiumLozenge = createPodiumLozenge();

    export const createWhorl = (defs?: WhorlDefs): FittedLayoutFn => {
        const itemSpacing = defs?.itemSpacing ?? WHORL_DEFAULTS.itemSpacing;
        const whorlSpacing = defs?.whorlSpacing ?? WHORL_DEFAULTS.whorlSpacing;

        return ({ itemCount }) => toFittedLayout(computeWhorl(itemCount, itemSpacing, whorlSpacing));
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
        podiumLozenge: {},
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
            case "podiumLozenge":
                return createPodiumLozenge();
            case "whorl":
                return createWhorl(entry.defs);
            case "zigzag":
                return createZigzag(entry.defs);
        }
    };
}
