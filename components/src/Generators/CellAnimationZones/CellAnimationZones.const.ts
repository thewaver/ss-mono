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
        "axisX",
        "axisY",
        "axis1",
        "axis2",
        "axis3",
        "axis4",
        "origin",
        "evenRows",
        "oddRows",
        "evenColumns",
        "oddColumns",
        "evenRings",
        "oddRings",
        "evenCheckeredCells",
        "oddCheckeredCells",
        "lighterHalf",
        "heavierHalf",
    ];
}
