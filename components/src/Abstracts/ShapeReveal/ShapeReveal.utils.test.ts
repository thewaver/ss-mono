import { describe, expect, it } from "vitest";

import { type Point2d, ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { SHAPE_REVEAL_SPOTS } from "./ShapeReveal.const";
import { ShapeRevealUtils } from "./ShapeReveal.utils";

const VIEWPORT = { width: 1200, height: 800 };

const SQUARE = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);

const getIsInside = (point: Point2d, polygon: Point2d[]) => {
    let isInside = false;

    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
        const a = polygon[index];
        const b = polygon[previous];
        const crosses = a.y > point.y !== b.y > point.y;

        if (crosses && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) isInside = !isInside;
    }

    return isInside;
};

const getCorners = (size: Size2d): Point2d[] => [
    { x: 0, y: 0 },
    { x: size.width, y: 0 },
    { x: size.width, y: size.height },
    { x: 0, y: size.height },
];

describe("where a reveal grows from", () => {
    it("puts the center and the corners where their names say", () => {
        expect(ShapeRevealUtils.resolveSpot("center", VIEWPORT)).toEqual({ x: 600, y: 400 });
        expect(ShapeRevealUtils.resolveSpot("top-left", VIEWPORT)).toEqual({ x: 0, y: 0 });
        expect(ShapeRevealUtils.resolveSpot("bottom-right", VIEWPORT)).toEqual({ x: 1200, y: 800 });
    });

    it("takes a point as it is", () => {
        expect(ShapeRevealUtils.resolveOrigin({ x: 12, y: 34 }, VIEWPORT)).toEqual({ x: 12, y: 34 });
        expect(ShapeRevealUtils.resolveOrigin("top-right", VIEWPORT)).toEqual({ x: 1200, y: 0 });
    });

    it("has to reach the corner across from it", () => {
        expect(ShapeRevealUtils.computeFarthestDistance({ x: 0, y: 0 }, VIEWPORT)).toBe(Math.hypot(1200, 800));
        expect(ShapeRevealUtils.computeFarthestDistance({ x: 600, y: 400 }, VIEWPORT)).toBe(Math.hypot(600, 400));
        expect(
            ShapeRevealUtils.computeFarthestDistance({ x: -100, y: 400 }, VIEWPORT),
            "a point outside the viewport reaches past it",
        ).toBe(Math.hypot(1300, 400));
    });
});

describe("the shape", () => {
    it("measures a square's nearest edge as half its side from the middle", () => {
        const square = SQUARE({ width: 10, height: 10 });

        expect(ShapeRevealUtils.computeInnerRadius(square, { x: 5, y: 5 })).toBe(5);
        expect(ShapeRevealUtils.computeInnerRadius(square, { x: 2, y: 5 })).toBe(2);
        expect(ShapeRevealUtils.computeInnerRadius(square.slice(0, 2), { x: 5, y: 5 })).toBe(0);
    });

    it("grows until its nearest edge reaches the distance asked for", () => {
        const outline = ShapeRevealUtils.computeOutline(SQUARE, 100)!;

        expect(ShapeRevealUtils.computeInnerRadius(outline, { x: 0, y: 0 })).toBeCloseTo(100);
    });

    it("gives up on a contour that cannot enclose anything", () => {
        expect(ShapeRevealUtils.computeOutline(() => [{ x: 0, y: 0 }], 100)).toBeUndefined();
        expect(
            ShapeRevealUtils.computeOutline(
                () => [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 2, y: 2 },
                ],
                100,
            ),
            "a contour with no inside",
        ).toBeUndefined();
    });

    it("covers the whole viewport at the end, for every default shape from every spot", () => {
        for (const shape of ShapeConst.DEFAULT_SHAPES) {
            for (const spot of SHAPE_REVEAL_SPOTS) {
                const origin = ShapeRevealUtils.resolveSpot(spot, VIEWPORT);
                const reach = ShapeRevealUtils.computeFarthestDistance(origin, VIEWPORT);
                const outline = ShapeRevealUtils.computeOutline(
                    (size) => ShapeConst.getDefaultShapePoints(shape, size),
                    reach,
                )!;
                const placed = outline.map((point) => ({ x: origin.x + point.x, y: origin.y + point.y }));

                for (const corner of getCorners(VIEWPORT)) {
                    expect(getIsInside(corner, placed), `${shape} from ${spot}`).toBe(true);
                }
            }
        }
    });
});

describe("the frames", () => {
    const origin = { x: 100, y: 50 };

    it("start a hard-edged shape at nothing on the origin and end it at full reach", () => {
        const [from, to] = ShapeRevealUtils.computeClipKeyframes(origin, 300, undefined);

        expect(from.clipPath).toBe("circle(0px at 100px 50px)");
        expect(to.clipPath).toBe("circle(300px at 100px 50px)");
    });

    it("move every corner of a contour from the origin, keeping the count so the browser can blend them", () => {
        const outline = ShapeRevealUtils.computeOutline(SQUARE, 300)!;
        const [from, to] = ShapeRevealUtils.computeClipKeyframes(origin, 300, outline);
        const corners = (frame: Keyframe) => String(frame.clipPath).split(",");

        expect(corners(from)).toHaveLength(outline.length);
        expect(corners(to)).toHaveLength(outline.length);
        expect(corners(from).every((corner) => corner.includes("100px 50px"))).toBe(true);
    });

    it("grow a soft shape's mask from no size at the origin, keeping the origin where it was", () => {
        const [from, to] = ShapeRevealUtils.computeMaskKeyframes(origin, 300, undefined, 10);
        const [width, height] = String(to.maskSize).split(" ").map(parseFloat);
        const [left, top] = String(to.maskPosition).split(" ").map(parseFloat);

        expect(from.maskSize).toBe("0px 0px");
        expect(from.maskPosition).toBe("100px 50px");
        expect(from.maskImage).toBe(to.maskImage);
        expect(width, "the circle and the blur on both sides").toBe(300 * 2 + 10 * 6);
        expect(height).toBe(width);
        expect(left + width * 0.5, "the circle's middle lands on the origin").toBe(100);
        expect(top + height * 0.5).toBe(50);
        expect(decodeURIComponent(String(to.maskImage))).toContain("blur(10px)");
    });

    it("use a clip for a hard edge and a mask for a soft one, holding the new page opaque and unblended", () => {
        const hard = ShapeRevealUtils.computeKeyframes(origin, VIEWPORT, SQUARE, 0);
        const soft = ShapeRevealUtils.computeKeyframes(origin, VIEWPORT, SQUARE, 8);

        expect(hard.every((frame) => frame.clipPath !== undefined && frame.maskImage === undefined)).toBe(true);
        expect(soft.every((frame) => frame.maskImage !== undefined && frame.clipPath === undefined)).toBe(true);
        expect([...hard, ...soft].every((frame) => frame.opacity === 1 && frame.mixBlendMode === "normal")).toBe(true);
    });

    it("fall back to a circle for a contour it cannot use", () => {
        const [, to] = ShapeRevealUtils.computeKeyframes(origin, VIEWPORT, () => [], 0);

        expect(String(to.clipPath).startsWith("circle(")).toBe(true);
    });
});

describe("without view transitions", () => {
    it("still makes the change, and says it was not revealed", async () => {
        let hasChanged = false;

        const result = await ShapeRevealUtils.reveal(() => {
            hasChanged = true;
        });

        expect(hasChanged).toBe(true);
        expect(result).toBe(false);
    });

    it("waits for a change that returns a promise", async () => {
        let hasChanged = false;

        await ShapeRevealUtils.reveal(async () => {
            await Promise.resolve();
            hasChanged = true;
        });

        expect(hasChanged).toBe(true);
    });
});
