import { MathUtils, type Point2d, Point2dUtils, type Size2d } from "@thewaver/ss-utils";

import type { WeightFn, WeightOpts } from "./CellAnimationWeights.types";

export namespace CellAnimationWeightUtils {
    export const WEIGHT_DECIMAL_PLACES = 3;

    export const MIN_MAX_DISTANCE = 1;

    export const toBounds = (count: Point2d): Size2d => ({ width: count.x, height: count.y });

    export const getMaxDistance = (origin: Point2d, count: Point2d): Point2d => {
        const farthest = Point2dUtils.getFarthestBound(origin, toBounds(count));

        return { x: Math.max(farthest.x, MIN_MAX_DISTANCE), y: Math.max(farthest.y, MIN_MAX_DISTANCE) };
    };

    export const getRowFlatIndex = (pos: Point2d, count: Point2d) => pos.y * count.x + pos.x;

    export const getColumnFlatIndex = (pos: Point2d, count: Point2d) => pos.x * count.y + pos.y;

    export const getDiagonalDelta = (origin: Point2d, pos: Point2d) => {
        const delta = { x: pos.x - origin.x, y: pos.y - origin.y };

        return { down: Math.abs(delta.x - delta.y), up: Math.abs(delta.x + delta.y) };
    };

    export const getMaxDiagonalDistance = (origin: Point2d, count: Point2d) => {
        const far = { x: count.x - 1 - origin.x, y: count.y - 1 - origin.y };

        return {
            down: Math.max(origin.x + far.y, far.x + origin.y, MIN_MAX_DISTANCE),
            up: Math.max(origin.x + origin.y, far.x + far.y, MIN_MAX_DISTANCE),
        };
    };

    const getBandMax = (from: number, to: number, distanceAt: (index: number) => number) =>
        to < from ? 0 : Math.max(distanceAt(from), distanceAt(to));

    export const getMaxDiagonalDistanceInBand = (
        origin: Point2d,
        count: Point2d,
        dist: { down: number; up: number },
    ) => {
        const fallingOrigin = origin.x - origin.y;
        const risingOrigin = origin.x + origin.y;

        const maxUpInFallingBand = (falling: number) =>
            getBandMax(Math.ceil(Math.max(0, falling)), Math.floor(Math.min(count.x - 1, count.y - 1 + falling)), (x) =>
                Math.abs(2 * x - falling - risingOrigin),
            );

        const maxDownInRisingBand = (rising: number) =>
            getBandMax(Math.ceil(Math.max(0, rising - (count.y - 1))), Math.floor(Math.min(count.x - 1, rising)), (x) =>
                Math.abs(2 * x - rising - fallingOrigin),
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

    export const getMirroredPos = (pos: Point2d, origin: Point2d): Point2d => ({ x: origin.x * 2 - pos.x, y: pos.y });

    export const getRoundedPos = (pos: Point2d): Point2d => ({ x: Math.round(pos.x), y: Math.round(pos.y) });

    export const getSquareDistance = (dist: Point2d) => Math.max(dist.x, dist.y);

    export const getStretchedDistance = (dist: Point2d, maxDist: Point2d) =>
        Math.max(dist.x / maxDist.x, dist.y / maxDist.y) * Math.max(maxDist.x, maxDist.y);

    export const isEvenStretchedRing = (dist: Point2d, maxDist: Point2d) =>
        MathUtils.isEven(Math.round(getStretchedDistance(dist, maxDist)));

    export const fromOrderedIndex = (ordered: number, total: number) => (total <= 1 ? 1 : 1 - ordered / (total - 1));

    const HASH_OFFSET = 1;

    const HASH_MULTIPLIER_X = 374761393;

    const HASH_MULTIPLIER_Y = 668265263;

    const HASH_MULTIPLIER_MIX = 1274126177;

    const HASH_LOW_SHIFT = 13;

    const HASH_HIGH_SHIFT = 16;

    const HASH_RANGE = 4294967296;

    export const FIXED_HASH_SEED = 0;

    let randomSeed = FIXED_HASH_SEED;

    export const advanceRandomSeed = () => {
        randomSeed = Math.floor(Math.random() * HASH_RANGE);
    };

    export const getRandomSeed = () => randomSeed;

    export const hashToUnit = (x: number, y: number, seed: number) => {
        const mixed =
            Math.imul(x + HASH_OFFSET, HASH_MULTIPLIER_X) ^
            Math.imul(y + HASH_OFFSET, HASH_MULTIPLIER_Y) ^
            Math.imul(seed + HASH_OFFSET, HASH_MULTIPLIER_MIX);
        const folded = Math.imul(mixed ^ (mixed >>> HASH_LOW_SHIFT), HASH_MULTIPLIER_MIX);

        return ((folded ^ (folded >>> HASH_HIGH_SHIFT)) >>> 0) / HASH_RANGE;
    };

    export const interleaveBits = (x: number, y: number, bits: number) => {
        let result = 0;

        for (let bit = 0; bit < bits; bit++) {
            result |= ((x >> bit) & 1) << (bit * 2);
            result |= ((y >> bit) & 1) << (bit * 2 + 1);
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

    const GOLDEN_RATIO = 0.6180339887498949;

    export const stride = (index: number, originIndex: number, total: number) => {
        if (total <= 1) return 1;

        let step = Math.max(Math.round(total * GOLDEN_RATIO), 1);

        while (step > 1 && greatestCommonDivisor(step, total) !== 1) {
            step--;
        }

        return fromOrderedIndex((((index - originIndex + total) % total) * step) % total, total);
    };

    export const ripple = (spread: number, maxSpread: number, periodCells: number, travelRatio: number) => {
        const band = (Math.cos((spread / periodCells) * Math.PI * 2) + 1) * 0.5;
        const falloff = 1 - MathUtils.clamp01(spread / maxSpread);

        return MathUtils.lerp(band, falloff, travelRatio);
    };

    export const radar = (
        pos: Point2d,
        count: Point2d,
        origin: Point2d,
        quadrantsPerSection: number,
        cdoMul: number,
        croMul: number,
        cuoMul: number,
        cloMul: number,
    ) => {
        if (pos.x === origin.x && pos.y === origin.y) return 1;

        const maxDist = getMaxDistance(origin, count);
        const dist = Point2dUtils.getDelta(origin, pos);
        const maxWeight = Math.max(maxDist.x, maxDist.y) * 2 * quadrantsPerSection;
        const cellsInRing = Math.max(dist.x, dist.y) * 2;
        const sectionMaxWeight = maxWeight / quadrantsPerSection;
        const increment = sectionMaxWeight / cellsInRing;
        const cdo = sectionMaxWeight * cdoMul;
        const cro = sectionMaxWeight * croMul;
        const cuo = sectionMaxWeight * cuoMul;
        const clo = sectionMaxWeight * cloMul;

        let result = 0;

        if (dist.x === 0) {
            result = pos.y < origin.y ? cuo : cdo;
        } else if (dist.y === 0) {
            result = pos.x < origin.x ? clo : cro;
        } else if (pos.x > origin.x) {
            if (pos.y > origin.y) {
                result = cdo + (dist.x + Math.max(dist.x - dist.y, 0)) * increment;
            } else if (pos.y < origin.y) {
                result = cro + (dist.y + Math.max(dist.y - dist.x, 0)) * increment;
            }
        } else if (pos.x < origin.x) {
            if (pos.y < origin.y) {
                result = cuo + (dist.x + Math.max(dist.x - dist.y, 0)) * increment;
            } else if (pos.y > origin.y) {
                result = clo + (dist.y + Math.max(dist.y - dist.x, 0)) * increment;
            }
        }

        return 1 - result / (maxWeight - 1);
    };

    export const spiral = (
        pos: Point2d,
        count: Point2d,
        origin: Point2d,
        quadrantsPerSection: number,
        cdoMul: number,
        croMul: number,
        cuoMul: number,
        cloMul: number,
    ) => {
        if (pos.x === origin.x && pos.y === origin.y) return 1;

        const maxDist = getMaxDistance(origin, count);
        const dist = Point2dUtils.getDelta(origin, pos);
        const sectionDivider = 4 / quadrantsPerSection;
        const maxWeight = (Math.pow(Math.max(maxDist.x, maxDist.y) * 2 + 1, 2) - 1) / sectionDivider;
        const base = 1 - 1 / sectionDivider;
        const cdo = Math.pow(dist.y * 2 - 1, 2) / sectionDivider + dist.y * cdoMul + base;
        const cro = Math.pow(dist.x * 2 - 1, 2) / sectionDivider + dist.x * croMul + base;
        const cuo = Math.pow(dist.y * 2 - 1, 2) / sectionDivider + dist.y * cuoMul + base;
        const clo = Math.pow(dist.x * 2 - 1, 2) / sectionDivider + dist.x * cloMul + base;

        let result = 0;

        if (dist.x === 0) {
            result = pos.y < origin.y ? cuo : cdo;
        } else if (dist.y === 0) {
            result = pos.x < origin.x ? clo : cro;
        } else if (pos.x > origin.x) {
            if (pos.y > origin.y) {
                result = dist.y < dist.x ? cro - dist.y : cdo + dist.x;
            } else if (pos.y < origin.y) {
                result = dist.x < dist.y ? cuo - dist.x : cro + dist.y;
            }
        } else if (pos.x < origin.x) {
            if (pos.y < origin.y) {
                result = dist.y < dist.x ? clo - dist.y : cuo + dist.x;
            } else if (pos.y > origin.y) {
                result = dist.x < dist.y ? cdo - dist.x : clo + dist.y;
            }
        }

        return 1 - (result - 1) / maxWeight;
    };

    const getIndexedWeights = (weights: number[][]) => {
        const indexed = new Map<number, Point2d[]>();

        for (let y = 0; y < weights.length; y++) {
            for (let x = 0; x < weights[y].length; x++) {
                const weight = weights[y][x];
                const bucket = indexed.get(weight);

                if (bucket) {
                    bucket.push({ x, y });
                } else {
                    indexed.set(weight, [{ x, y }]);
                }
            }
        }

        return indexed;
    };

    const getOrderedKeys = (indexed: Map<number, Point2d[]>) => [...indexed.keys()].sort((a, b) => a - b);

    const normalizeWeights = (weights: number[][]) => {
        const indexed = getIndexedWeights(weights);
        const orderedKeys = getOrderedKeys(indexed);

        if (orderedKeys.length <= 1) return weights;

        const result = weights.map((row) => [...row]);

        orderedKeys.forEach((key, keyIdx) => {
            for (const pos of indexed.get(key)!) {
                result[pos.y][pos.x] = MathUtils.roundToDecimalPlaces(
                    keyIdx / (orderedKeys.length - 1),
                    WEIGHT_DECIMAL_PLACES,
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
                result[pos.y][pos.x] = MathUtils.roundToDecimalPlaces(
                    (weights[pos.y][pos.x] + (posIdx / bucket.length) * gap) / maxWeight,
                    WEIGHT_DECIMAL_PLACES,
                );
            });
        });

        return result;
    };

    export const computeCellWeights = (compute: WeightFn, count: Point2d, origin: Point2d, opts?: WeightOpts) => {
        const boundOrigin = Point2dUtils.getBoundPoint(origin, toBounds(count));

        advanceRandomSeed();

        let weights = Array.from({ length: Math.max(count.y, 0) }, (_, y) =>
            Array.from({ length: Math.max(count.x, 0) }, (_, x) =>
                MathUtils.roundToDecimalPlaces(
                    MathUtils.clamp01(compute({ x, y }, count, boundOrigin)),
                    WEIGHT_DECIMAL_PLACES,
                ),
            ),
        );

        if (opts?.shouldMakeUnique) weights = makeWeightsUnique(weights);
        if (opts?.shouldNormalize) weights = normalizeWeights(weights);

        return weights;
    };
}
