import {
    Index2d,
    type Index2dString,
    MathUtils,
    Point2d,
    type Rect,
    ShapeConst,
    type Size2d,
} from "@thewaver/ss-utils";

import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type {
    TileBoardKeyAction,
    TileBoardLayout,
    TileBoardPiece,
    TileBoardSweepDefs,
    TileBoardTileGeometry,
    TileBoardTiling,
    TileBoardTilingKind,
} from "./TileBoard.types";

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
const POINTS_UP = "triangle_up";
/** The triangle shape whose unflipped tiles point rightwards. */
const POINTS_RIGHT = "triangle_right";
/** A top row as wide as the bottom one, which is a board drawn flat. */
const NO_TAPER = 1;
/** The narrowest top row a taper may ask for, since a top row of no width would put the bottom one at infinity. */
const MIN_TAPER = 0.01;

/** The fewest corners a contour needs to enclose anything. */
const MIN_CLIP_POINTS = 3;
/** The clip a tile wears when it has no contour to wear. */
const NO_CLIP = "none";
/** The keys that, held with Ctrl or Cmd, jump to the first and last tile of the board. */
const EDGE_KEYS = ["Home", "End"];
/** No mouse button held. */
const NO_BUTTONS = 0;
/** The primary mouse button. */
const PRIMARY_BUTTON = 0;

/** The row spacing of circles packed as tightly as they go, which the hectogon tiles at. */
const CLOSE_PACKED_ROW_PITCH = Math.sqrt(3) * HALF;
/** One whole box, as fractions of itself. */
const WHOLE_BOX: Rect = { x: 0, y: 0, width: 1, height: 1 };
/** The pitch of a tiling that cuts each box into pieces, which steps one whole box at a time. */
const BOX_PITCH: Size2d = { width: 1, height: 1 };
/** A full turn, for ordering neighbors by direction. */
const FULL_TURN = Math.PI * 2;

/** A box cut from its bottom left corner to its top right one, the left-hand half first. */
const HALVES_RISING: TileBoardPiece[] = [
    { shape: "triangle_top_left", box: WHOLE_BOX },
    { shape: "triangle_bottom_right", box: WHOLE_BOX },
];
/** A box cut from its top left corner to its bottom right one, the left-hand half first. */
const HALVES_FALLING: TileBoardPiece[] = [
    { shape: "triangle_bottom_left", box: WHOLE_BOX },
    { shape: "triangle_top_right", box: WHOLE_BOX },
];
/** A box cut along both diagonals, left to right by where each quarter sits. */
const QUARTERS: TileBoardPiece[] = [
    { shape: "triangle_right", box: { x: 0, y: 0, width: HALF, height: 1 } },
    { shape: "triangle_down", box: { x: 0, y: 0, width: 1, height: HALF } },
    { shape: "triangle_up", box: { x: 0, y: HALF, width: 1, height: HALF } },
    { shape: "triangle_left", box: { x: HALF, y: 0, width: HALF, height: 1 } },
];

/**
 * The pieces of a tiling where every tile is the whole shape, which is every tiling that does not cut a box.
 *
 * @param shape The tile shape.
 */
const asWhole = (shape: ShapeConst.DefaultShape): TileBoardPiece[][] => [[{ shape, box: WHOLE_BOX }]];

/**
 * A tiling that cuts every box into pieces, so the tiles meet along the cuts as well as the box edges.
 *
 * @param pieces The pieces of one box, left to right, with a second list for the boxes in between when
 * the cut alternates like a checkerboard.
 */
const asCut = (pieces: TileBoardPiece[][]): TileBoardTiling => ({
    pitch: BOX_PITCH,
    hasOffsetRows: false,
    tileFlip: "none",
    neighborhood: "shared_edge",
    pieces,
});

/**
 * How each tiling lays its tiles, as fractions of one tile's size.
 *
 * The pitch is how far apart tile centers sit, which for anything but a square is less than the
 * tile's own size because the tiles interlock — pointy-top hexagons overlap vertically by a quarter,
 * so their rows are three-quarters of a tile apart. `hasOffsetRows` marks the shapes whose
 * alternating rows are shifted half a tile across, and `tileFlip` the shapes where alternate tiles
 * are mirrored, as the pointed triangles are. `neighborhood` names which tiles touch which, since that
 * differs for every shape.
 *
 * The halved and quartered boxes work differently: the tile size is a box, and `pieces` cuts each box into
 * several tiles, so a row holds that many tiles per box and its pitch is the box. `triangle-ltr` cuts each box
 * from its top left corner down to its bottom right one, `triangle-rtl` from its top right corner down to its
 * bottom left one.
 */
const TILING_RATIOS: Record<TileBoardTilingKind, TileBoardTiling> = {
    square: {
        pitch: { width: 1, height: 1 },
        hasOffsetRows: false,
        tileFlip: "none",
        neighborhood: "orthogonal",
        pieces: asWhole("square"),
    },
    lozenge: {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonal",
        pieces: asWhole("lozenge"),
    },
    hexagon_pointy_top: {
        pitch: { width: 1, height: 0.75 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonal_and_across",
        pieces: asWhole("hexagon_pointy_top"),
    },
    hexagon_flat_top: {
        pitch: { width: 1.5, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonal_and_down",
        pieces: asWhole("hexagon_flat_top"),
    },
    triangle_up: {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "top_to_bottom",
        neighborhood: "upright_triangle",
        pieces: asWhole("triangle_up"),
    },
    triangle_down: {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "top_to_bottom",
        neighborhood: "upright_triangle",
        pieces: asWhole("triangle_down"),
    },
    triangle_left: {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "left_to_right",
        neighborhood: "sideways_triangle",
        pieces: asWhole("triangle_left"),
    },
    triangle_right: {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "left_to_right",
        neighborhood: "sideways_triangle",
        pieces: asWhole("triangle_right"),
    },
    hectogon: {
        pitch: { width: 1, height: CLOSE_PACKED_ROW_PITCH },
        hasOffsetRows: true,
        tileFlip: "none",
        neighborhood: "diagonal_and_across",
        pieces: asWhole("hectogon"),
    },
    triangle_ltr: asCut([HALVES_FALLING]),
    triangle_rtl: asCut([HALVES_RISING]),
    square_quarters: asCut([QUARTERS]),
    lozenge_quarters: asCut([HALVES_RISING, HALVES_FALLING]),
};

/**
 * Whether a built-in shape is also a tiling of its own.
 *
 * Every shape is, except the four corner-cut triangles, which only ever appear as pieces of `triangle_ltr` and
 * `triangle_rtl`.
 *
 * @param shape The shape.
 */
const computeIsTilingKind = (shape: ShapeConst.DefaultShape): shape is ShapeConst.DefaultShape & TileBoardTilingKind =>
    shape in TILING_RATIOS;

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
 * Whether a tiling cuts each box into several tiles rather than laying one whole shape per tile.
 *
 * @param tiling The tiling.
 */
const computeIsCut = (tiling: TileBoardTiling) => tiling.pieces.length > 1 || tiling.pieces[0].length > 1;

/**
 * How many tiles the longest row holds.
 *
 * At module level for the same reason as {@link computeIsShortRow}, and published as
 * {@link TileBoardUtils.getColumnCount}.
 *
 * @param layout The board's layout.
 * @returns The column count, or for a tiling that cuts boxes, the boxes across times the pieces in each.
 */
const computeColumnCount = (layout: TileBoardLayout) =>
    layout.count.col * (computeIsCut(layout) ? layout.pieces[0].length : 1);

/**
 * Which piece of which box a tile is, on a tiling that cuts its boxes.
 *
 * @param tile Which tile.
 * @param layout The board's layout.
 * @param pitch The size of one box. The layout's own pitch places the piece in pixels; a pitch of one
 * places it in whole boxes, where every corner lands on a half and two tiles' corners compare exactly.
 * @returns The piece and the room it is cut from, before any gap, measured from the board's top left.
 */
const computePiece = (tile: Index2d, layout: TileBoardLayout, pitch: Size2d) => {
    const perBox = layout.pieces[0].length;
    const index = tile.col;
    const boxCol = Math.floor(index / perBox);
    const variant = layout.pieces[MathUtils.wrapIndex(tile.row + boxCol, layout.pieces.length)];
    const piece = variant[MathUtils.wrapIndex(index, perBox)];
    const room: Rect = {
        x: (boxCol + piece.box.x) * pitch.width,
        y: (tile.row + piece.box.y) * pitch.height,
        width: piece.box.width * pitch.width,
        height: piece.box.height * pitch.height,
    };

    return { piece, room };
};

/**
 * A cut tile's corners where they sit on the board, before any gap.
 *
 * @param tile Which tile.
 * @param layout The board's layout.
 * @param pitch The size of one box, as {@link computePiece} takes it.
 */
const computePiecePoints = (tile: Index2d, layout: TileBoardLayout, pitch: Size2d) => {
    const { piece, room } = computePiece(tile, layout, pitch);

    return ShapeConst.getDefaultShapePoints(piece.shape, room).map((point) => ({
        x: point.x + room.x,
        y: point.y + room.y,
    }));
};

/**
 * The average of a contour's corners, which for a triangle is where its weight sits.
 *
 * @param points The corners.
 */
const computeMeanPoint = (points: Point2d[]): Point2d => ({
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
});

/**
 * A convex contour with every edge moved inwards by the same distance.
 *
 * This is what puts an even gap between cut tiles: each tile gives up half the gap along every edge,
 * the slanted cuts included, where shrinking the tile's box would leave the cuts touching.
 *
 * @param points The corners, clockwise.
 * @param distance How far each edge moves in.
 * @returns The new corners, in the same order. A contour too small to give up that much collapses to its
 * own middle rather than turning inside out.
 */
const computeInsetPoints = (points: Point2d[], distance: number): Point2d[] => {
    const lines = points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        const length = Math.hypot(next.x - point.x, next.y - point.y);
        const direction = { x: (next.x - point.x) / length, y: (next.y - point.y) / length };

        return { origin: { x: point.x - direction.y * distance, y: point.y + direction.x * distance }, direction };
    });

    const inset = lines.map((line, index) => {
        const previous = lines[(index + lines.length - 1) % lines.length];
        const cross = previous.direction.x * line.direction.y - previous.direction.y * line.direction.x;
        const along =
            ((line.origin.x - previous.origin.x) * line.direction.y -
                (line.origin.y - previous.origin.y) * line.direction.x) /
            cross;

        return {
            x: previous.origin.x + previous.direction.x * along,
            y: previous.origin.y + previous.direction.y * along,
        };
    });

    const twiceArea = inset.reduce((sum, point, index) => {
        const next = inset[(index + 1) % inset.length];

        return sum + point.x * next.y - next.x * point.y;
    }, 0);

    if (twiceArea > 0) return inset;

    const middle = computeMeanPoint(points);

    return points.map(() => middle);
};

/**
 * The tiles a cut tile shares an edge with, found from the pieces themselves.
 *
 * Every tile within a row and two boxes of this one is cut out in whole boxes, where corners land on
 * halves and compare exactly, and any whose contour runs back along one of this tile's edges is a
 * neighbor. They come back clockwise from the top, by the direction of the shared edge from this tile's
 * middle.
 *
 * @param tile Which tile.
 * @param layout The board's layout.
 */
const computeSharedEdgeNeighbors = (tile: Index2d, layout: TileBoardLayout): Index2d[] => {
    const own = computePiecePoints(tile, layout, BOX_PITCH);
    const middle = computeMeanPoint(own);
    const reach = layout.pieces[0].length * 2;
    const neighbors: { tile: Index2d; turn: number }[] = [];

    for (let row = tile.row - 1; row <= tile.row + 1; row++) {
        for (let col = tile.col - reach; col <= tile.col + reach; col++) {
            if (row === tile.row && col === tile.col) continue;

            const other = computePiecePoints({ row, col }, layout, BOX_PITCH);

            own.forEach((point, index) => {
                const next = own[(index + 1) % own.length];
                const isShared = other.some(
                    (otherPoint, otherIndex) =>
                        Point2d.isSame(point, other[(otherIndex + 1) % other.length]) &&
                        Point2d.isSame(next, otherPoint),
                );

                if (!isShared) return;

                const turn = Math.atan2((point.x + next.x) * HALF - middle.x, middle.y - (point.y + next.y) * HALF);

                neighbors.push({ tile: { row, col }, turn: (turn + FULL_TURN) % FULL_TURN });
            });
        }
    }

    return neighbors.sort((a, b) => a.turn - b.turn).map((neighbor) => neighbor.tile);
};

/**
 * The board's size before any taper, which is the sheet the taper is applied to.
 *
 * At module level for the same reason as {@link computeIsShortRow}; the published
 * {@link TileBoardUtils.getBoardSize} is the size as drawn.
 */
const computeFlatBoardSize = (layout: TileBoardLayout): Size2d => {
    if (layout.count.row < 1 || layout.count.col < 1) return EMPTY_SIZE;

    if (computeIsCut(layout)) {
        const lastCol = computeColumnCount(layout) - 1;
        const rights = Array.from({ length: Math.min(layout.count.row, layout.pieces.length) }, (_unused, row) => {
            const { room } = computePiece({ row, col: lastCol }, layout, layout.pitch);

            return room.x + room.width;
        });

        return { width: Math.max(...rights), height: layout.pitch.height * layout.count.row };
    }

    return {
        width: layout.pitch.width * (layout.count.col - 1) + layout.tileSize.width,
        height: layout.pitch.height * (layout.count.row - 1) + layout.tileSize.height,
    };
};

/**
 * Where a tile's middle sits on the flat board.
 *
 * The middle of the tile's box for a whole shape. A cut tile uses the average of its corners instead,
 * because the middle of a box cut corner to corner lies on the cut, between two tiles.
 *
 * @param tile Which tile.
 * @param layout The board's layout.
 */
const computeFlatTileCenter = (tile: Index2d, layout: TileBoardLayout): Point2d => {
    if (computeIsCut(layout)) return computeMeanPoint(computePiecePoints(tile, layout, layout.pitch));

    return {
        x:
            (computeIsShortRow(tile.row, layout) ? layout.pitch.width * HALF : 0) +
            tile.col * layout.pitch.width +
            layout.tileSize.width * HALF,
        y: tile.row * layout.pitch.height + layout.tileSize.height * HALF,
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
    if (layout.neighborhood === "shared_edge") return computeSharedEdgeNeighbors(tile, layout);

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

    if (layout.neighborhood === "diagonal_and_across") {
        return [
            { row: tile.row - 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row, col: tile.col + 1 },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + near },
            { row: tile.row, col: tile.col - 1 },
        ];
    }

    if (layout.neighborhood === "diagonal_and_down") {
        return [
            { row: tile.row - 2, col: tile.col },
            { row: tile.row - 1, col: tile.col + far },
            { row: tile.row + 1, col: tile.col + far },
            { row: tile.row + 2, col: tile.col },
            { row: tile.row + 1, col: tile.col + near },
            { row: tile.row - 1, col: tile.col + near },
        ];
    }

    if (layout.neighborhood === "sideways_triangle") {
        const pointsRight = (layout.tiling === POINTS_RIGHT) !== computeIsFlippedTile(tile, layout);

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

    if (layout.neighborhood === "upright_triangle") {
        const pointsUp = (layout.tiling === POINTS_UP) !== computeIsFlippedTile(tile, layout);

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
     * How a tiling lays its tiles at a given tile size.
     *
     * @param tiling Which tiling.
     * @param tileSize One tile's size, or for a tiling that cuts boxes into pieces, one box's.
     * @returns The tiling with its pitch in pixels — how far apart tile centers sit, which is less than
     * the tile's own size wherever the tiles interlock.
     */
    export const getTiling = (tiling: TileBoardTilingKind, tileSize: Size2d): TileBoardTiling => {
        const ratios = TILING_RATIOS[tiling];

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
     * @param tiling Which tiling.
     * @param count How many rows and columns. A tiling that cuts boxes counts boxes, so three columns of
     * quartered squares is three squares and twelve tiles across.
     * @param tileSize One tile's size, or for a tiling that cuts boxes into pieces, one box's.
     * @param hasShortFirstRow Whether the first row is the offset, one-tile-shorter one. Only matters
     * for shapes with offset rows, and lets two boards be joined without a seam.
     * @param taper How wide the top of the board is drawn, as a fraction of the bottom. `1` is a flat
     * board; anything less leans it away from the viewer. Held between a hundredth and `1`.
     */
    export const getLayout = (
        tiling: TileBoardTilingKind,
        count: Index2d,
        tileSize: Size2d,
        hasShortFirstRow: boolean,
        taper: number,
    ): TileBoardLayout => ({
        ...getTiling(tiling, tileSize),
        tiling,
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
     * How many tiles the longest row holds, which is what a grid announces as its column count.
     *
     * @param layout The board's layout.
     * @returns The column count, or for a tiling that cuts boxes, the boxes across times the pieces in each.
     */
    export const getColumnCount = computeColumnCount;

    /**
     * How many tiles a row holds.
     *
     * @param row Which row.
     * @param layout The board's layout.
     * @returns {@link getColumnCount}, or one fewer for a short row. Never negative, so a single-column board
     * with offset rows does not report nonsense.
     */
    export const getRowLength = (row: number, layout: TileBoardLayout) =>
        Math.max(computeColumnCount(layout) - (getIsShortRow(row, layout) ? SHORT_ROW_TILES : 0), NO_TILES);

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
     * @returns The middle of the tile's box, taper included, measured from the board's top left corner. A
     * tile cut from a box answers the average of its corners instead, since the middle of a box cut corner
     * to corner lies on the cut.
     */
    export const getTileCenter = (tile: Index2d, layout: TileBoardLayout): Point2d =>
        getDrawnPoint(computeFlatTileCenter(tile, layout), layout);

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
        getDrawnScale({ x: 0, y: computeFlatTileCenter(tile, layout).y }, layout);

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
     * A tile's contour, in its own coordinates.
     *
     * @param shape Which tile shape.
     * @param tileSize One tile's size.
     * @param isFlipped Whether this tile is mirrored, from
     * {@link TileBoardUtils.getIsFlippedTile}.
     * @returns The corners. A mirrored tile's points are reversed as well as flipped, so the contour
     * keeps its winding direction — otherwise a fill rule or a stroke would treat it as inside out.
     */
    export const getTilePoints = (shape: ShapeConst.DefaultShape, tileSize: Size2d, isFlipped: boolean): Point2d[] => {
        const points = ShapeConst.getDefaultShapePoints(shape, tileSize);

        if (!isFlipped) return points;

        if (computeIsTilingKind(shape) && TILING_RATIOS[shape].tileFlip === "left_to_right") {
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

    /**
     * Every tile a piece could reach in a given number of steps, one neighbor per step.
     *
     * A step goes from a tile to one of its {@link TileBoardUtils.getNeighborTiles}, so the answer follows the
     * board's own adjacency whatever the shape: six ways out of a hexagon, three out of a triangle. A blocked tile
     * is never entered, so it is not in the answer and nothing beyond it is reached through it.
     *
     * @param from Where the piece stands. It is not in the answer.
     * @param reach How many steps may be taken. Nothing is reached below one.
     * @param layout The board's layout.
     * @param computeIsBlocked Whether a tile may not be stepped on. Every tile is open when it is left out.
     * @returns The tiles, nearest first, each once.
     */
    export const getTilesWithin = (
        from: Index2d,
        reach: number,
        layout: TileBoardLayout,
        computeIsBlocked?: (tile: Index2d) => boolean,
    ): Index2d[] => {
        const seen = new Set([Index2d.toString(from)]);
        const within: Index2d[] = [];

        let edge = [from];

        for (let step = 0; step < reach && edge.length > 0; step++) {
            const next: Index2d[] = [];

            for (const tile of edge) {
                for (const neighbor of getNeighborTiles(tile, layout)) {
                    const key = Index2d.toString(neighbor);

                    if (seen.has(key)) continue;

                    seen.add(key);

                    if (computeIsBlocked?.(neighbor)) continue;

                    next.push(neighbor);
                    within.push(neighbor);
                }
            }

            edge = next;
        }

        return within;
    };

    /**
     * The shortest way from one tile to another, stepping from neighbor to neighbor.
     *
     * Steps follow {@link TileBoardUtils.getNeighborTiles}, so the route is as short as the board's own
     * adjacency allows, and it goes round blocked tiles rather than through them. Where several routes are
     * equally short, the one taken is the same every time for the same board.
     *
     * @param from Where the route starts. It is never checked against `computeIsBlocked`, since it is where the
     * piece already stands.
     * @param to Where the route ends.
     * @param layout The board's layout.
     * @param computeIsBlocked Whether a tile may not be stepped on. Every tile is open when it is left out.
     * @returns The tiles in order, `from` first and `to` last, so its length less one is the number of steps.
     * Just `from` when the two are the same tile, and `undefined` when either is off the board, `to` is blocked,
     * or nothing open joins them.
     */
    export const getShortestRoute = (
        from: Index2d,
        to: Index2d,
        layout: TileBoardLayout,
        computeIsBlocked?: (tile: Index2d) => boolean,
    ): Index2d[] | undefined => {
        if (!getIsOnBoard(from, layout) || !getIsOnBoard(to, layout)) return;
        if (Index2d.isSame(from, to)) return [from];
        if (computeIsBlocked?.(to)) return;

        const cameFrom = new Map<Index2dString, Index2d>();
        const seen = new Set([Index2d.toString(from)]);

        let edge = [from];

        while (edge.length > 0) {
            const next: Index2d[] = [];

            for (const tile of edge) {
                for (const neighbor of getNeighborTiles(tile, layout)) {
                    const key = Index2d.toString(neighbor);

                    if (seen.has(key)) continue;

                    seen.add(key);

                    if (computeIsBlocked?.(neighbor)) continue;

                    cameFrom.set(key, tile);

                    if (!Index2d.isSame(neighbor, to)) {
                        next.push(neighbor);

                        continue;
                    }

                    const route = [neighbor];

                    for (let back = cameFrom.get(key); back; back = cameFrom.get(Index2d.toString(back))) {
                        route.unshift(back);
                    }

                    return route;
                }
            }

            edge = next;
        }
    };

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

    /**
     * The CSS clip that cuts a tile's hit layer to its contour.
     *
     * @param points The tile's corners, in pixels from its top left.
     * @returns A `polygon()`, or `"none"` for fewer than three corners, which enclose nothing.
     */
    export const getClipPath = (points: Point2d[]) => {
        if (points.length < MIN_CLIP_POINTS) return NO_CLIP;

        return `polygon(${points.map((point) => `${point.x}px ${point.y}px`).join(", ")})`;
    };

    /**
     * How large one tile is drawn, once the gap is taken off the room it is given.
     *
     * @param pitchSize The room one tile is given, which is the `tileSize` a consumer passes.
     * @param gap The space left between tiles.
     * @returns The tile's own size, never below zero.
     */
    export const getTileBoxSize = (pitchSize: Size2d, gap: number): Size2d => ({
        width: Math.max(pitchSize.width - gap, NO_TILES),
        height: Math.max(pitchSize.height - gap, NO_TILES),
    });

    /**
     * Where a row's first tile box is drawn, on the flat board.
     *
     * {@link getRowOffset} across and {@link getRowTop} down, each moved in by half the gap, which is what
     * centers a tile shrunk by the gap in the room it was given. A tiling that cuts boxes answers the row's
     * own top left, because each of its tiles works out its gap for itself in {@link getTileGeometry}.
     *
     * @param row The row.
     * @param layout The board's layout.
     * @param gap The space left between tiles.
     */
    export const getRowOrigin = (row: number, layout: TileBoardLayout, gap: number): Point2d => {
        if (computeIsCut(layout)) return { x: 0, y: getRowTop(row, layout) };

        return {
            x: getRowOffset(row, layout) + gap * HALF,
            y: getRowTop(row, layout) + gap * HALF,
        };
    };

    /**
     * Where one tile is drawn inside its row, how large, and the contour it is cut to.
     *
     * A whole shape steps along the row by the pitch, shrinks by the gap and is turned over where the tiling
     * says. A tile cut from a box gives up half the gap along every edge, its cuts included, and its box is
     * then whatever that leaves — so the tiles of one board need not all be the same size.
     *
     * @param tile Which tile.
     * @param layout The board's layout.
     * @param gap The space left between tiles.
     * @returns The tile's offset from {@link getRowOrigin}, its box size, its corners inside that box, and
     * whether it is turned over.
     */
    export const getTileGeometry = (tile: Index2d, layout: TileBoardLayout, gap: number): TileBoardTileGeometry => {
        if (!computeIsCut(layout)) {
            const size = getTileBoxSize(layout.tileSize, gap);
            const isFlipped = computeIsFlippedTile(tile, layout);

            return {
                offset: { x: tile.col * layout.pitch.width, y: 0 },
                size,
                points: getTilePoints(layout.pieces[0][0].shape, size, isFlipped),
                isFlipped,
            };
        }

        const points = computeInsetPoints(computePiecePoints(tile, layout, layout.pitch), gap * HALF);
        const left = Math.min(...points.map((point) => point.x));
        const top = Math.min(...points.map((point) => point.y));

        return {
            offset: { x: left, y: top - getRowTop(tile.row, layout) },
            size: {
                width: Math.max(...points.map((point) => point.x)) - left,
                height: Math.max(...points.map((point) => point.y)) - top,
            },
            points: points.map((point) => ({ x: point.x - left, y: point.y - top })),
            isFlipped: false,
        };
    };

    /**
     * What a key pressed on the board does.
     *
     * Enter and Space activate the tile holding the tab stop. Ctrl or Cmd with Home or End jumps to the first or
     * last tile of the board; everything else is {@link computeNextTile}.
     *
     * @param key The `key` of the keyboard event.
     * @param isModified Whether Ctrl or Cmd was held.
     * @param from The tile holding the tab stop.
     * @param layout The board's layout.
     * @returns What to do, or `undefined` when the key means nothing here. Every action has its default prevented.
     */
    export const computeKeyAction = (
        key: string,
        isModified: boolean,
        from: Index2d,
        layout: TileBoardLayout,
    ): TileBoardKeyAction | undefined => {
        if (NavigatorUtils.getIsActivationKey(key)) return { kind: "activate" };

        if (isModified && EDGE_KEYS.includes(key)) {
            return { kind: "move", tile: key === "Home" ? getFirstTile() : getLastTile(layout) };
        }

        const next = computeNextTile(key, from, layout);

        return next === undefined ? undefined : { kind: "move", tile: next };
    };

    /**
     * Sweeping a press across a board's tiles.
     *
     * A sweep starts only when a press moves onto a second tile: the tile it began on is reported then, and every
     * tile entered after it, each once per press. A press that never leaves its tile is left to be a click, and the
     * click the browser fires at the end of a sweep is swallowed. The tile under the pointer is found by
     * `elementFromPoint` among the hit layers registered here rather than by listening on the tiles, because a touch
     * is captured by the layer it began on and the others never hear it arrive; that also works through a taper's
     * transform. Only the pointer that started the press is followed, and a move with no buttons held ends the
     * sweep, which covers a mouse released outside the window. Refused tiles are passed over.
     *
     * @param defs Whether sweeping is on, whether a tile is refused, and what to do with each tile swept, all read
     * at the moment a sweep needs them.
     * @returns `addHitLayer` to register a tile's hit layer, returning its removal; `press` for the root's
     * `pointerdown`; `swallowClick` for a `click` listener the root takes in the capture phase; and `stop`, which
     * abandons any sweep in flight and takes its document listeners away.
     */
    export const createSweeper = (defs: TileBoardSweepDefs) => {
        const hitTiles = new Map<Element, Index2d>();

        let sweep: { pointerId: number; from: Index2d; entered: Set<string>; hasLeft: boolean } | undefined;
        let isClickSwallowed = false;

        const sweepInto = (tile: Index2d) => {
            if (defs.getIsTileDisabled(tile)) return;

            defs.onSweep(tile);
        };

        const handleMove = (e: PointerEvent) => {
            if (!sweep || e.pointerId !== sweep.pointerId) return;

            if (e.buttons === NO_BUTTONS) {
                stop();

                return;
            }

            const element = document.elementFromPoint(e.clientX, e.clientY);
            const tile = element ? hitTiles.get(element) : undefined;

            if (!tile) return;

            const key = Index2d.toString(tile);

            if (sweep.entered.has(key)) return;

            sweep.entered.add(key);

            if (!sweep.hasLeft) {
                sweep.hasLeft = true;
                sweepInto(sweep.from);
            }

            sweepInto(tile);
        };

        const handleEnd = (e: PointerEvent) => {
            if (!sweep || e.pointerId !== sweep.pointerId) return;

            isClickSwallowed = sweep.hasLeft;

            stop();
        };

        const stop = () => {
            sweep = undefined;

            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerup", handleEnd);
            document.removeEventListener("pointercancel", handleEnd);
        };

        return {
            addHitLayer: (element: Element, tile: Index2d) => {
                hitTiles.set(element, tile);

                return () => {
                    if (hitTiles.get(element) === tile) hitTiles.delete(element);
                };
            },
            press: (e: PointerEvent) => {
                isClickSwallowed = false;

                if (sweep || e.button !== PRIMARY_BUTTON || !defs.getIsSweepable()) return;

                const from = hitTiles.get(e.target as Element);

                if (!from) return;

                sweep = { pointerId: e.pointerId, from, entered: new Set([Index2d.toString(from)]), hasLeft: false };

                document.addEventListener("pointermove", handleMove);
                document.addEventListener("pointerup", handleEnd);
                document.addEventListener("pointercancel", handleEnd);
            },
            swallowClick: (e: MouseEvent) => {
                if (!isClickSwallowed) return;

                isClickSwallowed = false;

                e.preventDefault();
                e.stopPropagation();
            },
            stop,
        };
    };
}
