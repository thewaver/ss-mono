import type { PlacementLayout, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type { ArcDefs, FanDefs, MenuLayoutFn } from "./MenuLayouts.types";

const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const CENTRE = 0.5;
const HALF = 0.5;
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;
const ROOT_LEVEL = 0;
const UPWARD_DEGREES = -90;
const FULL_SHARE = 1;

type ArcBase = Required<Omit<ArcDefs, "centreRadiusPx" | "computeItemArcs">> & Pick<ArcDefs, "centreRadiusPx">;

const RING_BASE: ArcBase = {
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

const HEMISPHERE_BASE: ArcBase = {
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

export const createArc = (spreadDegrees: number, defs?: ArcDefs): MenuLayoutFn => {
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

    return ({ itemCount, path, parentWidth, parentPlacement }): PlacementLayout => {
        const isRoot = path.length === ROOT_LEVEL;
        const hasCentre = hasCentreItem && isRoot;
        const arcCount = Math.max(hasCentre ? itemCount - SINGLE_ITEM : itemCount, NO_ITEMS);
        const innerRadius = isRoot ? holeRadiusPx : parentWidth * HALF + levelGapPx;
        const outerRadius = innerRadius + bandWidthPx;
        const labelRadius = innerRadius + bandWidthPx * labelRadiusRatio;
        const width = outerRadius * 2;

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

        const placements: PlacementRect[] = [];
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

            placements.push({
                left: CENTRE + (Math.cos(radians) * labelRadius) / width,
                top: CENTRE + (Math.sin(radians) * labelRadius) / width,
                width: labelWidth / width,
                height: (bandWidthPx * labelHeightRatio) / width,
                sector: {
                    innerRadius: innerRadius / width,
                    outerRadius: outerRadius / width,
                    fromAngle,
                    toAngle,
                },
            });
        }

        if (hasCentre) {
            placements.push({
                left: CENTRE,
                top: CENTRE,
                width: (centreRadiusPx * 2) / width,
                height: (centreRadiusPx * 2) / width,
            });
        }

        return { placements, width, heightRatio: 1, pickRule: "angle" };
    };
};

export const createRing = (defs?: ArcDefs) => createArc(FULL_TURN_DEGREES, defs);

export const createHemisphere = (defs?: ArcDefs) => createArc(HALF_TURN_DEGREES, defs);

export const ring = createRing();

export const hemisphere = createHemisphere();

export const createFan = (defs?: FanDefs): MenuLayoutFn => {
    const itemWidthPx = defs?.itemWidthPx ?? FAN_ITEM_WIDTH_PX;
    const itemHeightPx = defs?.itemHeightPx ?? FAN_ITEM_HEIGHT_PX;
    const stepDegrees = defs?.stepDegrees ?? FAN_STEP_DEGREES;
    const maxSpreadDegrees = defs?.maxSpreadDegrees ?? FAN_MAX_SPREAD_DEGREES;
    const gapPx = defs?.gapPx ?? FAN_GAP_PX;
    const tiltRatio = defs?.tiltRatio ?? FAN_TILT;

    return ({ itemCount }): PlacementLayout => {
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

export const MENU_LAYOUTS = { ring, hemisphere, fan };

export type MenuLayoutKey = keyof typeof MENU_LAYOUTS;

export const MENU_LAYOUT_KEYS = Object.keys(MENU_LAYOUTS) as MenuLayoutKey[];

export const NO_MENU_ITEMS = NO_ITEMS;
