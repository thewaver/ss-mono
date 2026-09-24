import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationZoneUtils } from "../../../../Generators/CellAnimationZones/CellAnimationZones.utils";

export const quadrantScatter: CellAnimationFn = (timeline, defs) => {
    const offset = (1 - timeline) * 200;
    const scale = 20 + timeline * 80;

    return {
        translateX: CellAnimationZoneUtils.isInZone("right", defs)
            ? offset
            : CellAnimationZoneUtils.isInZone("left", defs)
              ? -offset
              : 0,
        translateY: CellAnimationZoneUtils.isInZone("bottom", defs)
            ? offset
            : CellAnimationZoneUtils.isInZone("top", defs)
              ? -offset
              : 0,
        scaleX: scale,
        scaleY: scale,
        opacity: timeline * 100,
    };
};
