import { describe, expect, it } from "vitest";

import { GestureUtils } from "../../src/Abstracts/gesture.js";

describe("GestureUtils.computeSwipeAxis", () => {
    it("puts a leftward push on the horizontal axis", () => {
        expect(GestureUtils.computeSwipeAxis("left")).toBe("horizontal");
    });

    it("puts a downward push on the vertical axis", () => {
        expect(GestureUtils.computeSwipeAxis("down")).toBe("vertical");
    });
});

describe("GestureUtils.computeSwipeProgress", () => {
    it("reads the horizontal axis and ignores drift on the other one", () => {
        expect(GestureUtils.computeSwipeProgress({ x: 0.2, y: 0.5 }, { x: 0.7, y: 0.9 }, "horizontal")).toBeCloseTo(
            0.5,
        );
    });

    it("is negative when the pointer travels back towards the start of the element", () => {
        expect(GestureUtils.computeSwipeProgress({ x: 0.8, y: 0.5 }, { x: 0.3, y: 0.5 }, "horizontal")).toBeCloseTo(
            -0.5,
        );
    });

    it("passes the element's own edges, because a pointer may be dragged outside it", () => {
        expect(GestureUtils.computeSwipeProgress({ x: 0.5, y: 0.5 }, { x: 2, y: 0.5 }, "horizontal")).toBeCloseTo(1.5);
    });
});

describe("GestureUtils.computeSwipeDirection", () => {
    it("commits nothing when the release falls short of the threshold", () => {
        expect(GestureUtils.computeSwipeDirection(0.1, "horizontal", 0.35)).toBeUndefined();
    });

    it("commits rightwards when the pointer ended further along the horizontal axis", () => {
        expect(GestureUtils.computeSwipeDirection(0.4, "horizontal", 0.35)).toBe("right");
    });

    it("commits leftwards when the pointer ended further back along the horizontal axis", () => {
        expect(GestureUtils.computeSwipeDirection(-0.4, "horizontal", 0.35)).toBe("left");
    });

    it("commits upwards when the pointer ended further back along the vertical axis", () => {
        expect(GestureUtils.computeSwipeDirection(-0.4, "vertical", 0.35)).toBe("up");
    });

    it("commits downwards when the pointer ended further along the vertical axis", () => {
        expect(GestureUtils.computeSwipeDirection(0.4, "vertical", 0.35)).toBe("down");
    });
});

describe("GestureUtils.computeSwipeOffset", () => {
    it("is the travel itself when the pointer moves the way the gesture commits", () => {
        expect(GestureUtils.computeSwipeOffset(-0.4, "left")).toBeCloseTo(0.4);
    });

    it("is nothing when the pointer moves against the way the gesture commits", () => {
        expect(GestureUtils.computeSwipeOffset(0.4, "left")).toBe(0);
    });

    it("stops at the element's own extent, so an overshoot cannot push it further", () => {
        expect(GestureUtils.computeSwipeOffset(1.6, "right")).toBe(1);
    });
});

describe("GestureUtils.computeVelocity", () => {
    it("reads the speed over the last stretch of the drag only", () => {
        const velocity = GestureUtils.computeVelocity(
            [
                { point: { x: 0, y: 0 }, timeMs: 0 },
                { point: { x: 500, y: 0 }, timeMs: 400 },
                { point: { x: 600, y: 50 }, timeMs: 450 },
            ],
            100,
        );

        expect(velocity).toEqual({ x: 2, y: 1 });
    });

    it("answers no speed for a single sample, or none at all", () => {
        expect(GestureUtils.computeVelocity([{ point: { x: 0, y: 0 }, timeMs: 0 }], 100)).toEqual({ x: 0, y: 0 });
        expect(GestureUtils.computeVelocity([], 100)).toEqual({ x: 0, y: 0 });
    });
});

describe("GestureUtils.coast", () => {
    it("travels the sum of a speed that decays, and keeps the share it should", () => {
        const step = GestureUtils.coast(1, 100, 100);

        expect(step.speed).toBeCloseTo(Math.exp(-1), 12);
        expect(step.distance).toBeCloseTo(100 * (1 - Math.exp(-1)), 12);
    });

    it("travels as far in one long step as in two short ones, so the frame rate cannot change a coast", () => {
        const whole = GestureUtils.coast(0.01, 160, 200);
        const first = GestureUtils.coast(0.01, 80, 200);
        const second = GestureUtils.coast(first.speed, 80, 200);

        expect(first.distance + second.distance).toBeCloseTo(whole.distance, 12);
        expect(second.speed).toBeCloseTo(whole.speed, 12);
    });

    it("stops at once with no momentum", () => {
        expect(GestureUtils.coast(1, 16, 0)).toEqual({ distance: 0, speed: 0 });
    });
});
