import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

const scatter = (col: number, row: number) =>
    CellAnimationKeyframeUtils.fromStops([
        { at: 0, translateX: col * 200, translateY: row * 200, scaleX: 20, scaleY: 20, opacity: 0 },
        { at: 1, translateX: 0, translateY: 0, scaleX: 100, scaleY: 100, opacity: 100 },
    ]);

export const quadrantScatter: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "quadrant1", animation: scatter(1, -1) },
        { zone: "quadrant2", animation: scatter(-1, -1) },
        { zone: "quadrant3", animation: scatter(-1, 1) },
        { zone: "quadrant4", animation: scatter(1, 1) },
        { zone: "axis1", animation: scatter(0, -1) },
        { zone: "axis2", animation: scatter(-1, 0) },
        { zone: "axis3", animation: scatter(1, 0) },
        { zone: "axis4", animation: scatter(0, 1) },
    ],
    scatter(0, 0),
);
