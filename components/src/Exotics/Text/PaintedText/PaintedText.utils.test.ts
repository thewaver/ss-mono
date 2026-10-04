import { describe, expect, it } from "vitest";

import { PaintedTextUtils } from "./PaintedText.utils";

describe("computeStrokePaint", () => {
    it("draws a centered stroke at the width asked for, unmasked", () => {
        expect(PaintedTextUtils.computeStrokePaint("center", 3)).toEqual({ drawnWidth: 3, maskKind: undefined });
    });

    it("draws an outside or inside stroke twice as wide and masks half of it away", () => {
        expect(PaintedTextUtils.computeStrokePaint("outside", 3)).toEqual({ drawnWidth: 6, maskKind: "outside" });
        expect(PaintedTextUtils.computeStrokePaint("inside", 3)).toEqual({ drawnWidth: 6, maskKind: "inside" });
    });
});

describe("resolveFillDefs", () => {
    const fill = [{ color: "red" }];
    const stroke = [{ color: "blue" }];

    it("keeps the consumer's fill", () => {
        expect(PaintedTextUtils.resolveFillDefs(fill, stroke)).toBe(fill);
    });

    it("draws no fill when only a stroke is asked for, which leaves the letters hollow", () => {
        expect(PaintedTextUtils.resolveFillDefs(undefined, stroke)).toEqual([]);
    });

    it("falls back to the text color when there is no paint at all", () => {
        expect(PaintedTextUtils.resolveFillDefs(undefined, undefined)).toEqual([{ color: "currentColor" }]);
        expect(PaintedTextUtils.resolveFillDefs(undefined, [])).toEqual([{ color: "currentColor" }]);
        expect(PaintedTextUtils.resolveFillDefs([], [])).toEqual([{ color: "currentColor" }]);
    });
});

describe("getIsReadableLayer", () => {
    it("reads the first fill", () => {
        expect(PaintedTextUtils.getIsReadableLayer("fill", 0, 2)).toBe(true);
        expect(PaintedTextUtils.getIsReadableLayer("fill", 1, 2)).toBe(false);
        expect(PaintedTextUtils.getIsReadableLayer("stroke", 0, 2)).toBe(false);
    });

    it("reads the first stroke when there is no fill", () => {
        expect(PaintedTextUtils.getIsReadableLayer("stroke", 0, 0)).toBe(true);
        expect(PaintedTextUtils.getIsReadableLayer("stroke", 1, 0)).toBe(false);
    });
});

describe("computeCirclePath", () => {
    it("starts at the top and comes back to it, closed", () => {
        const path = PaintedTextUtils.computeCirclePath({ x: 50, y: 60 }, 40);

        expect(path.startsWith("M 50 20 ")).toBe(true);
        expect(path.endsWith(" 50 20 Z")).toBe(true);
    });

    it("runs clockwise unless asked otherwise, which is the arcs' sweep flag", () => {
        const clockwise = PaintedTextUtils.computeCirclePath({ x: 0, y: 0 }, 10);
        const counterclockwise = PaintedTextUtils.computeCirclePath({ x: 0, y: 0 }, 10, {
            direction: "counterclockwise",
        });

        expect(clockwise).toContain("0 1 1");
        expect(counterclockwise).toContain("0 1 0");
        expect(counterclockwise).not.toContain("0 1 1");
    });

    it("passes through the bottom of the circle", () => {
        expect(PaintedTextUtils.computeCirclePath({ x: 50, y: 60 }, 40)).toContain(" 50 100 ");
    });
});

describe("wrapAlongPath", () => {
    it("keeps a point that is already on the path where it is", () => {
        expect(PaintedTextUtils.wrapAlongPath(0, 100)).toBe(0);
        expect(PaintedTextUtils.wrapAlongPath(40, 100)).toBe(40);
        expect(PaintedTextUtils.wrapAlongPath(100, 100)).toBe(100);
    });

    it("brings a point past the end round from the start, as the second copy draws it", () => {
        expect(PaintedTextUtils.wrapAlongPath(130, 100)).toBe(30);
    });

    it("draws a point more than a whole path past the end nowhere", () => {
        expect(PaintedTextUtils.wrapAlongPath(230, 100)).toBeUndefined();
    });

    it("draws nothing on a path with no length", () => {
        expect(PaintedTextUtils.wrapAlongPath(0, 0)).toBeUndefined();
    });
});

describe("computeTurnedBounds", () => {
    const placement = { point: { x: 100, y: 50 }, angle: 0, advance: 20 };

    it("is the letter's own band when it is not turned", () => {
        expect(PaintedTextUtils.computeTurnedBounds(placement, 15, 5)).toEqual({ x: 90, y: 35, width: 20, height: 20 });
    });

    it("swaps its width and height when the letter stands on end", () => {
        const bounds = PaintedTextUtils.computeTurnedBounds({ ...placement, angle: 90 }, 15, 5);

        expect(bounds.width).toBeCloseTo(20);
        expect(bounds.height).toBeCloseTo(20);
        expect(bounds.x).toBeCloseTo(95);
        expect(bounds.y).toBeCloseTo(40);
    });

    it("grows when the letter is turned partway, and always holds the point it turns about", () => {
        const bounds = PaintedTextUtils.computeTurnedBounds({ ...placement, angle: 45 }, 15, 5);

        expect(bounds.width).toBeGreaterThan(20);
        expect(bounds.height).toBeGreaterThan(20);
        expect(bounds.x).toBeLessThan(placement.point.x);
        expect(bounds.x + bounds.width).toBeGreaterThan(placement.point.x);
        expect(bounds.y).toBeLessThan(placement.point.y);
        expect(bounds.y + bounds.height).toBeGreaterThan(placement.point.y);
    });
});

describe("computePathBox", () => {
    it("grows the path's box on every side by the larger of the two reaches", () => {
        expect(PaintedTextUtils.computePathBox({ x: 10, y: 20, width: 100, height: 50 }, 12, 4)).toEqual({
            x: -2,
            y: 8,
            width: 124,
            height: 74,
        });
        expect(PaintedTextUtils.computePathBox({ x: 10, y: 20, width: 100, height: 50 }, 4, 12)).toEqual({
            x: -2,
            y: 8,
            width: 124,
            height: 74,
        });
    });

    it("is the path's own box when there are no letters", () => {
        expect(PaintedTextUtils.computePathBox({ x: 10, y: 20, width: 100, height: 50 }, 0, 0)).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50,
        });
    });
});

describe("computeCaretBox", () => {
    const lineLetter = (x: number) => ({
        kind: "text" as const,
        character: "a",
        x,
        top: 10,
        width: 8,
        height: 20,
        baseline: 25,
    });
    const pathLetter = (x: number) => ({
        ...lineLetter(x),
        placement: { point: { x, y: 40 }, angle: 0, advance: 8 },
    });
    const metrics = { ascent: 12, descent: 3 };

    it("sits after the letter it follows, as tall as the line, off a path", () => {
        expect(PaintedTextUtils.computeCaretBox([lineLetter(0), lineLetter(8)], 1, 0)).toEqual({
            x: 16,
            top: 10,
            height: 20,
        });
    });

    it("sits before the first letter only for the drawer the text starts in", () => {
        expect(PaintedTextUtils.computeCaretBox([lineLetter(4)], -1, 0)).toEqual({ x: 4, top: 10, height: 20 });
        expect(PaintedTextUtils.computeCaretBox([lineLetter(4)], -1, 3)).toBeUndefined();
    });

    it("belongs to no letter of this drawer when its index falls outside them", () => {
        expect(PaintedTextUtils.computeCaretBox([lineLetter(0)], 5, 0)).toBeUndefined();
    });

    it("on a path, stands at the letter's far edge, as tall as the letters reach, turned with it", () => {
        expect(PaintedTextUtils.computeCaretBox([pathLetter(100)], 0, 0, metrics)).toEqual({
            x: 104,
            top: 28,
            height: 15,
            angle: 0,
            pivotY: 12,
        });
    });

    it("on a path, follows the letter round a turn", () => {
        const box = PaintedTextUtils.computeCaretBox(
            [{ ...pathLetter(100), placement: { point: { x: 100, y: 40 }, angle: 90, advance: 8 } }],
            0,
            0,
            metrics,
        );

        expect(box?.x).toBeCloseTo(100);
        expect(box?.top).toBeCloseTo(32);
        expect(box?.angle).toBe(90);
    });

    it("on a path, is not drawn beside a letter that fell off the path", () => {
        expect(PaintedTextUtils.computeCaretBox([lineLetter(0)], 0, 0, metrics)).toBeUndefined();
    });
});

describe("computeCaretStyle", () => {
    it("places the box against the drawing's origin", () => {
        expect(PaintedTextUtils.computeCaretStyle({ x: 30, top: 20, height: 10 }, { x: 10, y: -5 })).toEqual({
            left: "20px",
            top: "25px",
            height: "10px",
        });
    });

    it("turns a caret on a path about the point where it meets the baseline", () => {
        expect(
            PaintedTextUtils.computeCaretStyle({ x: 0, top: 0, height: 10, angle: 30, pivotY: 8 }, { x: 0, y: 0 }),
        ).toMatchObject({ "transform": "rotate(30deg)", "transform-origin": "0 8px" });
    });
});
