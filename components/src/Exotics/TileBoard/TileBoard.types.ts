import type { Index2d, Point2d, Rect, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type TileBoardTilingKind =
    | Exclude<
          ShapeConst.DefaultShape,
          "triangle_top_left" | "triangle_top_right" | "triangle_bottom_right" | "triangle_bottom_left"
      >
    | "triangle_ltr"
    | "triangle_rtl"
    | "square_quarters"
    | "lozenge_quarters";

export type TileBoardTileFlip = "none" | "top_to_bottom" | "left_to_right";

export type TileBoardNeighborhood =
    | "orthogonal"
    | "diagonal"
    | "diagonal_and_across"
    | "diagonal_and_down"
    | "upright_triangle"
    | "sideways_triangle"
    | "shared_edge";

export type TileBoardPiece = {
    shape: ShapeConst.DefaultShape;
    box: Rect;
};

export type TileBoardTiling = {
    pitch: Size2d;
    hasOffsetRows: boolean;
    tileFlip: TileBoardTileFlip;
    neighborhood: TileBoardNeighborhood;
    pieces: TileBoardPiece[][];
};

export type TileBoardLayout = TileBoardTiling & {
    tiling: TileBoardTilingKind;
    count: Index2d;
    tileSize: Size2d;
    hasShortFirstRow: boolean;
    taper: number;
};

export type TileBoardTileGeometry = {
    offset: Point2d;
    size: Size2d;
    points: Point2d[];
    isFlipped: boolean;
};

export type TileBoardKeyAction = { kind: "activate" } | { kind: "move"; tile: Index2d };

export type TileBoardSweepDefs = {
    getIsSweepable: () => boolean;
    getIsTileDisabled: (tile: Index2d) => boolean;
    onSweep: (tile: Index2d) => void;
};

export type TileBoardRenderProps = {
    /** Which tile this is, by column and row. */
    tile: Index2d;
    /** How large the tile is. */
    size: Size2d;
    /** The corners of the tile's contour, for a consumer drawing something other than a rectangle. */
    points: Point2d[];
    /** Whether this tile sits on an offset row, which for a hexagon decides which way round it is drawn. */
    isFlipped: boolean;
    /** Whether the keyboard is currently on this tile. */
    isHighlighted: boolean;
};

export type BaseTileBoardValues = {
    /** Names the board for assistive technology. */
    ariaLabel?: string;
    /**
     * How many tiles the board has, across and down. A tiling that cuts boxes into pieces counts boxes, so three
     * columns of `square-quarters` is three squares, twelve tiles across.
     */
    tileCount: Index2d;
    /** How large one tile is, or for a tiling that cuts boxes into pieces, how large one box is. */
    tileSize: Size2d;
    /**
     * How the board is tiled, which decides each tile's contour, whether rows are offset and which tiles touch.
     * A shape name lays that shape whole, turning alternate pointed triangles over so they interlock.
     * `triangle-ltr` cuts each box corner to corner from its top left down, `triangle-rtl` from its top right
     * down; `square-quarters` cuts each box along both diagonals, and `lozenge-quarters` cuts boxes corner to
     * corner the opposite way in turn, which draws lozenges cut into four. Painters are handed each tile's own points,
     * so they never need to know which of these they are drawing.
     */
    tiling?: TileBoardTilingKind;
    /** The space between tiles. */
    gap?: number;
    /** Starts the offset rows at the top instead of the second row, for shapes that stagger. */
    hasShortFirstRow?: boolean;
    /**
     * How wide the top of the board is drawn, as a fraction of the bottom, which leans the board away from
     * the viewer like a table seen from one end. `1`, the default, is flat. The tiles still meet edge to
     * edge and a press still lands on the tile drawn under it. Something standing on the board rather than
     * painted into a tile is placed with `TileBoardUtils.getTileCenter` and sized with
     * `TileBoardUtils.getTileScale`, which both account for it.
     */
    taper?: number;
    /** Turns the board off, so no tile responds. */
    isDisabled?: boolean;
};

export type BaseTileBoardCbs = {
    /** Whether one tile is unavailable, which is what paints a move as out of reach. */
    computeIsTileDisabled?: (tile: Index2d) => boolean;
    /** Names one tile for assistive technology, so a reader hears where it is rather than its number. */
    computeTileAriaLabel?: (tile: Index2d) => string;
    /** Runs when a tile is activated. */
    onTileActivate: (tile: Index2d) => void;
    /**
     * Runs for each tile a press is dragged across, so one stroke can paint or clear a run of tiles. Sweeping is
     * on only while this is given.
     *
     * A sweep starts when a press moves onto a second tile: the tile it began on is reported then, and every tile
     * entered after it, each once per press however often the pointer comes back. A press that never leaves its
     * tile is a click and goes to `onTileActivate` instead, and the click at the end of a sweep is swallowed, so
     * no tile is acted on twice. Refused tiles are passed over without being reported. Touch sweeps as the mouse
     * does, and a touch that lands on a tile drags across the board rather than scrolling the page. Pressing the
     * tiles one at a time, or walking them with the keyboard, reaches everything a sweep does.
     */
    onTileSweep?: (tile: Index2d) => void;
};

export type BaseTileBoardProps = BaseTileBoardValues & BaseTileBoardCbs;
