import type { TileBoardTilingKind } from "./TileBoard.types";

export const TILE_BOARD_DEFAULTS = {
    gap: 4,
    taper: 1,
    tiling: "hexagon_pointy_top" as TileBoardTilingKind,
};

export const TILE_BOARD_TILINGS: readonly TileBoardTilingKind[] = [
    "triangle_up",
    "triangle_down",
    "triangle_left",
    "triangle_right",
    "triangle_ltr",
    "triangle_rtl",
    "square",
    "square_quarters",
    "lozenge",
    "lozenge_quarters",
    "hexagon_pointy_top",
    "hexagon_flat_top",
    "hectogon",
];
