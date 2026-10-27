import { describe, expect, it } from "vitest";

import { ImagePixelsUtils } from "./ImagePixels.utils";

const CENTER = "50% 50%";

const pixels = (width: number, height: number, paint: (x: number, y: number) => number[]) => {
    const data: number[] = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) data.push(...paint(x, y));
    }

    return { width, height, data };
};

describe("parseObjectPosition", () => {
    it("reads percentages and pixel distances", () => {
        expect(ImagePixelsUtils.parseObjectPosition("25% 75%")).toEqual([
            { value: 25, isPercent: true },
            { value: 75, isPercent: true },
        ]);
        expect(ImagePixelsUtils.parseObjectPosition("10px 20px")).toEqual([
            { value: 10, isPercent: false },
            { value: 20, isPercent: false },
        ]);
    });

    it("answers the center for a value it cannot read", () => {
        expect(ImagePixelsUtils.parseObjectPosition("")).toEqual([
            { value: 50, isPercent: true },
            { value: 50, isPercent: true },
        ]);
        expect(ImagePixelsUtils.parseObjectPosition("left")).toEqual([
            { value: 50, isPercent: true },
            { value: 50, isPercent: true },
        ]);
    });
});

describe("computeFit", () => {
    const picture = { width: 200, height: 100 };
    const box = { width: 100, height: 100 };

    it("stretches the whole picture over the box for fill", () => {
        expect(ImagePixelsUtils.computeFit(picture, box, "fill", CENTER)).toEqual({
            source: { x: 0, y: 0, width: 200, height: 100 },
            dest: { x: 0, y: 0, width: 100, height: 100 },
        });
    });

    it("fits the whole picture inside the box, centered, for contain", () => {
        expect(ImagePixelsUtils.computeFit(picture, box, "contain", CENTER)).toEqual({
            source: { x: 0, y: 0, width: 200, height: 100 },
            dest: { x: 0, y: 25, width: 100, height: 50 },
        });
    });

    it("crops the picture to fill the box for cover, taking the middle", () => {
        expect(ImagePixelsUtils.computeFit(picture, box, "cover", CENTER)).toEqual({
            source: { x: 50, y: 0, width: 100, height: 100 },
            dest: { x: 0, y: 0, width: 100, height: 100 },
        });
    });

    it("takes the edge the position names for cover", () => {
        expect(ImagePixelsUtils.computeFit(picture, box, "cover", "0% 50%")?.source.x).toBe(0);
        expect(ImagePixelsUtils.computeFit(picture, box, "cover", "100% 50%")?.source.x).toBe(100);
    });

    it("keeps the picture's own size for none, cropped by the box", () => {
        expect(ImagePixelsUtils.computeFit(picture, box, "none", CENTER)).toEqual({
            source: { x: 50, y: 0, width: 100, height: 100 },
            dest: { x: 0, y: 0, width: 100, height: 100 },
        });
    });

    it("keeps a picture smaller than the box at its own size for scale-down, and shrinks a larger one", () => {
        expect(ImagePixelsUtils.computeFit({ width: 40, height: 40 }, box, "scale-down", CENTER)?.dest).toEqual({
            x: 30,
            y: 30,
            width: 40,
            height: 40,
        });
        expect(ImagePixelsUtils.computeFit(picture, box, "scale-down", CENTER)?.dest).toEqual({
            x: 0,
            y: 25,
            width: 100,
            height: 50,
        });
    });

    it("places a picture a distance from the edge when the position is in pixels", () => {
        expect(ImagePixelsUtils.computeFit({ width: 40, height: 40 }, box, "none", "10px 20px")?.dest).toEqual({
            x: 10,
            y: 20,
            width: 40,
            height: 40,
        });
    });

    it("answers nothing when a size has no extent or none of the picture shows", () => {
        expect(ImagePixelsUtils.computeFit({ width: 0, height: 10 }, box, "fill", CENTER)).toBeUndefined();
        expect(ImagePixelsUtils.computeFit(picture, { width: 0, height: 10 }, "fill", CENTER)).toBeUndefined();
        expect(ImagePixelsUtils.computeFit({ width: 40, height: 40 }, box, "none", "500px 0px")).toBeUndefined();
    });

    it("treats a fit it does not know as fill", () => {
        expect(ImagePixelsUtils.computeFit(picture, box, "stretchy", CENTER)).toEqual(
            ImagePixelsUtils.computeFit(picture, box, "fill", CENTER),
        );
    });
});

describe("computeGridCount", () => {
    it("gives the longest side 96 cells and keeps the cells square", () => {
        expect(ImagePixelsUtils.computeGridCount({ width: 480, height: 240 })).toEqual({ col: 96, row: 48 });
        expect(ImagePixelsUtils.computeGridCount({ width: 100, height: 100 })).toEqual({ col: 96, row: 96 });
    });

    it("never has none, whatever the box", () => {
        expect(ImagePixelsUtils.computeGridCount({ width: 0, height: 0 })).toEqual({ col: 1, row: 1 });
        expect(ImagePixelsUtils.computeGridCount({ width: 1000, height: 1 })).toEqual({ col: 96, row: 1 });
    });
});

describe("computeCellAverages", () => {
    it("averages each cell's pixels", () => {
        const grid = ImagePixelsUtils.computeCellAverages(
            pixels(4, 2, (x) => (x < 2 ? [200, 0, 0, 255] : [0, 100, 0, 255])),
            { col: 2, row: 1 },
        );

        expect(grid.cells).toEqual([
            { red: 200, green: 0, blue: 0, alpha: 1 },
            { red: 0, green: 100, blue: 0, alpha: 1 },
        ]);
    });

    it("counts a pixel by its opacity, so a mostly transparent cell keeps the color of what is painted", () => {
        const grid = ImagePixelsUtils.computeCellAverages(
            pixels(2, 2, (x, y) => (x === 0 && y === 0 ? [255, 0, 0, 255] : [0, 0, 255, 0])),
            { col: 1, row: 1 },
        );

        expect(grid.cells[0]).toEqual({ red: 255, green: 0, blue: 0, alpha: 0.25 });
    });

    it("answers black with no opacity for a cell nothing paints", () => {
        const grid = ImagePixelsUtils.computeCellAverages(
            pixels(2, 2, () => [9, 9, 9, 0]),
            { col: 1, row: 1 },
        );

        expect(grid.cells[0]).toEqual({ red: 0, green: 0, blue: 0, alpha: 0 });
    });

    it("gives every cell at least one pixel when there are more cells than pixels", () => {
        const grid = ImagePixelsUtils.computeCellAverages(
            pixels(1, 1, () => [10, 20, 30, 255]),
            { col: 3, row: 3 },
        );

        expect(grid.cells).toHaveLength(9);
    });
});

describe("computeColorAt", () => {
    const grid = ImagePixelsUtils.computeCellAverages(
        pixels(4, 2, (x) => (x < 2 ? [200, 10, 20, 255] : [0, 0, 0, 0])),
        { col: 2, row: 1 },
    );

    it("answers the color of the cell the point is in", () => {
        expect(ImagePixelsUtils.computeColorAt(grid, { x: 0.25, y: 0.5 })).toBe("rgb(200, 10, 20)");
    });

    it("answers nothing where the cell is transparent", () => {
        expect(ImagePixelsUtils.computeColorAt(grid, { x: 0.75, y: 0.5 })).toBeUndefined();
    });

    it("holds a point on the far edge in the last cell rather than past it", () => {
        expect(ImagePixelsUtils.computeColorAt(grid, { x: 1, y: 1 })).toBeUndefined();
        expect(ImagePixelsUtils.computeColorAt(grid, { x: 0, y: 0 })).toBe("rgb(200, 10, 20)");
    });

    it("counts a partly transparent cell as painted once it passes the threshold", () => {
        const faint = ImagePixelsUtils.computeCellAverages(
            pixels(2, 2, (x, y) => (x === 0 && y === 0 ? [255, 0, 0, 255] : [0, 0, 0, 0])),
            { col: 1, row: 1 },
        );

        expect(ImagePixelsUtils.computeColorAt(faint, { x: 0.5, y: 0.5 })).toBeUndefined();
        expect(ImagePixelsUtils.computeColorAt(faint, { x: 0.5, y: 0.5 }, 0.2)).toBe("rgb(255, 0, 0)");
    });
});
