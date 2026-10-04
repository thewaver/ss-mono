import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WraparoundUtils } from "./Wraparound.utils";

const TILE = { width: 100, height: 50 };
const VIEW = { width: 250, height: 120 };
const ORIGINAL = { column: 0, row: 0 };

describe("WraparoundUtils.computeTiles", () => {
    it("covers the window with copies, the original's cell included", () => {
        const tiles = WraparoundUtils.computeTiles({ x: 0, y: 0 }, TILE, VIEW, 100);

        expect(tiles).toHaveLength(3 * 3);
        expect(tiles).toContainEqual(ORIGINAL);
        expect(tiles).toContainEqual({ column: 2, row: 2 });
    });

    it("reaches cells to the left and above once the plane has moved the other way", () => {
        const tiles = WraparoundUtils.computeTiles({ x: 30, y: 20 }, TILE, VIEW, 100);

        expect(tiles).toContainEqual({ column: -1, row: -1 });
        expect(tiles).toContainEqual({ column: 2, row: 1 });
        expect(tiles, "the bottom row has moved out of the window").not.toContainEqual({ column: 0, row: 2 });
    });

    it("draws nothing for content with no size, and stops at the limit", () => {
        expect(WraparoundUtils.computeTiles({ x: 0, y: 0 }, { width: 0, height: 50 }, VIEW, 100)).toEqual([]);
        expect(WraparoundUtils.computeTiles({ x: 0, y: 0 }, { width: 1, height: 1 }, VIEW, 10)).toHaveLength(10);
    });
});

describe("WraparoundUtils.findTileAt", () => {
    it("counts cells from the plane's offset, below zero as well as above", () => {
        expect(WraparoundUtils.findTileAt({ x: 10, y: 10 }, { x: 30, y: 0 }, TILE)).toEqual({ column: -1, row: 0 });
        expect(WraparoundUtils.findTileAt({ x: 230, y: 60 }, { x: 30, y: 0 }, TILE)).toEqual({ column: 2, row: 1 });
    });
});

describe("WraparoundUtils.computeReveal", () => {
    it("leaves a part already in view where it is", () => {
        const { shift, delta } = WraparoundUtils.computeReveal(
            { x: 0, y: 0 },
            { x: 10, y: 10, width: 20, height: 20 },
            TILE,
            VIEW,
        );

        expect(shift).toEqual({ column: 0, row: 0 });
        expect(delta).toEqual({ x: 0, y: 0 });
    });

    it("hands the original another cell rather than moving the plane, when that cell is already in view", () => {
        const { shift, delta } = WraparoundUtils.computeReveal(
            { x: -400, y: 0 },
            { x: 10, y: 10, width: 20, height: 20 },
            TILE,
            VIEW,
        );

        expect(shift.column, "the nearest cell that needs no move").toBe(4);
        expect(delta).toEqual({ x: 0, y: 0 });
    });

    it("moves just far enough to show a part cut by the edge", () => {
        const { delta } = WraparoundUtils.computeReveal(
            { x: 0, y: 0 },
            { x: 80, y: 0, width: 20, height: 140 },
            { width: 100, height: 400 },
            VIEW,
        );

        expect(delta.x).toBe(0);
        expect(delta.y, "a part taller than the window shows its top edge").toBe(0);
    });

    it("pulls a part hanging over the far edge back by the overhang", () => {
        const { delta } = WraparoundUtils.computeReveal(
            { x: 0, y: 0 },
            { x: 0, y: 100, width: 20, height: 40 },
            { width: 100, height: 400 },
            VIEW,
        );

        expect(delta.y).toBe(120 - 140);
    });
});

describe("WraparoundUtils.computeVelocity", () => {
    it("reads the speed over the last stretch of the drag only", () => {
        const velocity = WraparoundUtils.computeVelocity([
            { point: { x: 0, y: 0 }, timeMs: 0 },
            { point: { x: 500, y: 0 }, timeMs: 400 },
            { point: { x: 600, y: 50 }, timeMs: 450 },
        ]);

        expect(velocity).toEqual({ x: 2, y: 1 });
    });

    it("answers none for a single sample", () => {
        expect(WraparoundUtils.computeVelocity([{ point: { x: 0, y: 0 }, timeMs: 0 }])).toEqual({ x: 0, y: 0 });
    });
});

describe("WraparoundUtils.stepCoast", () => {
    it("travels the sum of a speed that decays, and keeps the share it should", () => {
        const step = WraparoundUtils.stepCoast({ x: 1, y: 0 }, 100, 100);

        expect(step.velocity.x).toBeCloseTo(Math.exp(-1));
        expect(step.distance.x).toBeCloseTo(100 * (1 - Math.exp(-1)));
    });

    it("lands in the same place however the time is cut into frames", () => {
        const whole = WraparoundUtils.stepCoast({ x: 1, y: 0 }, 160, 200);
        const first = WraparoundUtils.stepCoast({ x: 1, y: 0 }, 80, 200);
        const second = WraparoundUtils.stepCoast(first.velocity, 80, 200);

        expect(first.distance.x + second.distance.x).toBeCloseTo(whole.distance.x);
    });

    it("stops dead without momentum", () => {
        expect(WraparoundUtils.stepCoast({ x: 3, y: 3 }, 16, 0)).toEqual({
            distance: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
        });
    });
});

describe("WraparoundUtils.computeKeyDelta", () => {
    it("moves the plane against the key, the way a scrolled page moves", () => {
        expect(WraparoundUtils.computeKeyDelta("ArrowRight", 40, VIEW)).toEqual({ x: -40, y: 0 });
        expect(WraparoundUtils.computeKeyDelta("ArrowUp", 40, VIEW)).toEqual({ x: 0, y: 40 });
        expect(WraparoundUtils.computeKeyDelta("PageDown", 40, VIEW)?.y).toBeCloseTo(-108);
        expect(WraparoundUtils.computeKeyDelta("a", 40, VIEW)).toBeUndefined();
    });
});

describe("WraparoundUtils.computeDriftVelocity", () => {
    it("moves right at nought degrees and down at ninety, per millisecond", () => {
        const right = WraparoundUtils.computeDriftVelocity(500, 0);
        const down = WraparoundUtils.computeDriftVelocity(500, 90);

        expect(right?.x).toBeCloseTo(0.5);
        expect(right?.y).toBeCloseTo(0);
        expect(down?.x).toBeCloseTo(0);
        expect(down?.y).toBeCloseTo(0.5);
    });

    it("moves left at a half turn, at the speed it was given whichever way it goes", () => {
        const left = WraparoundUtils.computeDriftVelocity(80, 180);
        const slanted = WraparoundUtils.computeDriftVelocity(80, 30);

        expect(left?.x).toBeLessThan(0);
        expect(Math.hypot(slanted?.x ?? 0, slanted?.y ?? 0)).toBeCloseTo(0.08);
    });

    it("answers no drift for a speed of nothing or less", () => {
        expect(WraparoundUtils.computeDriftVelocity(0, 0)).toBeUndefined();
        expect(WraparoundUtils.computeDriftVelocity(-10, 0)).toBeUndefined();
        expect(WraparoundUtils.computeDriftVelocity(Number.NaN, 0)).toBeUndefined();
    });
});

describe("WraparoundUtils.createPlane drifting", () => {
    let frames: Map<number, (nowMs: number) => void>;
    let nextHandle: number;

    const runFrame = (nowMs: number) => {
        const pending = [...frames.values()];

        frames.clear();
        pending.forEach((callback) => callback(nowMs));
    };

    const createTestPlane = () =>
        WraparoundUtils.createPlane({
            getTileSize: () => TILE,
            getViewportSize: () => VIEW,
            getOriginal: () => undefined,
            getIsDisabled: () => false,
            getIsMovable: () => true,
            getMomentumMs: () => 0,
            getGlideDurationMs: () => 0,
            getKeyStepPx: () => 40,
        });

    beforeEach(() => {
        frames = new Map();
        nextHandle = 0;
        vi.stubGlobal("requestAnimationFrame", (callback: (nowMs: number) => void) => {
            nextHandle += 1;
            frames.set(nextHandle, callback);

            return nextHandle;
        });
        vi.stubGlobal("cancelAnimationFrame", (handle: number) => frames.delete(handle));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("covers the same distance however the time is cut into frames", () => {
        const fewFrames = createTestPlane();
        const manyFrames = createTestPlane();

        fewFrames.setDrift({ x: 0.1, y: 0 });
        runFrame(0);
        runFrame(1000);
        fewFrames.setDrift(undefined);

        manyFrames.setDrift({ x: 0.1, y: 0 });

        for (let nowMs = 0; nowMs <= 1000; nowMs += 10) runFrame(nowMs);

        expect(fewFrames.get().offset.x).toBeCloseTo(100);
        expect(manyFrames.get().offset.x).toBeCloseTo(fewFrames.get().offset.x);
    });

    it("does not make up the time it spent stopped", () => {
        const plane = createTestPlane();

        plane.setDrift({ x: 0, y: 0.1 });
        runFrame(0);
        runFrame(100);
        plane.setDrift(undefined);
        runFrame(5000);
        plane.setDrift({ x: 0, y: 0.1 });
        runFrame(9000);
        runFrame(9100);

        expect(plane.get().offset.y).toBeCloseTo(20);
    });

    it("carries on from where a hand move left the content", () => {
        const plane = createTestPlane();

        plane.setDrift({ x: 0.1, y: 0 });
        runFrame(0);
        runFrame(100);
        plane.moveBy({ x: 500, y: 0 });
        runFrame(200);
        runFrame(300);

        expect(plane.get().offset.x, "the jump adds to the drift, which loses no time to it").toBeCloseTo(
            10 + 500 + 20,
        );
    });

    it("stops asking for frames once the drift is taken away or the plane is destroyed", () => {
        const plane = createTestPlane();

        plane.setDrift({ x: 0.1, y: 0 });
        runFrame(0);
        plane.setDrift(undefined);
        runFrame(16);

        expect(frames.size).toBe(0);

        plane.setDrift({ x: 0.1, y: 0 });
        plane.destroy();

        expect(frames.size).toBe(0);
    });
});
