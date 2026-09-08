import type { PlacementLayout, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type { MenuLayoutFn } from "./MenuLayouts.types";

const FULL_TURN_RADIANS = Math.PI * 2;
const QUARTER_TURN_RADIANS = Math.PI / 2;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const CENTRE = 0.5;
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;

const RING_ITEM_PX = 96;
const RING_CROWDING = 1.25;
const RING_MIN_RADIUS_PX = 132;

const HEMISPHERE_ITEM_PX = 96;
const HEMISPHERE_SPREAD_DEGREES = 150;
const HEMISPHERE_MIN_RADIUS_PX = 140;

const FAN_ITEM_WIDTH_PX = 168;
const FAN_ITEM_HEIGHT_PX = 40;
const FAN_SPREAD_DEGREES = 74;
const FAN_GAP_PX = 14;
const FAN_TILT = 0.75;
const NO_TILT = 0;

const toRadius = (itemCount: number, itemPx: number, arcDegrees: number, minimum: number) => {
    const arc = (arcDegrees / 360) * FULL_TURN_RADIANS;
    const needed = (itemCount * itemPx * RING_CROWDING) / Math.max(arc, Number.EPSILON);

    return Math.max(needed, minimum);
};

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

/**
 * A closed circle of items round the thing that opened it, picked by the direction they lie in. The radius
 * grows with the item count so the items never crowd, which is what stops a wheel of twenty from overlapping
 * itself — and is also why a wheel of twenty is a bad idea.
 */
export const ring: MenuLayoutFn = (itemCount): PlacementLayout => {
    const radius = toRadius(itemCount, RING_ITEM_PX, 360, RING_MIN_RADIUS_PX);
    const width = (radius + RING_ITEM_PX / 2) * 2;
    const angles = Array.from(
        { length: itemCount },
        (_unused, index) => (index / Math.max(itemCount, SINGLE_ITEM)) * FULL_TURN_RADIANS - QUARTER_TURN_RADIANS,
    );

    return {
        placements: toPlacements(angles, radius, width, { w: RING_ITEM_PX, h: RING_ITEM_PX }),
        width,
        heightRatio: 1,
        pickRule: "angle",
    };
};

/** Half a ring, opening upwards. The wide arc a hand of cards wants, without the rotation a fan has. */
export const hemisphere: MenuLayoutFn = (itemCount): PlacementLayout => {
    const radius = toRadius(itemCount, HEMISPHERE_ITEM_PX, HEMISPHERE_SPREAD_DEGREES, HEMISPHERE_MIN_RADIUS_PX);
    const width = (radius + HEMISPHERE_ITEM_PX / 2) * 2;
    const angles = toArc(itemCount, radius, HEMISPHERE_SPREAD_DEGREES, -QUARTER_TURN_RADIANS);

    return {
        placements: toPlacements(angles, radius, width, { w: HEMISPHERE_ITEM_PX, h: HEMISPHERE_ITEM_PX }),
        width,
        heightRatio: 1,
        pickRule: "angle",
    };
};

/**
 * A narrow arc opening sideways, with the items upright rather than turned to follow it — the shape a combat
 * menu uses, where the label reads outward from a shortcut badge at the inner end. The box stays symmetric
 * about the origin so the arc's centre lands on whatever opened it, which leaves the unused half empty; that
 * costs nothing, because a laid-out popup does not take the pointer.
 */
export const fan: MenuLayoutFn = (itemCount): PlacementLayout => {
    const spread = FAN_SPREAD_DEGREES / DEGREES_PER_RADIAN;
    const spacing = FAN_ITEM_HEIGHT_PX + FAN_GAP_PX;
    const radius = Math.max(
        (spacing * Math.max(itemCount - SINGLE_ITEM, SINGLE_ITEM)) / Math.max(spread, Number.EPSILON),
        FAN_ITEM_WIDTH_PX,
    );
    const width = (radius + FAN_ITEM_WIDTH_PX / 2) * 2;
    const height = (radius * Math.sin(spread / 2) + FAN_ITEM_HEIGHT_PX / 2) * 2;
    const angles = toArc(itemCount, radius, FAN_SPREAD_DEGREES, 0);

    return {
        placements: toPlacements(angles, radius, width, { w: FAN_ITEM_WIDTH_PX, h: FAN_ITEM_HEIGHT_PX }, FAN_TILT).map(
            (placement) => ({ ...placement, top: CENTRE * (height / width) + (placement.top - CENTRE) }),
        ),
        width,
        heightRatio: height / width,
        pickRule: "angle",
    };
};

export const MENU_LAYOUTS = { ring, hemisphere, fan };

export type MenuLayoutKey = keyof typeof MENU_LAYOUTS;

export const MENU_LAYOUT_KEYS = Object.keys(MENU_LAYOUTS) as MenuLayoutKey[];

export const NO_MENU_ITEMS = NO_ITEMS;
