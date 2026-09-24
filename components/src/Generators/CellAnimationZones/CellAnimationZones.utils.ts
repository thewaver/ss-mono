import type { Index2d } from "@thewaver/ss-utils";

import type { CellAnimationEvaluationDefs } from "../../Exotics/CellAnimation/CellAnimation.types";
import { CellAnimationUtils } from "../../Exotics/CellAnimation/CellAnimation.utils";
import { CellAnimationWeightUtils } from "../CellAnimationWeights/CellAnimationWeights.utils";
import type { CellAnimationZoneFn, CellAnimationZoneType } from "./CellAnimationZones.types";

const zoneRegistry: Record<CellAnimationZoneType, CellAnimationZoneFn> = {
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

/**
 * Which part of a cell animation's grid a cell falls in, for an animation that does something different in each.
 *
 * A zone is named rather than written: a side of the origin, a quadrant, an axis, a parity of rows, columns,
 * rings or checkered cells, or a half by weight. Everything is measured from the animation's origin, so the
 * same zone follows the origin wherever it is placed. `CellAnimationKeyframeUtils.fromZones` is what picks an
 * animation by zone; this answers the question it asks.
 */
export namespace CellAnimationZoneUtils {
    /**
     * Whether a cell is in a zone.
     *
     * The sides and quadrants leave out the origin's own row and column, which are zones of their own, and the
     * origin is a zone of its own too. Every parity zone is the exact complement of its partner, so the two
     * between them take every cell exactly once. The weight halves put a cell weighing exactly `0.5` in the
     * heavier half.
     *
     * @param type The zone to test.
     * @param defs The cell, its weight, the grid and the origin, as the animation is handed them.
     * @returns `true` when the cell is in the zone.
     */
    export const isInZone = (type: CellAnimationZoneType, defs: CellAnimationEvaluationDefs & { origin: Index2d }) =>
        zoneRegistry[type](defs);
}
