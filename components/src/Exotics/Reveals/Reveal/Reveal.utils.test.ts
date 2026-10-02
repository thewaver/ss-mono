import { describe, expect, it } from "vitest";

import { RevealUtils } from "./Reveal.utils";

const SIZE = { width: 400, height: 200 };

describe("buildHoleImage", () => {
    it("quotes the data, since an SVG carries characters an unquoted url refuses", () => {
        const image = RevealUtils.buildHoleImage(40, 0.5, undefined, undefined, undefined);

        expect(image.startsWith('url("data:image/svg+xml,')).toBe(true);
        expect(decodeURIComponent(image), "a circle when no contour is given").toContain("<circle");
    });

    it("traces the contour it is given", () => {
        const image = RevealUtils.buildHoleImage(
            40,
            1,
            ({ width, height }) => [
                { x: 0, y: 0 },
                { x: width, y: 0 },
                { x: 0, y: height },
            ],
            undefined,
            undefined,
        );

        expect(decodeURIComponent(image)).toContain("<path");
    });
});

describe("the hole", () => {
    it("opens for the keyboard even when the pointer is away, but never while turned off by the pointer alone", () => {
        expect(RevealUtils.getIsRevealing(false, true, false)).toBe(true);
        expect(RevealUtils.getIsRevealing(true, false, true)).toBe(false);
        expect(RevealUtils.getHasHole(false, false, true, 40)).toBe(true);
        expect(RevealUtils.getHasHole(false, false, true, 0), "a window of no size cuts nothing").toBe(false);
    });

    it("follows the pointer unless the keyboard holds it, and holds the keyboard's point inside the box", () => {
        expect(RevealUtils.computeHoleCenter(undefined, { x: 10, y: 20 }, SIZE)).toEqual({ x: 10, y: 20 });
        expect(RevealUtils.computeHoleCenter({ x: -5, y: 500 }, { x: 10, y: 20 }, SIZE)).toEqual({ x: 0, y: 200 });
    });

    it("hands the cover no mask without a hole, and one layer past the full one with it", () => {
        expect(RevealUtils.computeMaskStyle(false, { x: 0, y: 0 }, 40, "none")).toEqual({});
        expect(RevealUtils.computeMaskStyle(true, { x: 100, y: 50 }, 40, "none")["mask-position"]).toBe(
            "0 0, 60px 10px",
        );
    });
});

describe("the arrow keys", () => {
    it("move one step per press and leave a key with a modifier to the browser", () => {
        const plain = { key: "ArrowRight", altKey: false, ctrlKey: false, metaKey: false };

        expect(RevealUtils.getNudge(plain)).toEqual({ x: 1, y: 0 });
        expect(RevealUtils.getNudge({ ...plain, altKey: true })).toBeUndefined();
        expect(RevealUtils.getNudge({ ...plain, key: "a" })).toBeUndefined();
    });

    it("stop at the edge", () => {
        expect(RevealUtils.computeNudgedPoint({ x: 390, y: 100 }, { x: 1, y: 0 }, 20, SIZE)).toEqual({
            x: 400,
            y: 100,
        });
    });
});
