import { type Index2d, MathUtils, type Size2d } from "@thewaver/ss-utils";

import type { RippleDefs, SweepDefs, WeightFn, WeightOpts } from "./CellAnimationWeights.types";

const getBandMax = (from: number, to: number, distanceAt: (index: number) => number) =>
    to < from ? 0 : Math.max(distanceAt(from), distanceAt(to));
const WEIGHT_ROUNDING_PLACES = 3;
const HASH_OFFSET = 1;
const HASH_MULTIPLIER_X = 374761393;
const HASH_MULTIPLIER_Y = 668265263;
const HASH_MULTIPLIER_MIX = 1274126177;
const HASH_LOW_SHIFT = 13;
const HASH_HIGH_SHIFT = 16;
const HASH_RANGE = 4294967296;
const FIXED_SEED = 0;
let randomSeed = FIXED_SEED;
const GOLDEN_RATIO = 0.6180339887498949;
const getIndexedWeights = (weights: number[][]) => {
    const indexed = new Map<number, Index2d[]>();

    for (let row = 0; row < weights.length; row++) {
        for (let col = 0; col < weights[row].length; col++) {
            const weight = weights[row][col];
            const bucket = indexed.get(weight);

            if (bucket) {
                bucket.push({ col, row });
            } else {
                indexed.set(weight, [{ col, row }]);
            }
        }
    }

    return indexed;
};
const getOrderedKeys = (indexed: Map<number, Index2d[]>) => [...indexed.keys()].sort((a, b) => a - b);
const normalizeWeights = (weights: number[][]) => {
    const indexed = getIndexedWeights(weights);
    const orderedKeys = getOrderedKeys(indexed);

    if (orderedKeys.length <= 1) return weights;

    const result = weights.map((row) => [...row]);

    orderedKeys.forEach((key, keyIdx) => {
        for (const pos of indexed.get(key)!) {
            result[pos.row][pos.col] = MathUtils.roundToDecimalPlaces(
                keyIdx / (orderedKeys.length - 1),
                WEIGHT_ROUNDING_PLACES,
            );
        }
    });

    return result;
};
const makeWeightsUnique = (weights: number[][]) => {
    const indexed = getIndexedWeights(weights);
    const orderedKeys = getOrderedKeys(indexed);

    if (orderedKeys.length <= 1) return weights;

    const result = weights.map((row) => [...row]);
    const lastBucket = indexed.get(orderedKeys[orderedKeys.length - 1])!;
    const lastGap = orderedKeys[orderedKeys.length - 1] - orderedKeys[orderedKeys.length - 2];
    const maxWeight = 1 + lastGap * ((lastBucket.length - 1) / lastBucket.length);

    let gap = lastGap;

    orderedKeys.forEach((key, keyIdx) => {
        if (keyIdx < orderedKeys.length - 1) {
            gap = orderedKeys[keyIdx + 1] - key;
        }

        const bucket = indexed.get(key)!;

        bucket.forEach((pos, posIdx) => {
            result[pos.row][pos.col] = MathUtils.roundToDecimalPlaces(
                (weights[pos.row][pos.col] + (posIdx / bucket.length) * gap) / maxWeight,
                WEIGHT_ROUNDING_PLACES,
            );
        });
    });

    return result;
};

export namespace CellAnimationWeightUtils {
    /**
     * How far apart two cells are on each axis, as a count of cells.
     *
     * The grid-space counterpart of a point delta: both distances come back positive, so a caller asking
     * how far a cell is from the origin does not have to know which side of it the cell fell.
     *
     * @param from The cell to measure from.
     * @param to The cell to measure to.
     * @returns The row and column gaps, each `0` or more.
     */
    export const getCellDelta = (from: Index2d, to: Index2d): Index2d => ({
        row: Math.abs(to.row - from.row),
        col: Math.abs(to.col - from.col),
    });

    /**
     * The straight-line distance a cell delta stands for.
     *
     * @param delta A gap from {@link CellAnimationWeightUtils.getCellDelta}.
     * @returns The diagonal distance in cells, so a weight can fall off in rings rather than in squares.
     */
    export const getCellDistance = (delta: Index2d) => Math.hypot(delta.col, delta.row);

    /** How far a cell sits from the further of the two grid edges it lies between, on each axis. */
    const getFarthestEdge = (cell: Index2d, count: Index2d): Index2d => ({
        row: Math.max(count.row - 1 - cell.row, cell.row),
        col: Math.max(count.col - 1 - cell.col, cell.col),
    });

    /** Pulls a cell back inside the grid, leaving it alone if it already fits. */
    const getInsideGrid = (cell: Index2d, count: Index2d): Index2d => ({
        row: Math.max(Math.min(cell.row, count.row), 0),
        col: Math.max(Math.min(cell.col, count.col), 0),
    });

    export const WEIGHT_DECIMAL_PLACES = WEIGHT_ROUNDING_PLACES;

    export const MIN_MAX_DISTANCE = 1;

    export const toBounds = (count: Index2d): Size2d => ({ width: count.col, height: count.row });

    export const getMaxDistance = (origin: Index2d, count: Index2d): Index2d => {
        const farthest = getFarthestEdge(origin, count);

        return { col: Math.max(farthest.col, MIN_MAX_DISTANCE), row: Math.max(farthest.row, MIN_MAX_DISTANCE) };
    };

    export const getRowFlatIndex = (pos: Index2d, count: Index2d) => pos.row * count.col + pos.col;

    export const getColumnFlatIndex = (pos: Index2d, count: Index2d) => pos.col * count.row + pos.row;

    export const getDiagonalDelta = (origin: Index2d, pos: Index2d) => {
        const delta = { col: pos.col - origin.col, row: pos.row - origin.row };

        return { down: Math.abs(delta.col - delta.row), up: Math.abs(delta.col + delta.row) };
    };

    export const getMaxDiagonalDistance = (origin: Index2d, count: Index2d) => {
        const far = { col: count.col - 1 - origin.col, row: count.row - 1 - origin.row };

        return {
            down: Math.max(origin.col + far.row, far.col + origin.row, MIN_MAX_DISTANCE),
            up: Math.max(origin.col + origin.row, far.col + far.row, MIN_MAX_DISTANCE),
        };
    };

    export const getMaxDiagonalDistanceInBand = (
        origin: Index2d,
        count: Index2d,
        dist: { down: number; up: number },
    ) => {
        const fallingOrigin = origin.col - origin.row;
        const risingOrigin = origin.col + origin.row;

        const maxUpInFallingBand = (falling: number) =>
            getBandMax(
                Math.ceil(Math.max(0, falling)),
                Math.floor(Math.min(count.col - 1, count.row - 1 + falling)),
                (col) => Math.abs(2 * col - falling - risingOrigin),
            );

        const maxDownInRisingBand = (rising: number) =>
            getBandMax(
                Math.ceil(Math.max(0, rising - (count.row - 1))),
                Math.floor(Math.min(count.col - 1, rising)),
                (col) => Math.abs(2 * col - rising - fallingOrigin),
            );

        return {
            up: Math.max(
                maxUpInFallingBand(fallingOrigin + dist.down),
                maxUpInFallingBand(fallingOrigin - dist.down),
                MIN_MAX_DISTANCE,
            ),
            down: Math.max(
                maxDownInRisingBand(risingOrigin + dist.up),
                maxDownInRisingBand(risingOrigin - dist.up),
                MIN_MAX_DISTANCE,
            ),
        };
    };

    export const getMirroredPos = (pos: Index2d, origin: Index2d): Index2d => ({
        col: origin.col * 2 - pos.col,
        row: pos.row,
    });

    export const getRoundedPos = (pos: Index2d): Index2d => ({ col: Math.round(pos.col), row: Math.round(pos.row) });

    export const getSquareDistance = (dist: Index2d) => Math.max(dist.col, dist.row);

    export const getStretchedDistance = (dist: Index2d, maxDist: Index2d) =>
        Math.max(dist.col / maxDist.col, dist.row / maxDist.row) * Math.max(maxDist.col, maxDist.row);

    export const isEvenStretchedRing = (dist: Index2d, maxDist: Index2d) =>
        MathUtils.isEven(Math.round(getStretchedDistance(dist, maxDist)));

    export const fromOrderedIndex = (ordered: number, total: number) => (total <= 1 ? 1 : 1 - ordered / (total - 1));

    export const FIXED_HASH_SEED = FIXED_SEED;

    export const advanceRandomSeed = () => {
        randomSeed = Math.floor(Math.random() * HASH_RANGE);
    };

    export const getRandomSeed = () => randomSeed;

    export const hashToUnit = (col: number, row: number, seed: number) => {
        const mixed =
            Math.imul(col + HASH_OFFSET, HASH_MULTIPLIER_X) ^
            Math.imul(row + HASH_OFFSET, HASH_MULTIPLIER_Y) ^
            Math.imul(seed + HASH_OFFSET, HASH_MULTIPLIER_MIX);
        const folded = Math.imul(mixed ^ (mixed >>> HASH_LOW_SHIFT), HASH_MULTIPLIER_MIX);

        return ((folded ^ (folded >>> HASH_HIGH_SHIFT)) >>> 0) / HASH_RANGE;
    };

    export const interleaveBits = (col: number, row: number, bits: number) => {
        let result = 0;

        for (let bit = 0; bit < bits; bit++) {
            result |= ((col >> bit) & 1) << (bit * 2);
            result |= ((row >> bit) & 1) << (bit * 2 + 1);
        }

        return result;
    };

    export const greatestCommonDivisor = (a: number, b: number) => {
        let high = Math.max(a, b);
        let low = Math.min(a, b);

        while (low > 0) {
            const remainder = high % low;

            high = low;
            low = remainder;
        }

        return high;
    };

    export const stride = (index: number, originIndex: number, total: number) => {
        if (total <= 1) return 1;

        let step = Math.max(Math.round(total * GOLDEN_RATIO), 1);

        while (step > 1 && greatestCommonDivisor(step, total) !== 1) {
            step--;
        }

        return fromOrderedIndex((((index - originIndex + total) % total) * step) % total, total);
    };

    export const ripple = (spread: number, maxSpread: number, defs: RippleDefs) => {
        const { periodCells, travelRatio } = defs;

        const band = (Math.cos((spread / periodCells) * Math.PI * 2) + 1) * 0.5;
        const falloff = 1 - MathUtils.clamp01(spread / maxSpread);

        return MathUtils.lerp(band, falloff, travelRatio);
    };

    export const radar = (pos: Index2d, count: Index2d, origin: Index2d, defs: SweepDefs) => {
        const { quadrantsPerSection, clockDownMul, clockRightMul, clockUpMul, clockLeftMul } = defs;

        if (pos.col === origin.col && pos.row === origin.row) return 1;

        const maxDist = getMaxDistance(origin, count);
        const dist = getCellDelta(origin, pos);
        const maxWeight = Math.max(maxDist.col, maxDist.row) * 2 * quadrantsPerSection;
        const cellsInRing = Math.max(dist.col, dist.row) * 2;
        const sectionMaxWeight = maxWeight / quadrantsPerSection;
        const increment = sectionMaxWeight / cellsInRing;
        const cdo = sectionMaxWeight * clockDownMul;
        const cro = sectionMaxWeight * clockRightMul;
        const cuo = sectionMaxWeight * clockUpMul;
        const clo = sectionMaxWeight * clockLeftMul;

        let result = 0;

        if (dist.col === 0) {
            result = pos.row < origin.row ? cuo : cdo;
        } else if (dist.row === 0) {
            result = pos.col < origin.col ? clo : cro;
        } else if (pos.col > origin.col) {
            if (pos.row > origin.row) {
                result = cdo + (dist.col + Math.max(dist.col - dist.row, 0)) * increment;
            } else if (pos.row < origin.row) {
                result = cro + (dist.row + Math.max(dist.row - dist.col, 0)) * increment;
            }
        } else if (pos.col < origin.col) {
            if (pos.row < origin.row) {
                result = cuo + (dist.col + Math.max(dist.col - dist.row, 0)) * increment;
            } else if (pos.row > origin.row) {
                result = clo + (dist.row + Math.max(dist.row - dist.col, 0)) * increment;
            }
        }

        return 1 - result / (maxWeight - 1);
    };

    export const spiral = (pos: Index2d, count: Index2d, origin: Index2d, defs: SweepDefs) => {
        const { quadrantsPerSection, clockDownMul, clockRightMul, clockUpMul, clockLeftMul } = defs;

        if (pos.col === origin.col && pos.row === origin.row) return 1;

        const maxDist = getMaxDistance(origin, count);
        const dist = getCellDelta(origin, pos);
        const sectionDivider = 4 / quadrantsPerSection;
        const maxWeight = (Math.pow(Math.max(maxDist.col, maxDist.row) * 2 + 1, 2) - 1) / sectionDivider;
        const base = 1 - 1 / sectionDivider;
        const cdo = Math.pow(dist.row * 2 - 1, 2) / sectionDivider + dist.row * clockDownMul + base;
        const cro = Math.pow(dist.col * 2 - 1, 2) / sectionDivider + dist.col * clockRightMul + base;
        const cuo = Math.pow(dist.row * 2 - 1, 2) / sectionDivider + dist.row * clockUpMul + base;
        const clo = Math.pow(dist.col * 2 - 1, 2) / sectionDivider + dist.col * clockLeftMul + base;

        let result = 0;

        if (dist.col === 0) {
            result = pos.row < origin.row ? cuo : cdo;
        } else if (dist.row === 0) {
            result = pos.col < origin.col ? clo : cro;
        } else if (pos.col > origin.col) {
            if (pos.row > origin.row) {
                result = dist.row < dist.col ? cro - dist.row : cdo + dist.col;
            } else if (pos.row < origin.row) {
                result = dist.col < dist.row ? cuo - dist.col : cro + dist.row;
            }
        } else if (pos.col < origin.col) {
            if (pos.row < origin.row) {
                result = dist.row < dist.col ? clo - dist.row : cuo + dist.col;
            } else if (pos.row > origin.row) {
                result = dist.col < dist.row ? cdo - dist.col : clo + dist.row;
            }
        }

        return 1 - (result - 1) / maxWeight;
    };

    export const computeCellWeights = (compute: WeightFn, count: Index2d, origin: Index2d, opts?: WeightOpts) => {
        const boundOrigin = getInsideGrid(origin, count);

        advanceRandomSeed();

        let weights = Array.from({ length: Math.max(count.row, 0) }, (_, row) =>
            Array.from({ length: Math.max(count.col, 0) }, (_, col) =>
                MathUtils.roundToDecimalPlaces(
                    MathUtils.clamp01(compute({ col, row }, count, boundOrigin)),
                    WEIGHT_DECIMAL_PLACES,
                ),
            ),
        );

        if (opts?.shouldMakeUnique) weights = makeWeightsUnique(weights);
        if (opts?.shouldNormalize) weights = normalizeWeights(weights);

        return weights;
    };
}
