import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ParticleDissolveUtils } from "./ParticleDissolve.utils";

const BOX = { width: 200, height: 100 };

const RIGHT = { kind: "linear", angleDegrees: 90 } as const;
const DOWN = { kind: "linear", angleDegrees: 180 } as const;

describe("computeSweep", () => {
    it("is straight along the angle unless an origin is given", () => {
        expect(ParticleDissolveUtils.computeSweep(45, undefined, BOX)).toEqual({ kind: "linear", angleDegrees: 45 });
    });

    it("spreads from the origin, turned from a share of the size into pixels", () => {
        expect(ParticleDissolveUtils.computeSweep(45, { x: 0.5, y: 0.25 }, BOX)).toEqual({
            kind: "radial",
            origin: { x: 100, y: 25 },
        });
    });
});

describe("computeSweepPosition", () => {
    it("runs from one side to the other along a straight sweep", () => {
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 0, y: 40 }, BOX, RIGHT)).toBeCloseTo(0);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 100, y: 40 }, BOX, RIGHT)).toBeCloseTo(0.5);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 200, y: 40 }, BOX, RIGHT)).toBeCloseTo(1);
    });

    it("starts at the top for a sweep going down, and ignores how wide the box is", () => {
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 150, y: 0 }, BOX, DOWN)).toBeCloseTo(0);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 5, y: 100 }, BOX, DOWN)).toBeCloseTo(1);
    });

    it("runs along the diagonal from the first corner to the last for a slanted sweep", () => {
        const slanted = { kind: "linear", angleDegrees: 135 } as const;

        expect(ParticleDissolveUtils.computeSweepPosition({ x: 0, y: 0 }, BOX, slanted)).toBeCloseTo(0);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 200, y: 100 }, BOX, slanted)).toBeCloseTo(1);
    });

    it("measures an outward sweep from its origin to the farthest corner", () => {
        const sweep = { kind: "radial", origin: { x: 0, y: 0 } } as const;

        expect(ParticleDissolveUtils.computeSweepPosition({ x: 0, y: 0 }, BOX, sweep)).toBe(0);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 200, y: 100 }, BOX, sweep)).toBeCloseTo(1);
    });

    it("keeps every answer in 0 to 1 and answers 0 for a box with nothing to sweep", () => {
        expect(ParticleDissolveUtils.computeSweepPosition({ x: -50, y: 0 }, BOX, RIGHT)).toBe(0);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 900, y: 0 }, BOX, RIGHT)).toBe(1);
        expect(ParticleDissolveUtils.computeSweepPosition({ x: 0, y: 0 }, { width: 0, height: 0 }, RIGHT)).toBe(0);
    });
});

describe("computeLifetimeShare and computeEdge", () => {
    it("holds the lifetime below the whole duration so the edge has room to travel", () => {
        expect(ParticleDissolveUtils.computeLifetimeShare(1000, 600)).toBeCloseTo(0.6);
        expect(ParticleDissolveUtils.computeLifetimeShare(1000, 5000)).toBeCloseTo(0.9);
        expect(ParticleDissolveUtils.computeLifetimeShare(0, 600)).toBe(0);
    });

    it("has the edge pass everything when the last particle is released, and stay there", () => {
        expect(ParticleDissolveUtils.computeEdge(0, 0.6)).toBe(0);
        expect(ParticleDissolveUtils.computeEdge(0.2, 0.6)).toBeCloseTo(0.5);
        expect(ParticleDissolveUtils.computeEdge(0.4, 0.6)).toBe(1);
        expect(ParticleDissolveUtils.computeEdge(1, 0.6)).toBe(1);
    });
});

describe("computeCellWeights", () => {
    it("gives the most weight where the sweep starts and the least where it ends", () => {
        const weights = ParticleDissolveUtils.computeCellWeights({ col: 4, row: 2 }, BOX, RIGHT);

        expect(weights).toHaveLength(2);
        expect(weights[0]).toHaveLength(4);
        expect(weights[0]![0]!).toBeGreaterThan(weights[0]![3]!);
        expect(weights[0]!.every((weight) => weight >= 0 && weight <= 1)).toBe(true);
    });

    it("releases a cell when the edge reaches it, whatever the lifetime", () => {
        const count = { col: 10, row: 1 };
        const lifetimeShare = 0.5;
        const [weights] = ParticleDissolveUtils.computeCellWeights(count, BOX, RIGHT);

        weights!.forEach((weight, col) => {
            const position = (col + 0.5) / count.col;
            const spawnProgress = (1 - weight) * (1 - lifetimeShare);

            expect(ParticleDissolveUtils.computeEdge(spawnProgress, lifetimeShare)).toBeCloseTo(position);
        });
    });
});

describe("computeMask", () => {
    it("asks for no mask until the edge has started", () => {
        expect(ParticleDissolveUtils.computeMask(0, 0.2, RIGHT, BOX)).toBeUndefined();
    });

    it("hides nothing at the start of the edge and everything at the end", () => {
        const start = ParticleDissolveUtils.computeMask(0.001, 0.2, RIGHT, BOX)!;
        const end = ParticleDissolveUtils.computeMask(1, 0.2, RIGHT, BOX)!;

        const percents = (mask: string) => [...mask.matchAll(/(-?[\d.]+)%/g)].map((match) => Number(match[1]));
        const [startFrom, startTo] = percents(start);
        const [endFrom, endTo] = percents(end);

        expect(start).toContain("linear-gradient(90deg");
        expect(startFrom, "the ramp has not yet entered the box").toBeLessThan(0);
        expect(startTo, "and is still all but outside it").toBeLessThan(1);
        expect(endFrom, "at the end the ramp has reached the far side").toBe(100);
        expect(endTo, "and left the box with the whole of the content behind it").toBeGreaterThan(100);
    });

    it("measures an outward mask in pixels from the origin", () => {
        const sweep = { kind: "radial", origin: { x: 100, y: 50 } } as const;
        const mask = ParticleDissolveUtils.computeMask(0.5, 0, sweep, BOX)!;

        expect(mask).toContain("radial-gradient(circle 111.803px at 100px 50px");
        expect(mask).toContain("transparent 55.902px");
    });

    it("answers no mask for an outward sweep over a box with no extent", () => {
        const sweep = { kind: "radial", origin: { x: 0, y: 0 } } as const;

        expect(ParticleDissolveUtils.computeMask(0.5, 0.2, sweep, { width: 0, height: 0 })).toBeUndefined();
    });
});

describe("computeCellCount", () => {
    it("covers the size with squares", () => {
        expect(ParticleDissolveUtils.computeCellCount({ width: 100, height: 50 }, 10)).toEqual({ col: 10, row: 5 });
        expect(ParticleDissolveUtils.computeCellCount({ width: 101, height: 50 }, 10)).toEqual({ col: 11, row: 5 });
    });

    it("never has none, and never more than a grid can afford", () => {
        expect(ParticleDissolveUtils.computeCellCount({ width: 0, height: 0 }, 10)).toEqual({ col: 1, row: 1 });
        expect(ParticleDissolveUtils.computeCellCount({ width: 100000, height: 100000 }, 1)).toEqual({
            col: 80,
            row: 80,
        });
    });
});

describe("computeDurationMs", () => {
    it("shortens the run for a reader who asked for reduced motion, and never lengthens it", () => {
        expect(ParticleDissolveUtils.computeDurationMs(1200, false)).toBe(1200);
        expect(ParticleDissolveUtils.computeDurationMs(1200, true)).toBeLessThan(1200);
        expect(ParticleDissolveUtils.computeDurationMs(50, true)).toBe(50);
    });
});

describe("computeProgress", () => {
    it("moves from one end to the other and stops there", () => {
        expect(ParticleDissolveUtils.computeProgress(0, 1, 250, 1000)).toBeCloseTo(0.25);
        expect(ParticleDissolveUtils.computeProgress(1, 0, 250, 1000)).toBeCloseTo(0.75);
        expect(ParticleDissolveUtils.computeProgress(0, 1, 5000, 1000)).toBe(1);
        expect(ParticleDissolveUtils.computeProgress(0, 1, 0, 0)).toBe(1);
    });
});

describe("run", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("finishes on the timer when no frame arrives, reporting the end once", () => {
        const onProgress = vi.fn();
        const onEnd = vi.fn();

        ParticleDissolveUtils.run({ from: 0, to: 1, durationMs: 1000, onProgress, onEnd });

        vi.advanceTimersByTime(900);
        expect(onEnd, "not yet").not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);
        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(onProgress).toHaveBeenLastCalledWith(1);
    });

    it("takes the matching part of the duration for a trip part of the way", () => {
        const onEnd = vi.fn();

        ParticleDissolveUtils.run({ from: 0.5, to: 1, durationMs: 1000, onProgress: vi.fn(), onEnd });

        vi.advanceTimersByTime(450);
        expect(onEnd, "half the trip takes about half the duration").not.toHaveBeenCalled();

        vi.advanceTimersByTime(250);
        expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it("finishes at once when it has nowhere to go", () => {
        const onEnd = vi.fn();

        ParticleDissolveUtils.run({ from: 1, to: 1, durationMs: 1000, onProgress: vi.fn(), onEnd });

        expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it("reports nothing once stopped", () => {
        const onEnd = vi.fn();
        const stop = ParticleDissolveUtils.run({ from: 0, to: 1, durationMs: 1000, onProgress: vi.fn(), onEnd });

        stop();
        vi.advanceTimersByTime(5000);

        expect(onEnd).not.toHaveBeenCalled();
    });
});
