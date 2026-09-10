import { BARREL_PERSPECTIVE_PX, BarrelUtils } from "../Barrel/Barrel.utils";

/** How far the viewer sits from the drum. Must match the `perspective` the stylesheet applies. */
export const DRUM_PERSPECTIVE_PX = BARREL_PERSPECTIVE_PX;

/**
 * A wheel's geometry, in the wheel's own vocabulary.
 *
 * A wheel is a barrel whose faces are wedges, so the arithmetic is
 * {@link BarrelUtils}'s — what is added here is the naming, so a wheel's own code talks about wedges
 * rather than faces.
 */
export namespace WheelUtils {
    /** How wide a wedge is along the direction the wheel turns. */
    export const getWedgeExtent = BarrelUtils.getFaceExtent;

    /** Whether wedges need backs drawn, which they do from three wedges up. */
    export const getHasWedgeBacks = BarrelUtils.getHasBacks;

    /** How far a wedge sits from the wheel's axis. */
    export const getApothem = BarrelUtils.getApothem;

    /** The distance across the wheel through its corners. */
    export const getCircumdiameter = BarrelUtils.getCircumdiameter;

    /** How much room to reserve across the wheel, perspective included. */
    export const getGirth = BarrelUtils.getGirth;
}
