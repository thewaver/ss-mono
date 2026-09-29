import type { PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";
import type { ArcDefs } from "../../../Generators/PlacementLayouts/PlacementLayouts.types";
import { PlacementLayoutUtils } from "../../../Generators/PlacementLayouts/PlacementLayouts.utils";

/** A fan opens sideways, facing along the line the text runs. */
const FAN_FACING_DEGREES = 0;
/** The angle a fan's cards cover before a consumer says otherwise. */
const FAN_SPREAD_DEGREES = 60;
/** How far each card turns with its place on the arc, so the outer two do not go as steep as the arc does. */
const FAN_TILT_RATIO = 0.75;

/** The fan's arrangement, which is all a fan adds to a menu besides replacing levels rather than stacking them. */
export namespace FanMenuUtils {
    /**
     * The layout a fan hands its menu: an arc opening sideways with its cards tilted along it.
     *
     * @param layoutDefs The consumer's settings for the arc, over the fan's own facing, spread and tilt.
     * @returns The layout function, made afresh on each call, so a caller holding on to it keeps its identity.
     */
    export const createLayout = (layoutDefs?: ArcDefs): PlacementLayoutFn =>
        PlacementLayoutUtils.createArc({
            facingDegrees: FAN_FACING_DEGREES,
            spreadDegrees: FAN_SPREAD_DEGREES,
            tiltRatio: FAN_TILT_RATIO,
            ...layoutDefs,
        });
}
