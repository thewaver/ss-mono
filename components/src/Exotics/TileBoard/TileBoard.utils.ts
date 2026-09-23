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
/** Halfway, for centering a tile or offsetting a row. */
const HALF = 0.5;
/** The triangle shape whose unflipped tiles point upwards. */
const POINTS_UP = "triangle-up";
/** The triangle shape whose unflipped tiles point rightwards. */
const POINTS_RIGHT = "triangle-right";
/** A top row as wide as the bottom one, which is a board drawn flat. */
const NO_TAPER = 1;
/** The narrowest top row a taper may ask for, since a top row of no width would put the bottom one at infinity. */
const MIN_TAPER = 0.01;

const DODECAGON_ROW_PITCH = Math.sqrt(3) * HALF;

/**
 * How each tile shape tiles, as fractions of one tile's size.
 *
 * The pitch is how far apart tile centers sit, which for anything but a square is less than the
 * tile's own size because the tiles interlock — pointy-top hexagons overlap vertically by a quarter,
 * so their rows are three-quarters of a tile apart. `hasOffsetRows` marks the shapes whose
 * alternating rows are shifted half a tile across, and `tileFlip` the shapes where alternate tiles
 * are mirrored, as triangles are. `neighborhood` names which tiles touch which, since that differs
 * for every shape.
 */
const TILING_RATIOS: Record<ShapeConst.DefaultShape, TileBoardTiling> = {
    "square": {
        pitch: { width: 1, height: 1 },
        hasOffsetRows: false,
        tileFlip: "none",
        neighborhood: "orthogonal",
    },
    "lozenge": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonal",
    },
    "hexagon-pointy-top": {
        pitch: { width: 1, height: 0.75 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonalAndAcross",
    },
    "hexagon-flat-top": {
        pitch: { width: 1.5, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonalAndDown",
    },
    "triangle-up": {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "topToBottom",
        neighborhood: "uprightTriangle",
    },
    "triangle-down": {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "topToBottom",
        neighborhood: "uprightTriangle",
    },
    "triangle-left": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "leftToRight",
        neighborhood: "sidewaysTriangle",
    },
    "triangle-right": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "leftToRight",
        neighborhood: "sidewaysTriangle",
    },
    "dodecagon": {
        pitch: { width: 1, height: DODECAGON_ROW_PITCH },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonalAndAcross",
    },
};

/**
 * Whether a row is offset half a tile across, and so holds one tile fewer.
 *
 * At module level because the neighbor and pointing tables below need it, and a module-level const is
 * evaluated before the namespace object exists. Published as {@link TileBoardUtils.getIsShortRow}.
 *
 * @param row Which row.
 * @param layout The board's layout.
 * @returns Always `false` for shapes whose rows are not offset.
 */
const computeIsShortRow = (row: number, layout: TileBoardLayout) =>
    layout.hasOffsetRows && MathUtils.isOdd(row + (layout.hasShortFirstRow ? SHORT_ROW_TILES : 0));

/**
 * Whether a tile is mirrored relative to its shape's default orientation.
 *
 * Triangles alternate, which is what lets them tile at all; every other shape is drawn the same way
 * everywhere. At module level for the same reason as {@link computeIsShortRow}, and published as
 * {@link TileBoardUtils.getIsFlippedTile}.
 *
 * @param tile Which tile.
 * @param layout The board's layout.
 */
const computeIsFlippedTile = (tile: Index2d, layout: TileBoardLayout) =>
    layout.tileFlip !== "none" && MathUtils.isOdd(tile.row + tile.col);

/**
 * The board's size before any taper, which is the sheet the taper is applied to.
 *
 * At module level for the same reason as {@link computeIsShortRow}; the published
 * {@link TileBoardUtils.getBoardSize} is the size as drawn.
 */
const computeFlatBoardSize = (layout: TileBoardLayout): Size2d => {
    if (layout.count.row < 1 || layout.count.col < 1) return EMPTY_SIZE;

    return {
        width: layout.pitch.width * (layout.count.col - 1) + layout.tileSize.width,
        height: layout.pitch.height * (layout.count.row - 1) + layout.tileSize.height,
    };
};

/**
 * Which tiles touch a given one, before checking whether they are on the board.
 *
 * Every shape needs its own answer. Offset rows mean a tile's diagonal neighbors are at different
 * columns depending on whether its own row is a short one. Triangles have three neighbors rather
 * than four or six, and which three depends on whether that particular triangle is pointing up or
 * down. Flat-top hexagons are the odd case: their columns interleave, so the tiles directly above
 * and below are two rows away rather than one.
 */
const computeNeighbors = (tile: Index2d, layout: TileBoardLayout): Index2d[] => {
    const near = computeIsShortRow(tile.row, layout) ? 0 : -SHORT_ROW_TILES;
    const far = near + SHORT_ROW_TILES;

    if (layout.neighborhood === "diagonal") {
        return [
            { row: tile.row - 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + near },
        ];
    }

    if (layout.neighborhood === "diagonalAndAcross") {
        return [
            { row: tile.row - 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row, col: tile.col + 1 },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + near },
            { row: tile.row, col: tile.col - 1 },
        ];
    }

    if (layout.neighborhood === "diagonalAndDown") {
        return [
            { row: tile.row - 2, col: tile.col },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 2, col: tile.col },
            { row: tile.row + 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + near },
        ];
    }

    if (layout.neighborhood === "sidewaysTriangle") {
        const pointsRight = (layout.shape === POINTS_RIGHT) !== computeIsFlippedTile(tile, layout);

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

    if (layout.neighborhood === "uprightTriangle") {
        const pointsUp = (layout.shape === POINTS_UP) !== computeIsFlippedTile(tile, layout);

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
 * whether its row is a short one, whether it is mirrored, and who its neighbors are. That keeps the
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
     * @returns The tiling with its pitch in pixels — how far apart tile centers sit, which is less than
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
     * @param taper How wide the top of the board is drawn, as a fraction of the bottom. `1` is a flat
     * board; anything less leans it away from the viewer. Held between a hundredth and `1`.
     */
    export const getLayout = (
        shape: ShapeConst.DefaultShape,
        count: Index2d,
        tileSize: Size2d,
        hasShortFirstRow: boolean,
        taper: number,
    ): TileBoardLayout => ({
        ...getTiling(shape, tileSize),
        shape,
        count,
        tileSize,
        hasShortFirstRow,
        taper: MathUtils.clamp(taper, MIN_TAPER, NO_TAPER),
    });

    /**
     * Whether a row is offset half a tile across, and so holds one tile fewer.
     *
     * @param row Which row.
     * @param layout The board's layout.
     * @returns Always `false` for shapes whose rows are not offset.
     */
    export const getIsShortRow = computeIsShortRow;

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
     * How much the taper shrinks whatever is drawn at a point on the board.
     *
     * The bottom edge is drawn at full size and the top edge at the layout's taper, and in between the
     * shrink follows perspective rather than a straight line — the rows nearer the top close up faster,
     * as the far side of a real table does. A piece standing on the board rather than painted into it is
     * scaled by this, so it is the same size as the tile beneath it wherever it stands.
     *
     * @param point A point on the untapered board, in the coordinates {@link TileBoardUtils.getTileCenter}
     * would use with no taper.
     * @param layout The board's layout.
     * @returns `1` along the bottom edge and on a flat board, the taper along the top edge.
     */
    export const getDrawnScale = (point: Point2d, layout: TileBoardLayout) => {
        const height = computeFlatBoardSize(layout).height;

        if (layout.taper === NO_TAPER || height === 0) return NO_TAPER;

        return layout.taper / (1 - ((1 - layout.taper) * point.y) / height);
    };

    /**
     * Where a point on the board is drawn once the taper is applied.
     *
     * The bottom edge stays where it was, every row is pulled in towards the board's middle by its
     * {@link TileBoardUtils.getDrawnScale}, and the rows close up vertically by the same perspective, so
     * the whole board is drawn `taper` times its flat height with its top at the top of its box.
     *
     * @param point A point on the untapered board.
     * @param layout The board's layout.
     * @returns The point as drawn, measured from the board's top left corner, which is what a piece
     * positioned beside the board needs.
     */
    export const getDrawnPoint = (point: Point2d, layout: TileBoardLayout): Point2d => {
        const middle = computeFlatBoardSize(layout).width * HALF;
        const scale = getDrawnScale(point, layout);

        return {
            x: middle + (point.x - middle) * scale,
            y: point.y * layout.taper * scale,
        };
    };

    /**
     * The CSS transform that draws a flat board tapered.
     *
     * One `matrix3d`, applied from the board's top left corner, that sends every point exactly where
     * {@link TileBoardUtils.getDrawnPoint} says it goes. The browser then draws the tiles, their paint and
     * their hit layers through it, so the tiles still meet edge to edge and a press lands on the tile drawn
     * under it.
     *
     * @param layout The board's layout.
     * @returns The transform, or `undefined` for a flat or empty board, which needs none.
     */
    export const getTaperTransform = (layout: TileBoardLayout) => {
        const size = computeFlatBoardSize(layout);
        const taper = layout.taper;

        if (taper === NO_TAPER || size.height === 0) return;

        const recede = (1 - taper) / size.height;
        const middle = size.width * HALF;

        return `matrix3d(${[
            [taper, 0, 0, 0],
            [-middle * recede, taper * taper, 0, -recede],
            [0, 0, taper, 0],
            [middle * (1 - taper), 0, 0, 1],
        ]
            .flat()
            .join(", ")})`;
    };

    /**
     * A tile's center, where the board draws it.
     *
     * @param tile Which tile.
     * @param layout The board's layout.
     * @returns The middle of the tile's box, taper included, measured from the board's top left corner.
     */
    export const getTileCenter = (tile: Index2d, layout: TileBoardLayout): Point2d =>
        getDrawnPoint(
            {
                x: getRowOffset(tile.row, layout) + tile.col * layout.pitch.width + layout.tileSize.width * HALF,
                y: getRowTop(tile.row, layout) + layout.tileSize.height * HALF,
            },
            layout,
        );

    /**
     * How much the taper shrinks a piece standing on a tile.
     *
     * Read at the tile's center, so a piece drawn at {@link TileBoardUtils.getTileCenter} and scaled by
     * this matches the tile it stands on, and grows or shrinks as it moves down or up the board.
     *
     * @param tile Which tile.
     * @param layout The board's layout.
     * @returns `1` on a flat board.
     */
    export const getTileScale = (tile: Index2d, layout: TileBoardLayout) =>
        getDrawnScale({ x: 0, y: getRowTop(tile.row, layout) + layout.tileSize.height * HALF }, layout);

    /**
     * The whole board's size, as drawn.
     *
     * The pitch covers the gaps between tile centers and one full tile is added for the last one, since
     * a tile extends past its own center. A taper keeps the bottom edge's width and draws the board
     * `taper` times as tall.
     *
     * @param layout The board's layout.
     * @returns The size, or nothing for a board with no rows or columns.
     */
    export const getBoardSize = (layout: TileBoardLayout): Size2d => {
        const size = computeFlatBoardSize(layout);

        return { width: size.width, height: size.height * layout.taper };
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
    export const getIsFlippedTile = computeIsFlippedTile;

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
     * @returns The neighbors that exist, so a tile at an edge or a corner gets a shorter list. The
     * order is consistent for a given shape, going clockwise from the top.
     */
    export const getNeighborTiles = (tile: Index2d, layout: TileBoardLayout): Index2d[] =>
        computeNeighbors(tile, layout).filter((neighbor) => getIsOnBoard(neighbor, layout));

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
