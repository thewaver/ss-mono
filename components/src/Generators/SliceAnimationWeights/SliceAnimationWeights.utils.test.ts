import { afterEach, describe, expect, it, vi } from "vitest";

import type { Count2d, Index2d } from "@thewaver/ss-utils";

import type { SweepDefs } from "./SliceAnimationWeights.types";
import { SliceAnimationWeightUtils as Utils } from "./SliceAnimationWeights.utils";

/**
 * The weight families themselves are covered through their registry in `SliceAnimationWeights.const.test.ts`. These
 * are the measures they are built from, checked over every cell and origin of a few grids, including the awkward
 * ones: one cell wide, even sides, and wider than tall.
 */

const GRIDS: Count2d[] = [
    { colCount: 1, rowCount: 1 },
    { colCount: 1, rowCount: 6 },
    { colCount: 4, rowCount: 4 },
    { colCount: 7, rowCount: 5 },
    { colCount: 10, rowCount: 3 },
];

const cellsOf = (count: Count2d) =>
    Array.from({ length: count.rowCount }, (_, row) =>
        Array.from({ length: count.colCount }, (_, col) => ({ col, row })),
    ).flat();

const forEveryOrigin = (check: (count: Count2d, origin: Index2d, cells: Index2d[]) => void) => {
    for (const count of GRIDS) {
        const cells = cellsOf(count);

        for (const origin of cells) check(count, origin, cells);
    }
};

const SWEEPS: SweepDefs[] = [
    { quadrantsPerSection: 4, clockDownMul: 0, clockRightMul: 1, clockUpMul: 2, clockLeftMul: 3 },
    { quadrantsPerSection: 2, clockDownMul: 0, clockRightMul: 1, clockUpMul: 0, clockLeftMul: 1 },
];

const SPIRALS: SweepDefs[] = [
    { quadrantsPerSection: 4, clockDownMul: 1, clockRightMul: 3, clockUpMul: 5, clockLeftMul: 7 },
];

describe("SliceAnimationWeightUtils distances", () => {
    it("measures a cell delta as two gaps of zero or more, the same either way round", () => {
        forEveryOrigin((_, origin, cells) => {
            for (const cell of cells) {
                const delta = Utils.getCellDelta(origin, cell);

                expect(delta.col).toBeGreaterThanOrEqual(0);
                expect(delta.row).toBeGreaterThanOrEqual(0);
                expect(Utils.getCellDelta(cell, origin)).toEqual(delta);
            }
        });
    });

    it("holds each farthest edge at the minimum or more, and no cell beyond it", () => {
        forEveryOrigin((count, origin, cells) => {
            const max = Utils.getMaxDistance(origin, count);

            expect(max.col).toBeGreaterThanOrEqual(Utils.MIN_MAX_DISTANCE);
            expect(max.row).toBeGreaterThanOrEqual(Utils.MIN_MAX_DISTANCE);

            for (const cell of cells) {
                const delta = Utils.getCellDelta(origin, cell);

                expect(delta.col).toBeLessThanOrEqual(max.col);
                expect(delta.row).toBeLessThanOrEqual(max.row);
            }
        });
    });

    it("puts a cell on either diagonal through the origin at nought from it", () => {
        const origin = { col: 3, row: 2 };

        expect(Utils.getDiagonalDelta(origin, { col: 5, row: 4 }).down).toBe(0);
        expect(Utils.getDiagonalDelta(origin, { col: 5, row: 0 }).up).toBe(0);
        expect(Utils.getDiagonalDelta(origin, origin)).toEqual({ down: 0, up: 0 });
    });

    it("finds no cell farther from a diagonal than the largest diagonal distance", () => {
        forEveryOrigin((count, origin, cells) => {
            const max = Utils.getMaxDiagonalDistance(origin, count);

            expect(max.down).toBeGreaterThanOrEqual(Utils.MIN_MAX_DISTANCE);
            expect(max.up).toBeGreaterThanOrEqual(Utils.MIN_MAX_DISTANCE);

            for (const cell of cells) {
                const dist = Utils.getDiagonalDelta(origin, cell);

                expect(dist.down).toBeLessThanOrEqual(max.down);
                expect(dist.up).toBeLessThanOrEqual(max.up);
            }
        });
    });

    it("reaches, within each band, the farthest cell sharing that band and no farther", () => {
        forEveryOrigin((count, origin, cells) => {
            for (const cell of cells) {
                const dist = Utils.getDiagonalDelta(origin, cell);
                const inBand = Utils.getMaxDiagonalDistanceInBand(origin, count, dist);
                const sameDown = cells
                    .map((other) => Utils.getDiagonalDelta(origin, other))
                    .filter((other) => other.down === dist.down);
                const sameUp = cells
                    .map((other) => Utils.getDiagonalDelta(origin, other))
                    .filter((other) => other.up === dist.up);

                expect(inBand.up).toBe(Math.max(...sameDown.map((other) => other.up), Utils.MIN_MAX_DISTANCE));
                expect(inBand.down).toBe(Math.max(...sameUp.map((other) => other.down), Utils.MIN_MAX_DISTANCE));
            }
        });
    });

    it("stretches square rings so a cell on any farthest edge is on the outermost ring", () => {
        forEveryOrigin((count, origin) => {
            const max = Utils.getMaxDistance(origin, count);
            const outermost = Math.max(max.col, max.row);

            expect(Utils.getStretchedDistance({ col: max.col, row: 0 }, max)).toBeCloseTo(outermost);
            expect(Utils.getStretchedDistance({ col: 0, row: max.row }, max)).toBeCloseTo(outermost);
            expect(Utils.getStretchedDistance({ col: 0, row: 0 }, max)).toBe(0);
        });
    });

    it("mirrors a cell across the origin's column and back, on the same row", () => {
        forEveryOrigin((_, origin, cells) => {
            for (const cell of cells) {
                const mirrored = Utils.getMirroredPos(cell, origin);

                expect(mirrored.row).toBe(cell.row);
                expect(Utils.getMirroredPos(mirrored, origin)).toEqual(cell);
            }
        });
    });
});

describe("SliceAnimationWeightUtils orderings", () => {
    it("weighs the first place 1, the last 0, and a lone place 1", () => {
        expect(Utils.fromOrderedIndex(0, 5)).toBe(1);
        expect(Utils.fromOrderedIndex(4, 5)).toBe(0);
        expect(Utils.fromOrderedIndex(0, 1)).toBe(1);
    });

    it("strides through every item exactly once, starting at the origin's", () => {
        for (const total of [1, 2, 5, 8, 12, 30, 49]) {
            for (const originIndex of [0, Math.floor(total * 0.5), total - 1]) {
                const weights = Array.from({ length: total }, (_, index) => Utils.stride(index, originIndex, total));
                const expected = Array.from({ length: total }, (_, place) => Utils.fromOrderedIndex(place, total));

                expect(Utils.stride(originIndex, originIndex, total)).toBe(1);
                expect([...weights].sort((a, b) => a - b)).toEqual([...expected].sort((a, b) => a - b));
            }
        }
    });
});

describe("SliceAnimationWeightUtils.ripple", () => {
    const SPREADS = [0, 0.5, 1, 2.5, 4, 7, 10];

    it("stays inside 0..1 for any blend", () => {
        for (const travelRatio of [0, 0.25, 0.5, 1]) {
            for (const spread of SPREADS) {
                const weight = Utils.ripple(spread, 10, { periodCells: 3, travelRatio });

                expect(weight).toBeGreaterThanOrEqual(0);
                expect(weight).toBeLessThanOrEqual(1);
            }
        }
    });

    it("is only a falloff, nearest first, when it travels fully", () => {
        const weights = SPREADS.map((spread) => Utils.ripple(spread, 10, { periodCells: 3, travelRatio: 1 }));

        expect(weights.every((weight, index) => index === 0 || weight < weights[index - 1])).toBe(true);
    });

    it("crests every band at once when it stands still", () => {
        for (const crest of [0, 3, 6, 9]) {
            expect(Utils.ripple(crest, 10, { periodCells: 3, travelRatio: 0 })).toBeCloseTo(1);
        }
    });
});

describe("SliceAnimationWeightUtils sweeps", () => {
    it.each([
        ["radar", SWEEPS, Utils.radar],
        ["spiral", SPIRALS, Utils.spiral],
    ] as const)("sends the origin first in a %s, ahead of every other cell", (_, defsList, sweep) => {
        for (const defs of defsList) {
            forEveryOrigin((count, origin, cells) => {
                expect(sweep(origin, count, origin, defs)).toBe(1);

                for (const cell of cells) {
                    if (cell.col === origin.col && cell.row === origin.row) continue;

                    expect(sweep(cell, count, origin, defs)).toBeLessThan(1);
                }
            });
        }
    });
});

describe("SliceAnimationWeightUtils.computeSliceWeights", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("pulls an origin outside the grid back inside it before any cell is weighed", () => {
        const seen: Index2d[] = [];

        Utils.computeSliceWeights(
            (_, __, origin) => {
                seen.push(origin);

                return 0;
            },
            { colCount: 4, rowCount: 3 },
            { col: 9, row: -2 },
        );

        expect(seen.every((origin) => origin.col >= 0 && origin.col <= 3 && origin.row >= 0 && origin.row <= 2)).toBe(
            true,
        );
    });

    it("clamps every weight to 0..1 and rounds it to the stated places", () => {
        const weights = Utils.computeSliceWeights(
            (pos) => (pos.col - 1) * 0.73456789,
            { colCount: 4, rowCount: 1 },
            { col: 0, row: 0 },
        ).flat();
        const scale = 10 ** Utils.WEIGHT_DECIMAL_PLACES;

        expect(weights[0]).toBe(0);
        expect(weights[3]).toBe(1);
        expect(weights.every((weight) => Math.abs(weight * scale - Math.round(weight * scale)) < 1e-9)).toBe(true);
    });

    it("gives every cell its own weight when asked, on a grid the rounding can hold", () => {
        const weights = Utils.computeSliceWeights(
            (pos) => (pos.col < 5 ? 0.2 : 0.8),
            { colCount: 10, rowCount: 10 },
            { col: 0, row: 0 },
            {
                shouldMakeUnique: true,
            },
        ).flat();

        expect(new Set(weights).size).toBe(weights.length);
    });

    it("staggers a grid of one weight throughout when asked to make its weights unique", () => {
        const weights = Utils.computeSliceWeights(
            () => 0.5,
            { colCount: 4, rowCount: 4 },
            { col: 0, row: 0 },
            {
                shouldMakeUnique: true,
            },
        ).flat();

        expect(new Set(weights).size).toBe(weights.length);
        expect(weights.every((weight) => weight >= 0 && weight <= 1)).toBe(true);
    });

    it("spreads the distinct weights from 0 to 1 when asked to normalize", () => {
        const weights = Utils.computeSliceWeights(
            (pos) => 0.4 + pos.col * 0.01,
            { colCount: 5, rowCount: 2 },
            { col: 0, row: 0 },
            {
                shouldNormalize: true,
            },
        ).flat();

        expect(Math.min(...weights)).toBe(0);
        expect(Math.max(...weights)).toBe(1);
    });

    it("moves the random seed on once per run, and every cell of the run reads the same one", () => {
        const draws = [0.1, 0.7];

        vi.spyOn(Math, "random").mockImplementation(() => draws.shift() ?? 0.5);

        const seeds = new Set<number>();

        Utils.computeSliceWeights(
            () => {
                seeds.add(Utils.getRandomSeed());

                return 0;
            },
            { colCount: 3, rowCount: 3 },
            { col: 0, row: 0 },
        );

        const firstRunSeed = Utils.getRandomSeed();

        Utils.computeSliceWeights(() => 0, { colCount: 1, rowCount: 1 }, { col: 0, row: 0 });

        expect(seeds.size).toBe(1);
        expect(Utils.getRandomSeed()).not.toBe(firstRunSeed);
    });
});
