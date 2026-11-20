import { describe, expect, it } from "vitest";

import { SVGDefsUtils } from "./SVGDefs.utils";
import { SVGPatternLayouts } from "./SVGPatternLayouts.const";
import type { SVGPatternKind } from "./SVGPatternLayouts.types";

const CELL = { width: 30, height: 30 };

const positions = (kind: SVGPatternKind, rows: number, cols: number) => {
    const layout = SVGPatternLayouts.ALL[kind];
    const cellCount = layout.computeCellCount({ rowCount: rows, colCount: cols });

    return Array.from({ length: cellCount.rowCount }, (_unused, row) =>
        Array.from({ length: cellCount.colCount }, (_unusedCol, col) => layout.computeCellPos({ row, col }, CELL)),
    );
};

describe("SVGPatternLayouts.ALL", () => {
    it("lays a grid out in whole cells with nothing offset", () => {
        expect(positions("grid", 2, 2)).toEqual([
            [
                { x: 0, y: 0 },
                { x: 30, y: 0 },
            ],
            [
                { x: 0, y: 30 },
                { x: 30, y: 30 },
            ],
        ]);
    });

    it("overlaps pointy-top hexagon rows by a quarter of a cell, which is what makes them interlock", () => {
        const rows = positions("hex_pointy_top", 3, 3).map((row) => row[0].y);

        expect(rows, "three quarters of a cell apart, starting half a cell above the tile").toEqual([-15, 7.5, 30]);
    });

    it("shifts every other hexagon row by half a cell", () => {
        const [first, second] = positions("hex_pointy_top", 3, 3);

        expect(first[0].x, "row 0 is even, so it starts half a cell to the left").toBe(-15);
        expect(second[0].x, "and row 1 does not").toBe(0);
    });

    it("turns flat-top hexagons through the other axis", () => {
        const cols = positions("hex_flat_top", 3, 3)[0].map((cell) => cell.x);

        expect(cols, "three quarters of a cell apart across, not down").toEqual([-15, 7.5, 30]);
    });

    it("steps sideways triangles down by half a cell, which is the same overlap turned", () => {
        const rows = positions("triangle_sideways", 1, 2).map((row) => row[0].y);
        const cols = positions("triangle_sideways", 1, 2)[0].map((cell) => cell.x);

        expect(rows, "half a cell apart, starting half a cell above the tile").toEqual([-15, 0, 15]);
        expect(cols, "and a whole cell apart across, where the upright one is a half").toEqual([0, 30]);
    });

    it("rounds the requested cell count the way each tiling needs", () => {
        expect(
            SVGPatternLayouts.ALL.grid.computeCellCount({ rowCount: 4, colCount: 4 }),
            "a grid takes what it is given",
        ).toEqual({ rowCount: 4, colCount: 4 });
        expect(
            SVGPatternLayouts.ALL.diagonal.computeCellCount({ rowCount: 4, colCount: 4 }),
            "a diagonal wants odd, and two rows for every cell down, since its rows are half a cell apart",
        ).toEqual({ rowCount: 9, colCount: 5 });
        expect(
            SVGPatternLayouts.ALL.half_shift.computeCellCount({ rowCount: 5, colCount: 4 }),
            "a half shift wants even rows and odd columns",
        ).toEqual({ rowCount: 6, colCount: 5 });
        expect(
            SVGPatternLayouts.ALL.half_drop.computeCellCount({ rowCount: 4, colCount: 5 }),
            "and a half drop wants the opposite",
        ).toEqual({ rowCount: 5, colCount: 6 });
        expect(
            SVGPatternLayouts.ALL.triangle.computeCellCount({ rowCount: 5, colCount: 4 }),
            "a triangle wants even rows and odd columns, two for every cell across",
        ).toEqual({ rowCount: 6, colCount: 9 });
        expect(
            SVGPatternLayouts.ALL.triangle_sideways.computeCellCount({ rowCount: 4, colCount: 5 }),
            "and a sideways triangle wants the opposite",
        ).toEqual({ rowCount: 9, colCount: 6 });
    });

    it.each(["grid", "diagonal", "half_shift", "half_drop", "triangle", "triangle_sideways"] as const)(
        "gives %s a tile as many cells across and down as were asked for, so square cells repeat squarely",
        (kind) => {
            const layout = SVGPatternLayouts.ALL[kind];
            const tile = layout.computePatternSize(layout.computeCellCount({ rowCount: 4, colCount: 6 }), CELL);

            expect(tile).toEqual({ width: CELL.width * 6, height: CELL.height * 4 });
        },
    );

    it("sizes the tile so that the repeat lands on the seam", () => {
        expect(SVGPatternLayouts.ALL.grid.computePatternSize({ rowCount: 2, colCount: 3 }, CELL)).toEqual({
            width: 90,
            height: 60,
        });
        expect(
            SVGPatternLayouts.ALL.hex_pointy_top.computePatternSize({ rowCount: 3, colCount: 3 }, CELL),
            "a hexagon tile is two cells across and one and a half down",
        ).toEqual({ width: 60, height: 45 });
        expect(
            SVGPatternLayouts.ALL.triangle.computePatternSize({ rowCount: 2, colCount: 5 }, CELL),
            "a triangle tile is half a cell per column",
        ).toEqual({ width: 60, height: 60 });
        expect(
            SVGPatternLayouts.ALL.triangle_sideways.computePatternSize({ rowCount: 5, colCount: 2 }, CELL),
            "and a sideways one is half a cell per row",
        ).toEqual({ width: 60, height: 60 });
    });

    it("marks the cells that straddle the seam, because they are the ones drawn twice", () => {
        const layout = SVGPatternLayouts.ALL.hex_pointy_top;
        const cellCount = { rowCount: 3, colCount: 3 };

        expect(layout.computeIsSplit({ row: 0, col: 1 }, cellCount), "the first row is cut by the top edge").toBe(true);
        expect(layout.computeIsSplit({ row: 1, col: 1 }, cellCount), "the middle of the tile is whole").toBe(false);
        expect(layout.computeIsSplit({ row: 1, col: 0 }, cellCount), "an odd row's first column is whole").toBe(false);
        expect(layout.computeIsSplit({ row: 2, col: 0 }, cellCount), "the last row is cut by the bottom edge").toBe(
            true,
        );
    });

    it("never marks a grid cell as split, because a grid has no half cells", () => {
        expect(SVGPatternLayouts.ALL.grid.computeIsSplit({ row: 0, col: 0 }, { rowCount: 3, colCount: 3 })).toBe(false);
    });
});

describe("the layouts that cut each cell into triangles", () => {
    const CUT: SVGPatternKind[] = ["triangle_ltr", "triangle_rtl", "square_quarters", "lozenge_quarters"];

    const areaOf = (points: { x: number; y: number }[]) =>
        Math.abs(
            points.reduce((sum, point, index) => {
                const next = points[(index + 1) % points.length];

                return sum + point.x * next.y - next.x * point.y;
            }, 0) * 0.5,
        );

    it("asks for one cell index per triangle, so a cell of halves is two across and a quartered one four", () => {
        expect(SVGPatternLayouts.ALL.triangle_ltr.computeCellCount({ rowCount: 3, colCount: 3 })).toEqual({
            rowCount: 3,
            colCount: 6,
        });
        expect(SVGPatternLayouts.ALL.triangle_rtl.computeCellCount({ rowCount: 3, colCount: 3 })).toEqual({
            rowCount: 3,
            colCount: 6,
        });
        expect(SVGPatternLayouts.ALL.square_quarters.computeCellCount({ rowCount: 3, colCount: 3 })).toEqual({
            rowCount: 3,
            colCount: 12,
        });
        expect(
            SVGPatternLayouts.ALL.lozenge_quarters.computeCellCount({ rowCount: 3, colCount: 3 }),
            "and a checkerboard of cuts wants an even count both ways, or the tile would not repeat",
        ).toEqual({ rowCount: 4, colCount: 8 });
    });

    it("puts every triangle of one cell in that cell's box, and the tile is whole cells", () => {
        expect(positions("square_quarters", 1, 2)[0].map((cell) => cell.x)).toEqual([0, 0, 0, 0, 30, 30, 30, 30]);
        expect(SVGPatternLayouts.ALL.square_quarters.computePatternSize({ rowCount: 1, colCount: 8 }, CELL)).toEqual({
            width: 60,
            height: 30,
        });
    });

    it("fills each cell exactly with its triangles", () => {
        for (const kind of CUT) {
            const layout = SVGPatternLayouts.ALL[kind];
            const count = layout.computeCellCount({ rowCount: 2, colCount: 2 });
            let covered = 0;

            for (let row = 0; row < count.rowCount; row++) {
                for (let col = 0; col < count.colCount; col++) {
                    covered += areaOf(
                        SVGDefsUtils.computeCellPiecePoints(SVGDefsUtils.getCellPiece(kind, { row, col }), CELL),
                    );
                }
            }

            const size = layout.computePatternSize(count, CELL);

            expect(covered, kind).toBeCloseTo(size.width * size.height);
        }
    });

    it("cuts the halves from the top left down for ltr, and from the top right down for rtl", () => {
        expect(SVGDefsUtils.getCellPiece("triangle_ltr", { row: 0, col: 0 }).shape).toBe("triangle_bottom_left");
        expect(SVGDefsUtils.getCellPiece("triangle_rtl", { row: 0, col: 0 }).shape).toBe("triangle_top_left");
    });

    it("turns the cut every other cell for lozenges, and keeps it for the halves", () => {
        const shapeAt = (kind: SVGPatternKind, row: number, col: number) =>
            SVGDefsUtils.getCellPiece(kind, { row, col }).shape;

        expect(shapeAt("lozenge_quarters", 0, 0)).not.toBe(shapeAt("lozenge_quarters", 0, 2));
        expect(shapeAt("lozenge_quarters", 0, 0)).toBe(shapeAt("lozenge_quarters", 1, 2));
        expect(shapeAt("triangle_ltr", 0, 0)).toBe(shapeAt("triangle_ltr", 1, 2));
    });

    it("measures each triangle from its own middle, so two halves of a cell answer the pointer apart", () => {
        const first = SVGDefsUtils.computeCellCenter("triangle_ltr", { row: 0, col: 0 }, CELL);
        const second = SVGDefsUtils.computeCellCenter("triangle_ltr", { row: 0, col: 1 }, CELL);

        expect(first).not.toEqual(second);
        expect(SVGDefsUtils.computeCellCenter("grid", { row: 0, col: 0 }, CELL)).toEqual({ x: 15, y: 15 });
    });
});
