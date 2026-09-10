import { type Index2d, MathUtils, type Point2d, ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TileBoardLayout, TileBoardTiling } from "./TileBoard.types";

/** The size of a board with no tiles. */
const EMPTY_SIZE: Size2d = { width: 0, height: 0 };
/** Zero tiles. */
const NO_TILES = 0;
/** The first row or column. */
const FIRST_INDEX = 0;
/** How many fewer tiles a short row holds, and the column shift an offset row applies. */
const SHORT_ROW_TILES = 1;
/** Halfway, for centring a tile or offsetting a row. */
const HALF = 0.5;
/** The triangle shape whose unflipped tiles point upwards. */
const POINTS_UP = "triangle-up";
/** The triangle shape whose unflipped tiles point rightwards. */
const POINTS_RIGHT = "triangle-right";

/**
 * How each tile shape tiles, as fractions of one tile's size.
 *
 * The pitch is how far apart tile centres sit, which for anything but a square is less than the
 * tile's own size because the tiles interlock — pointy-top hexagons overlap vertically by a quarter,
 * so their rows are three-quarters of a tile apart. `hasOffsetRows` marks the shapes whose
 * alternating rows are shifted half a tile across, and `tileFlip` the shapes where alternate tiles
 * are mirrored, as triangles are. `neighbourhood` names which tiles touch which, since that differs
 * for every shape.
 */
const TILING_RATIOS: Record<ShapeConst.DefaultShape, TileBoardTiling> = {
    "square": {
        pitch: { width: 1, height: 1 },
        hasOffsetRows: false,
        tileFlip: "none",
        neighbourhood: "orthogonal",
    },
    "lozenge": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighbourhood: "diagonal",
    },
    "hexagon-pointy-top": {
        pitch: { width: 1, height: 0.75 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighbourhood: "diagonalAndAcross",
    },
    "hexagon-flat-top": {
        pitch: { width: 1.5, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighbourhood: "diagonalAndDown",
    },
    "triangle-up": {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "topToBottom",
        neighbourhood: "uprightTriangle",
    },
    "triangle-down": {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "topToBottom",
        neighbourhood: "uprightTriangle",
    },
    "triangle-left": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "leftToRight",
        neighbourhood: "sidewaysTriangle",
    },
    "triangle-right": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "leftToRight",
        neighbourhood: "sidewaysTriangle",
    },
};

/**
 * Which tiles touch a given one, before checking whether they are on the board.
 *
 * Every shape needs its own answer. Offset rows mean a tile's diagonal neighbours are at different
 * columns depending on whether its own row is a short one. Triangles have three neighbours rather
 * than four or six, and which three depends on whether that particular triangle is pointing up or
 * down. Flat-top hexagons are the odd case: their columns interleave, so the tiles directly above
 * and below are two rows away rather than one.
 */
const computeNeighbours = (tile: Index2d, layout: TileBoardLayout): Index2d[] => {
    const near = TileBoardUtils.getIsShortRow(tile.row, layout) ? 0 : -SHORT_ROW_TILES;
    const far = near + SHORT_ROW_TILES;

    if (layout.neighbourhood === "diagonal") {
        return [
            { row: tile.row - 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + near },
        ];
    }

    if (layout.neighbourhood === "diagonalAndAcross") {
        return [
            { row: tile.row - 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row, col: tile.col + 1 },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + near },
            { row: tile.row, col: tile.col - 1 },
        ];
    }

    if (layout.neighbourhood === "diagonalAndDown") {
        return [
            { row: tile.row - 2, col: tile.col },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 2, col: tile.col },
            { row: tile.row + 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + near },
        ];
    }

    if (layout.neighbourhood === "sidewaysTriangle") {
        const pointsRight = (layout.shape === POINTS_RIGHT) !== TileBoardUtils.getIsFlippedTile(tile, layout);

        if (pointsRight) {
            return [
                { row: tile.row - 1, col: tile.col },
                { row: tile.row + 1, col: tile.col },
                { row: tile.row, col: tile.col - 1 },
            ];
        }

        return [
            { row: tile.row - 1, col: tile.col },
            { row: tile.row, col: tile.col + 1 },
            { row: tile.row + 1, col: tile.col },
        ];
    }

    if (layout.neighbourhood === "uprightTriangle") {
        const pointsUp = (layout.shape === POINTS_UP) !== TileBoardUtils.getIsFlippedTile(tile, layout);

        if (pointsUp) {
            return [
                { row: tile.row, col: tile.col + 1 },
                { row: tile.row + 1, col: tile.col },
                { row: tile.row, col: tile.col - 1 },
            ];
        }

        return [
            { row: tile.row - 1, col: tile.col },
            { row: tile.row, col: tile.col + 1 },
            { row: tile.row, col: tile.col - 1 },
        ];
    }

    return [
        { row: tile.row - 1, col: tile.col },
        { row: tile.row, col: tile.col + 1 },
        { row: tile.row + 1, col: tile.col },
        { row: tile.row, col: tile.col - 1 },
    ];
};

/**
 * Lays out a board of interlocking tiles — squares, hexagons, triangles, lozenges — and says which
 * tiles touch which.
 *
 * The board is addressed by row and column, and everything else is derived: where a tile is drawn,
 * whether its row is a short one, whether it is mirrored, and who its neighbours are. That keeps the
 * component's own code the same whatever it is tiled with.
 *
 * Rows are not all the same length. Shapes with offset rows shift alternate rows half a tile across,
 * and those rows hold one tile fewer so the board stays rectangular — which is why the row's length
 * must be asked for rather than assumed to be the column count.
 */
export namespace TileBoardUtils {
    /**
     * How a shape tiles at a given tile size.
     *
     * @param shape Which tile shape.
     * @param tileSize One tile's size.
     * @returns The tiling with its pitch in pixels — how far apart tile centres sit, which is less than
     * the tile's own size wherever the tiles interlock.
     */
    export const getTiling = (shape: ShapeConst.DefaultShape, tileSize: Size2d): TileBoardTiling => {
        const ratios = TILING_RATIOS[shape];

        return {
            ...ratios,
            pitch: {
                width: tileSize.width * ratios.pitch.width,
                height: tileSize.height * ratios.pitch.height,
            },
        };
    };

    /**
     * Everything needed to place a board's tiles.
     *
     * @param shape Which tile shape.
     * @param count How many rows and columns.
     * @param tileSize One tile's size.
     * @param hasShortFirstRow Whether the first row is the offset, one-tile-shorter one. Only matters
     * for shapes with offset rows, and lets two boards be joined without a seam.
     */
    export const getLayout = (
        shape: ShapeConst.DefaultShape,
        count: Index2d,
        tileSize: Size2d,
        hasShortFirstRow: boolean,
    ): TileBoardLayout => ({
        ...getTiling(shape, tileSize),
        shape,
        count,
        tileSize,
        hasShortFirstRow,
    });

    /**
     * Whether a row is offset half a tile across, and so holds one tile fewer.
     *
     * @param row Which row.
     * @param layout The board's layout.
     * @returns Always `false` for shapes whose rows are not offset.
     */
    export const getIsShortRow = (row: number, layout: TileBoardLayout) =>
        layout.hasOffsetRows && MathUtils.isOdd(row + (layout.hasShortFirstRow ? SHORT_ROW_TILES : 0));

    /**
     * How many tiles a row holds.
     *
     * @param row Which row.
     * @param layout The board's layout.
     * @returns The column count, or one fewer for a short row. Never negative, so a single-column board
     * with offset rows does not report nonsense.
     */
    export const getRowLength = (row: number, layout: TileBoardLayout) =>
        Math.max(layout.count.col - (getIsShortRow(row, layout) ? SHORT_ROW_TILES : 0), NO_TILES);

    /**
     * How far a row is shifted across.
     *
     * @param row Which row.
     * @param layout The board's layout.
     * @returns Half a pitch for a short row, nothing otherwise.
     */
    export const getRowOffset = (row: number, layout: TileBoardLayout) =>
        getIsShortRow(row, layout) ? layout.pitch.width * HALF : 0;

    /**
     * Where a row's tiles start vertically.
     *
     * @param row Which row.
     * @param layout The board's layout.
     */
    export const getRowTop = (row: number, layout: TileBoardLayout) => row * layout.pitch.height;

    /**
     * A tile's centre, in board pixels.
     *
     * @param tile Which tile.
     * @param layout The board's layout.
     */
    export const getTileCenter = (tile: Index2d, layout: TileBoardLayout): Point2d => ({
        x: getRowOffset(tile.row, layout) + tile.col * layout.pitch.width + layout.tileSize.width * HALF,
        y: getRowTop(tile.row, layout) + layout.tileSize.height * HALF,
    });

    /**
     * The whole board's size.
     *
     * The pitch covers the gaps between tile centres and one full tile is added for the last one, since
     * a tile extends past its own centre.
     *
     * @param layout The board's layout.
     * @returns The size, or nothing for a board with no rows or columns.
     */
    export const getBoardSize = (layout: TileBoardLayout): Size2d => {
        if (layout.count.row < 1 || layout.count.col < 1) return EMPTY_SIZE;

        return {
            width: layout.pitch.width * (layout.count.col - 1) + layout.tileSize.width,
            height: layout.pitch.height * (layout.count.row - 1) + layout.tileSize.height,
        };
    };

    /**
     * Whether a tile is mirrored relative to its shape's default orientation.
     *
     * Triangles alternate, which is what lets them tile at all; every other shape is drawn the same way
     * everywhere.
     *
     * @param tile Which tile.
     * @param layout The board's layout.
     */
    export const getIsFlippedTile = (tile: Index2d, layout: TileBoardLayout) =>
        layout.tileFlip !== "none" && MathUtils.isOdd(tile.row + tile.col);

    /**
     * A tile's outline, in its own coordinates.
     *
     * @param shape Which tile shape.
     * @param tileSize One tile's size.
     * @param isFlipped Whether this tile is mirrored, from
     * {@link TileBoardUtils.getIsFlippedTile}.
     * @returns The corners. A mirrored tile's points are reversed as well as flipped, so the outline
     * keeps its winding direction — otherwise a fill rule or a stroke would treat it as inside out.
     */
    export const getTilePoints = (shape: ShapeConst.DefaultShape, tileSize: Size2d, isFlipped: boolean): Point2d[] => {
        const points = ShapeConst.getDefaultShapePoints(shape, tileSize);

        if (!isFlipped) return points;

        if (TILING_RATIOS[shape].tileFlip === "leftToRight") {
            return points.map((point) => ({ x: tileSize.width - point.x, y: point.y })).reverse();
        }

        return points.map((point) => ({ x: point.x, y: tileSize.height - point.y })).reverse();
    };

    /**
     * Whether a row and column name a real tile.
     *
     * The row's own length is what is checked, not the column count, so the missing tile at the end of a
     * short row is correctly reported as off the board.
     *
     * @param tile The tile to test.
     * @param layout The board's layout.
     */
    export const getIsOnBoard = (tile: Index2d, layout: TileBoardLayout) =>
        tile.row >= FIRST_INDEX &&
        tile.row < layout.count.row &&
        tile.col >= FIRST_INDEX &&
        tile.col < getRowLength(tile.row, layout);

    /**
     * The tiles touching a given one.
     *
     * @param tile Which tile.
     * @param layout The board's layout.
     * @returns The neighbours that exist, so a tile at an edge or a corner gets a shorter list. The
     * order is consistent for a given shape, going clockwise from the top.
     */
    export const getNeighbourTiles = (tile: Index2d, layout: TileBoardLayout): Index2d[] =>
        computeNeighbours(tile, layout).filter((neighbour) => getIsOnBoard(neighbour, layout));

    /** The top-left tile. */
    export const getFirstTile = (): Index2d => ({ row: FIRST_INDEX, col: FIRST_INDEX });

    /**
     * The last tile of the last row.
     *
     * @param layout The board's layout.
     */
    export const getLastTile = (layout: TileBoardLayout): Index2d => {
        const row = Math.max(layout.count.row - 1, FIRST_INDEX);

        return { row, col: Math.max(getRowLength(row, layout) - 1, FIRST_INDEX) };
    };

    /**
     * Pulls a row and column onto the board.
     *
     * The row is clamped first, because how far the column may go depends on which row it lands in.
     *
     * @param tile The tile to correct.
     * @param layout The board's layout.
     */
    export const clampTile = (tile: Index2d, layout: TileBoardLayout): Index2d => {
        const row = MathUtils.clamp(tile.row, FIRST_INDEX, Math.max(layout.count.row - 1, FIRST_INDEX));

        return {
            row,
            col: MathUtils.clamp(tile.col, FIRST_INDEX, Math.max(getRowLength(row, layout) - 1, FIRST_INDEX)),
        };
    };

    /**
     * Which tile a key moves the cursor to.
     *
     * Movement is by row and column rather than by adjacency, which is what a user expects from arrow
     * keys even on a hexagonal board: up goes to the row above, not to one of the two tiles diagonally
     * above. Moving into a short row lands on its last tile rather than falling off the end.
     *
     * @param key The key that was pressed.
     * @param from Where the cursor is now.
     * @param layout The board's layout.
     * @param opts.hasEdgeKeys Pass `false` to leave Home and End alone. They move to the ends of the
     * current row, not of the board.
     * @returns The tile to move to, or `undefined` when the key means nothing here or the board is
     * empty.
     */
    export const computeNextTile = (
        key: string,
        from: Index2d,
        layout: TileBoardLayout,
        opts?: { hasEdgeKeys?: boolean },
    ): Index2d | undefined => {
        if (layout.count.row < 1 || layout.count.col < 1) return;

        const step = (rows: number, cols: number) => clampTile({ row: from.row + rows, col: from.col + cols }, layout);

        if (key === "ArrowRight") return step(0, 1);
        if (key === "ArrowLeft") return step(0, -1);
        if (key === "ArrowDown") return step(1, 0);
        if (key === "ArrowUp") return step(-1, 0);

        if (opts?.hasEdgeKeys === false) return;

        if (key === "Home") return clampTile({ row: from.row, col: FIRST_INDEX }, layout);
        if (key === "End") return clampTile({ row: from.row, col: getRowLength(from.row, layout) - 1 }, layout);
    };
}
