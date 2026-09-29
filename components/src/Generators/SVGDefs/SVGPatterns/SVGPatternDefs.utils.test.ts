import { describe, expect, it } from "vitest";

import { SVGPatternDefsUtils } from "./SVGPatternDefs.utils";

describe("SVGPatternDefsUtils.computeCells", () => {
    it("places every cell of the tile column by column, each named from the pattern and its place", () => {
        const cells = SVGPatternDefsUtils.computeCells("p", { rows: 2, cols: 2 }, ({ row, col }) => ({
            x: col * 10,
            y: row * 20,
        }));

        expect(cells.map((cell) => cell.id)).toEqual(["p_X0_Y0", "p_X0_Y1", "p_X1_Y0", "p_X1_Y1"]);
        expect(cells[3]).toEqual({ id: "p_X1_Y1", index: { row: 1, col: 1 }, transform: "translate(10,20)" });
    });
});
