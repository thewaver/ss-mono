import type { PatchBoardSnapFn } from "../../../Exotics/PatchBoard/PatchBoard.types";

const GRID_COLUMNS = 32;
const GRID_CELL = 0.03125;

const toGrid = (value: number) => Math.round(value * GRID_COLUMNS) * GRID_CELL;

export namespace PatchBoardSnaps {
    export const GRID_CELL_SIZE = GRID_CELL;

    export const grid: PatchBoardSnapFn = (spot) => ({ x: toGrid(spot.x), y: toGrid(spot.y) });
}
