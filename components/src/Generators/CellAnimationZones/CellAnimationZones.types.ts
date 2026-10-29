import type { Index2d } from "@thewaver/ss-utils";

import type { SliceAnimationEvaluationDefs } from "../../Exotics/Animations/CellAnimation/CellAnimation.types";

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
    | "axis_x"
    | "axis_y"
    | "axis1"
    | "axis2"
    | "axis3"
    | "axis4"
    | "origin"
    | "even_rows"
    | "odd_rows"
    | "even_columns"
    | "odd_columns"
    | "even_rings"
    | "odd_rings"
    | "even_checkered_cells"
    | "odd_checkered_cells"
    | "lighter_half"
    | "heavier_half";

export type CellAnimationZoneFn = (defs: SliceAnimationEvaluationDefs & { origin: Index2d }) => boolean;
