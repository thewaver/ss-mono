import { describe, expect, it } from "vitest";

import { type Count2d, ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { TileBoardUtils } from "./TileBoard.utils";

const COUNT: Count2d = { row: 5, col: 4 };
const TILE: Size2d = { width: 80, height: 60 };

const layoutOf = (shape: ShapeConst.DefaultShape, hasShortFirstRow = false) =>
    TileBoardUtils.getLayout(shape, COUNT, TILE, hasShortFirstRow);

const HEXAGON = layoutOf("hexagon-pointy-top");
const FLAT_HEXAGON = layoutOf("hexagon-flat-top");
const LOZENGE = layoutOf("lozenge");
const SQUARE = layoutOf("square");
const TRIANGLE = layoutOf("triangle-up");

describe("getTiling", () => {
    it("spaces pointy-top hexagons a whole tile across and three quarters of one down", () => {
        expect(HEXAGON.pitch).toEqual({ width: 80, height: 45 });
        expect(HEXAGON.hasOffsetRows).toBe(true);
        expect(HEXAGON.hasFlippedTiles).toBe(false);
    });

    it("turns a flat-top hexagon's spacing through the other axis", () => {
        expect(FLAT_HEXAGON.pitch).toEqual({ width: 120, height: 30 });
        expect(FLAT_HEXAGON.hasOffsetRows).toBe(true);
    });

    it("packs lozenges twice as tightly down as squares, which do not interlock at all", () => {
        expect(LOZENGE.pitch).toEqual({ width: 80, height: 30 });
        expect(SQUARE.pitch).toEqual({ width: 80, height: 60 });
        expect(SQUARE.hasOffsetRows).toBe(false);
    });

    it("overlaps triangles by half a tile across and turns every other one over", () => {
        expect(TRIANGLE.pitch).toEqual({ width: 40, height: 60 });
        expect(TRIANGLE.hasOffsetRows).toBe(false);
        expect(TRIANGLE.hasFlippedTiles).toBe(true);
    });
});

describe("the tiling table against the shapes it was written for", () => {
    /**
     * The pitches above are the shapes' own corner fractions, so a shape redrawn in `ss-utils` would leave
     * them stale and the board would tile with gaps. These read the corners back out and go red first.
     */
    it("puts a pointy-top hexagon's shoulders a quarter of the way down", () => {
        const points = ShapeConst.getDefaultShapePoints("hexagon-pointy-top", TILE);
        const shoulder = Math.min(...points.filter((point) => point.x === 0).map((point) => point.y));

        expect(TILE.height - shoulder).toBe(HEXAGON.pitch.height);
    });

    it("puts a lozenge's widest point halfway down", () => {
        const points = ShapeConst.getDefaultShapePoints("lozenge", TILE);
        const shoulder = Math.min(...points.filter((point) => point.x === 0).map((point) => point.y));

        expect(TILE.height - shoulder).toBe(LOZENGE.pitch.height);
    });

    it("starts a flat-top hexagon's top edge a quarter of the way across", () => {
        const points = ShapeConst.getDefaultShapePoints("hexagon-flat-top", TILE);
        const shoulder = Math.min(...points.filter((point) => point.y === 0).map((point) => point.x));

        expect((TILE.width - shoulder) * 2).toBe(FLAT_HEXAGON.pitch.width);
        expect(TILE.height * 0.5).toBe(FLAT_HEXAGON.pitch.height);
    });

    it("puts a triangle's apex halfway across, which is the half-tile overlap", () => {
        const points = ShapeConst.getDefaultShapePoints("triangle-up", TILE);
        const apex = points.find((point) => point.y === 0)!;

        expect(apex.x).toBe(TRIANGLE.pitch.width);
    });
});

describe("getTilePoints", () => {
    it("turns a triangle over rather than drawing a second shape for it", () => {
        const flipped = TileBoardUtils.getTilePoints("triangle-up", TILE, true);

        expect(flipped).toEqual(ShapeConst.getDefaultShapePoints("triangle-down", TILE));
    });

    it("leaves a shape alone when nothing is turned over", () => {
        expect(TileBoardUtils.getTilePoints("triangle-up", TILE, false)).toEqual(
            ShapeConst.getDefaultShapePoints("triangle-up", TILE),
        );
    });
});

describe("getIsFlippedTile", () => {
    it("turns over every other tile along a row and inverts that on the next row, so bases meet bases", () => {
        expect(TileBoardUtils.getIsFlippedTile({ row: 0, col: 0 }, TRIANGLE)).toBe(false);
        expect(TileBoardUtils.getIsFlippedTile({ row: 0, col: 1 }, TRIANGLE)).toBe(true);
        expect(TileBoardUtils.getIsFlippedTile({ row: 1, col: 0 }, TRIANGLE)).toBe(true);
        expect(TileBoardUtils.getIsFlippedTile({ row: 1, col: 1 }, TRIANGLE)).toBe(false);
    });

    it("turns nothing over for a shape that tiles by translation alone", () => {
        expect(TileBoardUtils.getIsFlippedTile({ row: 0, col: 1 }, HEXAGON)).toBe(false);
    });
});

describe("getRowLength", () => {
    it("gives every other row one tile fewer, so the two kinds of row interlock", () => {
        expect(TileBoardUtils.getRowLength(0, HEXAGON)).toBe(4);
        expect(TileBoardUtils.getRowLength(1, HEXAGON)).toBe(3);
        expect(TileBoardUtils.getRowLength(2, HEXAGON)).toBe(4);
    });

    it("starts on the short row when it is asked to", () => {
        const layout = layoutOf("hexagon-pointy-top", true);

        expect(TileBoardUtils.getRowLength(0, layout)).toBe(3);
        expect(TileBoardUtils.getRowLength(1, layout)).toBe(4);
    });

    it("keeps every row the same length for a shape whose rows are not offset", () => {
        expect(TileBoardUtils.getRowLength(0, SQUARE)).toBe(4);
        expect(TileBoardUtils.getRowLength(1, SQUARE)).toBe(4);
        expect(TileBoardUtils.getRowLength(1, TRIANGLE)).toBe(4);
    });

    it("never reports a negative length for a board one tile wide", () => {
        const layout = TileBoardUtils.getLayout("hexagon-pointy-top", { row: 2, col: 1 }, TILE, false);

        expect(TileBoardUtils.getRowLength(1, layout)).toBe(0);
    });
});

describe("getRowOffset", () => {
    it("pushes the short rows half a pitch across, which is what puts them in the notches", () => {
        expect(TileBoardUtils.getRowOffset(0, HEXAGON)).toBe(0);
        expect(TileBoardUtils.getRowOffset(1, HEXAGON)).toBe(40);
        expect(TileBoardUtils.getRowOffset(1, FLAT_HEXAGON)).toBe(60);
    });

    it("pushes nothing across when the rows are not offset", () => {
        expect(TileBoardUtils.getRowOffset(1, SQUARE)).toBe(0);
        expect(TileBoardUtils.getRowOffset(1, TRIANGLE)).toBe(0);
    });
});

describe("getTileCenter", () => {
    it("puts a tile's middle half a tile past where the tile starts", () => {
        expect(TileBoardUtils.getTileCenter({ row: 0, col: 0 }, HEXAGON)).toEqual({ x: 40, y: 30 });
        expect(TileBoardUtils.getTileCenter({ row: 0, col: 2 }, HEXAGON)).toEqual({ x: 200, y: 30 });
    });

    it("carries the short row's half-tile shift, so a piece sits in the notch rather than beside it", () => {
        expect(TileBoardUtils.getTileCenter({ row: 1, col: 0 }, HEXAGON)).toEqual({ x: 80, y: 75 });
    });

    it("steps by the pitch rather than the tile, which is what separates the shapes", () => {
        expect(TileBoardUtils.getTileCenter({ row: 0, col: 1 }, FLAT_HEXAGON)).toEqual({ x: 160, y: 30 });
        expect(TileBoardUtils.getTileCenter({ row: 0, col: 1 }, TRIANGLE)).toEqual({ x: 80, y: 30 });
    });

    it("is the middle of the tile's box, which a gap does not move", () => {
        const gapped = TileBoardUtils.getLayout("hexagon-pointy-top", COUNT, TILE, false);

        expect(TileBoardUtils.getTileCenter({ row: 2, col: 3 }, gapped)).toEqual({ x: 280, y: 120 });
    });
});

describe("getBoardSize", () => {
    it("is one tile past the last pitch on each axis", () => {
        expect(TileBoardUtils.getBoardSize(HEXAGON)).toEqual({ width: 320, height: 240 });
        expect(TileBoardUtils.getBoardSize(SQUARE)).toEqual({ width: 320, height: 300 });
        expect(TileBoardUtils.getBoardSize(TRIANGLE)).toEqual({ width: 200, height: 300 });
    });

    it("is one tile in each direction for a board of one, where nothing overlaps anything", () => {
        const layout = TileBoardUtils.getLayout("hexagon-pointy-top", { row: 1, col: 1 }, TILE, false);

        expect(TileBoardUtils.getBoardSize(layout)).toEqual({ width: 80, height: 60 });
    });

    it("takes no room at all when there is nothing to lay out", () => {
        const layout = TileBoardUtils.getLayout("hexagon-pointy-top", { row: 0, col: 4 }, TILE, false);

        expect(TileBoardUtils.getBoardSize(layout)).toEqual({ width: 0, height: 0 });
    });
});

describe("getIsOnBoard", () => {
    it("knows the last column of a full row is off the end of a short one", () => {
        expect(TileBoardUtils.getIsOnBoard({ row: 0, col: 3 }, HEXAGON)).toBe(true);
        expect(TileBoardUtils.getIsOnBoard({ row: 1, col: 3 }, HEXAGON)).toBe(false);
    });

    it("rejects anything past an edge", () => {
        expect(TileBoardUtils.getIsOnBoard({ row: -1, col: 0 }, HEXAGON)).toBe(false);
        expect(TileBoardUtils.getIsOnBoard({ row: 5, col: 0 }, HEXAGON)).toBe(false);
        expect(TileBoardUtils.getIsOnBoard({ row: 0, col: -1 }, HEXAGON)).toBe(false);
    });
});

describe("getNeighbourTiles", () => {
    it("gives an interlocking tile its six touching tiles, clockwise from the top left", () => {
        expect(TileBoardUtils.getNeighbourTiles({ row: 2, col: 2 }, HEXAGON)).toEqual([
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },
            { row: 3, col: 1 },
            { row: 2, col: 1 },
        ]);
    });

    it("shifts the diagonals the other way for a tile in a short row, because the rows are offset", () => {
        expect(TileBoardUtils.getNeighbourTiles({ row: 1, col: 1 }, HEXAGON)).toEqual([
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
            { row: 2, col: 1 },
            { row: 1, col: 0 },
        ]);
    });

    it("gives a square its four, because a square shares an edge with nothing diagonal", () => {
        expect(TileBoardUtils.getNeighbourTiles({ row: 2, col: 2 }, SQUARE)).toEqual([
            { row: 1, col: 2 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },
            { row: 2, col: 1 },
        ]);
    });

    it("gives a triangle its three, and the vertical one depends on which way it points", () => {
        expect(TileBoardUtils.getNeighbourTiles({ row: 2, col: 2 }, TRIANGLE)).toEqual([
            { row: 2, col: 3 },
            { row: 3, col: 2 },
            { row: 2, col: 1 },
        ]);

        expect(TileBoardUtils.getNeighbourTiles({ row: 2, col: 1 }, TRIANGLE)).toEqual([
            { row: 1, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 0 },
        ]);
    });

    it("drops the ones that fall off the board", () => {
        expect(TileBoardUtils.getNeighbourTiles({ row: 0, col: 0 }, HEXAGON)).toEqual([
            { row: 0, col: 1 },
            { row: 1, col: 0 },
        ]);
    });
});

describe("getLastTile", () => {
    it("lands on the end of the last row, whichever kind of row that is", () => {
        expect(TileBoardUtils.getLastTile(HEXAGON)).toEqual({ row: 4, col: 3 });
        expect(TileBoardUtils.getLastTile(layoutOf("hexagon-pointy-top", true))).toEqual({ row: 4, col: 2 });
    });
});

describe("clampTile", () => {
    it("pulls a column back into a row that is one tile shorter", () => {
        expect(TileBoardUtils.clampTile({ row: 1, col: 3 }, HEXAGON)).toEqual({ row: 1, col: 2 });
        expect(TileBoardUtils.clampTile({ row: 2, col: 3 }, HEXAGON)).toEqual({ row: 2, col: 3 });
    });

    it("pulls a row back onto the board", () => {
        expect(TileBoardUtils.clampTile({ row: -1, col: 1 }, HEXAGON)).toEqual({ row: 0, col: 1 });
        expect(TileBoardUtils.clampTile({ row: 9, col: 1 }, HEXAGON)).toEqual({ row: 4, col: 1 });
    });
});

describe("computeNextTile", () => {
    it("walks along a row with the sideways arrows", () => {
        expect(TileBoardUtils.computeNextTile("ArrowRight", { row: 0, col: 1 }, HEXAGON)).toEqual({ row: 0, col: 2 });
        expect(TileBoardUtils.computeNextTile("ArrowLeft", { row: 0, col: 1 }, HEXAGON)).toEqual({ row: 0, col: 0 });
    });

    it("stops at the ends of a row instead of carrying into the next one", () => {
        expect(TileBoardUtils.computeNextTile("ArrowRight", { row: 0, col: 3 }, HEXAGON)).toEqual({ row: 0, col: 3 });
        expect(TileBoardUtils.computeNextTile("ArrowLeft", { row: 0, col: 0 }, HEXAGON)).toEqual({ row: 0, col: 0 });
    });

    it("keeps the column when it steps between rows, so the walk zigzags with the tiles", () => {
        expect(TileBoardUtils.computeNextTile("ArrowDown", { row: 0, col: 2 }, HEXAGON)).toEqual({ row: 1, col: 2 });
        expect(TileBoardUtils.computeNextTile("ArrowUp", { row: 1, col: 2 }, HEXAGON)).toEqual({ row: 0, col: 2 });
    });

    it("slides one across when the row it steps into is the shorter kind", () => {
        expect(TileBoardUtils.computeNextTile("ArrowDown", { row: 0, col: 3 }, HEXAGON)).toEqual({ row: 1, col: 2 });
    });

    it("stops at the top and bottom edges", () => {
        expect(TileBoardUtils.computeNextTile("ArrowUp", { row: 0, col: 1 }, HEXAGON)).toEqual({ row: 0, col: 1 });
        expect(TileBoardUtils.computeNextTile("ArrowDown", { row: 4, col: 1 }, HEXAGON)).toEqual({ row: 4, col: 1 });
    });

    it("jumps to either end of the row it is on, not of the board", () => {
        expect(TileBoardUtils.computeNextTile("Home", { row: 1, col: 1 }, HEXAGON)).toEqual({ row: 1, col: 0 });
        expect(TileBoardUtils.computeNextTile("End", { row: 1, col: 1 }, HEXAGON)).toEqual({ row: 1, col: 2 });
    });

    it("leaves the edge keys alone when the consumer has taken them over", () => {
        const opts = { hasEdgeKeys: false };

        expect(TileBoardUtils.computeNextTile("Home", { row: 1, col: 1 }, HEXAGON, opts)).toBeUndefined();
        expect(TileBoardUtils.computeNextTile("ArrowLeft", { row: 1, col: 1 }, HEXAGON, opts)).toEqual({
            row: 1,
            col: 0,
        });
    });

    it("answers nothing for a key it does not handle, so the consumer can let the event through", () => {
        expect(TileBoardUtils.computeNextTile("Enter", { row: 0, col: 0 }, HEXAGON)).toBeUndefined();
        expect(TileBoardUtils.computeNextTile("a", { row: 0, col: 0 }, HEXAGON)).toBeUndefined();
    });

    it("answers nothing for an empty board rather than an index nothing can hold", () => {
        const layout = TileBoardUtils.getLayout("hexagon-pointy-top", { row: 0, col: 0 }, TILE, false);

        expect(TileBoardUtils.computeNextTile("ArrowRight", { row: 0, col: 0 }, layout)).toBeUndefined();
    });
});
