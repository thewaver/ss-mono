import type { Index2d } from "@thewaver/ss-utils";

import type { SliceAnimationEvaluationDefs } from "../../Exotics/Animations/CellAnimation/CellAnimation.types";
import { CellAnimationUtils } from "../../Exotics/Animations/CellAnimation/CellAnimation.utils";
import { SliceAnimationWeightUtils } from "../SliceAnimationWeights/SliceAnimationWeights.utils";
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
    axis_x: ({ pos, origin }) => pos.row === origin.row,
    axis_y: ({ pos, origin }) => pos.col === origin.col,
    axis1: ({ pos, origin }) => pos.col === origin.col && pos.row < origin.row,
    axis2: ({ pos, origin }) => pos.col < origin.col && pos.row === origin.row,
    axis3: ({ pos, origin }) => pos.col > origin.col && pos.row === origin.row,
    axis4: ({ pos, origin }) => pos.col === origin.col && pos.row > origin.row,
    origin: ({ pos, origin }) => pos.col === origin.col && pos.row === origin.row,
    even_rows: ({ pos, origin }) => CellAnimationUtils.isEvenRow(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    odd_rows: ({ pos, origin }) => !CellAnimationUtils.isEvenRow(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    even_columns: ({ pos, origin }) =>
        CellAnimationUtils.isEvenColumn(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    odd_columns: ({ pos, origin }) =>
        !CellAnimationUtils.isEvenColumn(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    even_rings: ({ pos, origin }) => CellAnimationUtils.isEvenRing(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    odd_rings: ({ pos, origin }) => !CellAnimationUtils.isEvenRing(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    even_checkered_cells: ({ pos, origin }) =>
        CellAnimationUtils.isEvenCheckered(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    odd_checkered_cells: ({ pos, origin }) =>
        !CellAnimationUtils.isEvenCheckered(SliceAnimationWeightUtils.getCellDelta(origin, pos)),
    lighter_half: ({ weight }) => weight < 0.5,
    heavier_half: ({ weight }) => weight >= 0.5,
};

/**
 * Which part of a cell animation's grid a cell falls in, for an animation that does something different in each.
 *
 * A zone is named rather than written: a side of the origin, a quadrant, an axis, a parity of rows, columns,
 * rings or checkered cells, or a half by weight. Everything is measured from the animation's origin, so the
 * same zone follows the origin wherever it is placed. `SliceAnimationKeyframeUtils.fromZones` is what picks an
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
    export const isInZone = (type: CellAnimationZoneType, defs: SliceAnimationEvaluationDefs & { origin: Index2d }) =>
        zoneRegistry[type](defs);
}
