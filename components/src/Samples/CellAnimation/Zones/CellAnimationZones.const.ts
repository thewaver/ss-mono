import { type Index2d } from "@thewaver/ss-utils";

import type { CellAnimationEvaluationDefs } from "../../../Exotics/CellAnimation/CellAnimation.types";
import { CellAnimationUtils } from "../../../Exotics/CellAnimation/CellAnimation.utils";
import { CellAnimationWeightUtils } from "../Weights/CellAnimationWeights.utils";

const zoneRegistry: Record<CellAnimationZones.ZoneType, CellAnimationZones.ZoneFn> = {
    all: () => true,
    top: ({ pos, origin }) => pos.row < origin.row,
    left: ({ pos, origin }) => pos.col < origin.col,
    bottom: ({ pos, origin }) => pos.row > origin.row,
    right: ({ pos, origin }) => pos.col > origin.col,
    quadrant1: ({ pos, origin }) => pos.col > origin.col && pos.row < origin.row,
    quadrant2: ({ pos, origin }) => pos.col < origin.col && pos.row < origin.row,
    quadrant3: ({ pos, origin }) => pos.col < origin.col && pos.row > origin.row,
    quadrant4: ({ pos, origin }) => pos.col > origin.col && pos.row > origin.row,
    axisX: ({ pos, origin }) => pos.row === origin.row,
    axisY: ({ pos, origin }) => pos.col === origin.col,
    axis1: ({ pos, origin }) => pos.col === origin.col && pos.row < origin.row,
    axis2: ({ pos, origin }) => pos.col < origin.col && pos.row === origin.row,
    axis3: ({ pos, origin }) => pos.col > origin.col && pos.row === origin.row,
    axis4: ({ pos, origin }) => pos.col === origin.col && pos.row > origin.row,
    origin: ({ pos, origin }) => pos.col === origin.col && pos.row === origin.row,
    evenRows: ({ pos, origin }) => CellAnimationUtils.isEvenRow(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    oddRows: ({ pos, origin }) => !CellAnimationUtils.isEvenRow(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    evenColumns: ({ pos, origin }) =>
        CellAnimationUtils.isEvenColumn(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    oddColumns: ({ pos, origin }) =>
        !CellAnimationUtils.isEvenColumn(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    evenRings: ({ pos, origin }) => CellAnimationUtils.isEvenRing(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    oddRings: ({ pos, origin }) => !CellAnimationUtils.isEvenRing(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    evenCheckeredCells: ({ pos, origin }) =>
        CellAnimationUtils.isEvenCheckered(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    oddCheckeredCells: ({ pos, origin }) =>
        !CellAnimationUtils.isEvenCheckered(CellAnimationWeightUtils.getCellDelta(origin, pos)),
    lighterHalf: ({ weight }) => weight < 0.5,
    heavierHalf: ({ weight }) => weight >= 0.5,
};

export namespace CellAnimationZones {
    export const ZONE_TYPES = [
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
    ] as const;

    export type ZoneType = (typeof ZONE_TYPES)[number];

    export type ZoneFn = (defs: CellAnimationEvaluationDefs & { origin: Index2d }) => boolean;

    export const isInZone = (type: ZoneType, defs: CellAnimationEvaluationDefs & { origin: Index2d }) =>
        zoneRegistry[type](defs);
}
