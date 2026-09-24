import type { Index2d } from "@thewaver/ss-utils";

import type { CellAnimationEvaluationDefs } from "../../Exotics/CellAnimation/CellAnimation.types";

export type CellAnimationZoneType =
    | "all"
    | "top"
    | "left"
    | "bottom"
    | "right"
    | "quadrant1"
    | "quadrant2"
    | "quadrant3"
    | "quadrant4"
    | "axisX"
    | "axisY"
    | "axis1"
    | "axis2"
    | "axis3"
    | "axis4"
    | "origin"
    | "evenRows"
    | "oddRows"
    | "evenColumns"
    | "oddColumns"
    | "evenRings"
    | "oddRings"
    | "evenCheckeredCells"
    | "oddCheckeredCells"
    | "lighterHalf"
    | "heavierHalf";

export type CellAnimationZoneFn = (defs: CellAnimationEvaluationDefs & { origin: Index2d }) => boolean;
