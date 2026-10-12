import type { CellAnimationZoneType } from "./CellAnimationZones.types";

export namespace CellAnimationZones {
    export const ZONE_TYPES: readonly CellAnimationZoneType[] = [
        "all",
        "top",
        "left",
        "bottom",
        "right",
        "quadrant1",
        "quadrant2",
        "quadrant3",
        "quadrant4",
        "axis_x",
        "axis_y",
        "axis1",
        "axis2",
        "axis3",
        "axis4",
        "origin",
        "even_rows",
        "odd_rows",
        "even_columns",
        "odd_columns",
        "even_rings",
        "odd_rings",
        "even_checkered_cells",
        "odd_checkered_cells",
        "lighter_half",
        "heavier_half",
    ];
}
