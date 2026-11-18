import type { PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";
import { PlacementLayoutUtils } from "../../../Generators/PlacementLayouts/PlacementLayouts.utils";
import type { FanLayoutDefs } from "./FanMenu.types";

const FAN_FACING_DEGREES = 0;
const FAN_SPREAD_DEGREES_PER_ITEM = 15;
const FAN_TILT_RATIO = 0.75;
const FAN_ITEM_WIDTH_RATIO = 0.25;
const FAN_ITEM_HEIGHT_RATIO = 0.05;

/** The fan's arrangement, which is all a fan adds to a menu besides replacing levels rather than stacking them. */
export namespace FanMenuUtils {
    /**
     * The layout a fan hands its menu: part of a ring opening sideways round the trigger, its cards tilted along it.
     *
     * A ring's center is the middle of its box whatever share of the turn it covers, and that center is the point the
     * menu pins to the trigger, so every level sits the same distance from it. Each level's spread is its card count
     * times `spreadDegreesPerItem`. The ring decides where each card sits and nothing else: cards take the size the
     * fan asks for rather than their slice of the ring, so they can overlap, and the ring's wedges are left out, since
     * a fan's cards are boxes and an item carrying a wedge leaves its presses to the painter's own shape.
     *
     * @param layoutDefs The consumer's settings for the ring and the cards, over the fan's own facing, spread per card,
     * tilt and card size.
     * @returns The layout function, made afresh on each call, so a caller holding on to it keeps its identity.
     */
    export const createLayout =
        (layoutDefs?: FanLayoutDefs): PlacementLayoutFn =>
        (defs) => {
            const {
                spreadDegreesPerItem = FAN_SPREAD_DEGREES_PER_ITEM,
                itemWidthRatio = FAN_ITEM_WIDTH_RATIO,
                itemHeightRatio = FAN_ITEM_HEIGHT_RATIO,
                ...ringDefs
            } = layoutDefs ?? {};
            const layout = PlacementLayoutUtils.createRing({
                facingDegrees: FAN_FACING_DEGREES,
                spreadDegrees: defs.itemCount * spreadDegreesPerItem,
                tiltRatio: FAN_TILT_RATIO,
                ...ringDefs,
            })(defs);

            return {
                ...layout,
                placements: layout.placements.map((placement) => ({
                    ...placement,
                    widthShare: itemWidthRatio,
                    heightShare: itemHeightRatio,
                    sector: undefined,
                })),
            };
        };
}
