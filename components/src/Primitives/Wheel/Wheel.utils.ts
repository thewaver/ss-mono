import { BARREL_PERSPECTIVE_PX, BarrelUtils } from "../../Abstracts/Barrel/Barrel.utils";

export const DRUM_PERSPECTIVE_PX = BARREL_PERSPECTIVE_PX;

export namespace WheelUtils {
    export const getWedgeExtent = BarrelUtils.getFaceExtent;

    export const getHasWedgeBacks = BarrelUtils.getHasBacks;

    export const getApothem = BarrelUtils.getApothem;

    export const getCircumdiameter = BarrelUtils.getCircumdiameter;

    export const getGirth = BarrelUtils.getGirth;
}
