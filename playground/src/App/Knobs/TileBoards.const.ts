import { TILE_BOARD_TILINGS } from "@thewaver/ss-components";

export namespace TileBoardKnobs {
    export const TILINGS = TILE_BOARD_TILINGS;
    export const MIN_ROWS = 1;
    export const MAX_ROWS = 9;
    export const MIN_COLS = 1;
    export const MAX_COLS = 9;
    export const MIN_TILE_SIZE = 24;
    export const MAX_TILE_SIZE = 120;
    export const MIN_REACH = 1;
    export const MAX_REACH = 4;
    export const MIN_GAP = 0;
    export const MAX_GAP = 16;
    export const MIN_TAPER = 0.2;
    export const MAX_TAPER = 1;
    export const TAPER_STEP = 0.05;
    export const SIZE_STEP = 2;
    export const COUNT_STEP = 1;

    export const STARTING_ROWS = 5;
    export const STARTING_COLS = 5;
    export const STARTING_TILE_WIDTH = 72;
    export const STARTING_TILE_HEIGHT = 72;
    export const STARTING_REACH = 1;
    export const STARTING_HAS_SHORT_FIRST_ROW = false;

    export const REACH_TEXT = {
        label: "Reach",
        hint: "How many tiles the piece may travel in one move. Tiles out of reach are shown as unavailable.",
        controls: "Sets how far the example lets the piece travel, sent to TileBoardProps.computeIsTileDisabled",
    };

    export const ROWS_TEXT = {
        label: "Rows",
        hint: "How many rows of tiles the board has.",
        controls: "Sets TileBoardProps.tileCount.rowCount",
    };

    export const COLS_TEXT = {
        label: "Columns",
        hint: "How many tiles sit in a row.",
        controls: "Sets TileBoardProps.tileCount.colCount",
    };

    export const TILE_WIDTH_TEXT = {
        label: "Tile width",
        hint: "How wide one tile is.",
        controls: "Sets TileBoardProps.tileSize.width",
    };

    export const TILE_HEIGHT_TEXT = {
        label: "Tile height",
        hint: "How tall one tile is.",
        controls: "Sets TileBoardProps.tileSize.height",
    };

    export const GAP_TEXT = {
        label: "Gap",
        hint: "The space left between tiles.",
        controls: "Sets TileBoardProps.gap",
    };

    export const TILING_TEXT = {
        label: "Tiling",
        hint: "How the board is tiled. A shape lays that shape whole; the two halves cut each box corner to corner, from the top left down or the top right down, and the two quarters cut a square or a lozenge into four.",
        controls: "Sets TileBoardProps.tiling",
    };

    export const HAS_SHORT_FIRST_ROW_TEXT = {
        label: "Start on the short row",
        hint: "Starts the offset rows at the top instead of the second row, for shapes that stagger.",
        controls: "Sets TileBoardProps.hasShortFirstRow",
    };

    export const TAPER_TEXT = {
        label: "Taper",
        hint: "How wide the top of the board is drawn, as a fraction of the bottom. Below 1 the board leans away, and a piece shrinks as it moves up it.",
        controls: "Sets TileBoardProps.taper",
    };
}
