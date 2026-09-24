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

/**
 * Works out each cell's weight in a cell animation — the number that decides when its turn comes.
 *
 * A weight is a value from `0` to `1` per cell, and the animation plays heavy cells first. These are the
 * arithmetic weights are made from — distances from an origin measured in several ways, orderings, a seeded
 * hash for a random order that stays put between renders — and a few shapes built from them, such as a
 * ripple, a radar sweep and a spiral. {@link computeCellWeights} runs a weight function over a whole grid.
 */
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

    /** How many decimal places a weight is rounded to, so weights that should tie really do. */
    export const WEIGHT_DECIMAL_PLACES = WEIGHT_ROUNDING_PLACES;

    /**
     * The smallest a largest distance is allowed to be.
     *
     * Weights are distances divided by the largest distance on the grid, and on a grid one cell wide that
     * largest distance is `0`. Holding it at `1` keeps the division meaningful rather than dividing by nothing.
     */
    export const MIN_MAX_DISTANCE = 1;

    /**
     * A grid's cell count read as a size, columns across and rows down.
     *
     * @param count The number of columns and rows.
     * @returns The same numbers as a width and a height.
     */
    export const toBounds = (count: Index2d): Size2d => ({ width: count.col, height: count.row });

    /**
     * How far the farthest edge of the grid is from the origin, on each axis.
     *
     * This is what a distance is divided by to become a weight, so each axis is held at
     * {@link MIN_MAX_DISTANCE} or more.
     *
     * @param origin The cell the weights are measured from.
     * @param count The number of columns and rows.
     * @returns The column and row distances to the farthest edge.
     */
    export const getMaxDistance = (origin: Index2d, count: Index2d): Index2d => {
        const farthest = getFarthestEdge(origin, count);

        return { col: Math.max(farthest.col, MIN_MAX_DISTANCE), row: Math.max(farthest.row, MIN_MAX_DISTANCE) };
    };

    /**
     * A cell's position when the grid is read row by row, left to right and top to bottom.
     *
     * @param pos The cell.
     * @param count The number of columns and rows.
     * @returns Its index in that reading order, from `0`.
     */
    export const getRowFlatIndex = (pos: Index2d, count: Index2d) => pos.row * count.col + pos.col;

    /**
     * A cell's position when the grid is read column by column, top to bottom and left to right.
     *
     * @param pos The cell.
     * @param count The number of columns and rows.
     * @returns Its index in that reading order, from `0`.
     */
    export const getColumnFlatIndex = (pos: Index2d, count: Index2d) => pos.col * count.row + pos.row;

    /**
     * How far a cell is from the two diagonals that cross at the origin.
     *
     * `down` is the distance from the diagonal running from top left to bottom right, and `up` from the one
     * running from bottom left to top right, both counted in cell steps. A cell on either diagonal is `0` from
     * it, which is what a weight falling off in diagonal bands is measured by.
     *
     * @param origin The cell the diagonals cross at.
     * @param pos The cell to measure.
     * @returns The two distances.
     */
    export const getDiagonalDelta = (origin: Index2d, pos: Index2d) => {
        const delta = { col: pos.col - origin.col, row: pos.row - origin.row };

        return { down: Math.abs(delta.col - delta.row), up: Math.abs(delta.col + delta.row) };
    };

    /**
     * The largest distance any cell on the grid is from each of the origin's diagonals.
     *
     * The diagonal counterpart of {@link getMaxDistance}, held at {@link MIN_MAX_DISTANCE} or more for the same
     * reason.
     *
     * @param origin The cell the diagonals cross at.
     * @param count The number of columns and rows.
     * @returns The largest `down` and `up` distances.
     */
    export const getMaxDiagonalDistance = (origin: Index2d, count: Index2d) => {
        const far = { col: count.col - 1 - origin.col, row: count.row - 1 - origin.row };

        return {
            down: Math.max(origin.col + far.row, far.col + origin.row, MIN_MAX_DISTANCE),
            up: Math.max(origin.col + origin.row, far.col + far.row, MIN_MAX_DISTANCE),
        };
    };

    /**
     * The largest distance along one diagonal, among the cells that share a cell's distance from the other.
     *
     * The cells the same distance from one diagonal form a band, and a weight that sweeps along the band needs
     * the band's own length to divide by rather than the whole grid's — a band clipped short by the grid's corner
     * would otherwise never reach its lightest weight. Both answers are held at {@link MIN_MAX_DISTANCE} or more.
     *
     * @param origin The cell the diagonals cross at.
     * @param count The number of columns and rows.
     * @param dist The cell's own distances, from {@link getDiagonalDelta}.
     * @returns For the band the cell is in on each diagonal, the largest distance along the other.
     */
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

    /**
     * A cell reflected across the origin's column, left for right.
     *
     * @param pos The cell.
     * @param origin The cell whose column is the mirror.
     * @returns The reflected cell, on the same row.
     */
    export const getMirroredPos = (pos: Index2d, origin: Index2d): Index2d => ({
        col: origin.col * 2 - pos.col,
        row: pos.row,
    });

    /**
     * A cell with both coordinates rounded to whole cells, for an origin placed between cells.
     *
     * @param pos The cell.
     * @returns The nearest whole cell.
     */
    export const getRoundedPos = (pos: Index2d): Index2d => ({ col: Math.round(pos.col), row: Math.round(pos.row) });

    /**
     * The distance at which cells form square rings round the origin: the larger of the two axis gaps.
     *
     * @param dist A gap from {@link getCellDelta}.
     * @returns The ring the cell is on, `0` at the origin.
     */
    export const getSquareDistance = (dist: Index2d) => Math.max(dist.col, dist.row);

    /**
     * A square-ring distance with each axis stretched to fill the grid, so the rings follow the grid's shape.
     *
     * On a grid wider than it is tall, square rings run out of rows before columns, and the last rings are only
     * strips down each side. Measuring each axis against its own farthest edge first makes the rings rectangles
     * that reach every edge at the same time.
     *
     * @param dist A gap from {@link getCellDelta}.
     * @param maxDist The farthest edge on each axis, from {@link getMaxDistance}.
     * @returns The stretched distance, on the scale of the longer axis.
     */
    export const getStretchedDistance = (dist: Index2d, maxDist: Index2d) =>
        Math.max(dist.col / maxDist.col, dist.row / maxDist.row) * Math.max(maxDist.col, maxDist.row);

    /**
     * Whether a cell is on an even-numbered ring, counting the stretched rings of {@link getStretchedDistance}.
     *
     * @param dist A gap from {@link getCellDelta}.
     * @param maxDist The farthest edge on each axis, from {@link getMaxDistance}.
     * @returns `true` on rings `0`, `2`, `4` and so on.
     */
    export const isEvenStretchedRing = (dist: Index2d, maxDist: Index2d) =>
        MathUtils.isEven(Math.round(getStretchedDistance(dist, maxDist)));

    /**
     * Turns a place in an order into a weight: the first place is `1` and the last is `0`, evenly between.
     *
     * An order of one item gives `1`, so a single cell still goes first rather than dividing by nothing.
     *
     * @param ordered The place, from `0`.
     * @param total How many places there are.
     * @returns The weight for that place.
     */
    export const fromOrderedIndex = (ordered: number, total: number) => (total <= 1 ? 1 : 1 - ordered / (total - 1));

    /** A seed that gives the same random order every time, for a weight that should look random but hold still. */
    export const FIXED_HASH_SEED = FIXED_SEED;

    /**
     * Picks a new seed for the random orders, which {@link computeCellWeights} does once per run.
     *
     * Every cell in one run reads the same seed, so they agree on a single order; the next run gets a different
     * one.
     */
    export const advanceRandomSeed = () => {
        randomSeed = Math.floor(Math.random() * HASH_RANGE);
    };

    /**
     * The seed the current run is using.
     *
     * @returns The seed {@link advanceRandomSeed} picked last, or {@link FIXED_HASH_SEED} before the first run.
     */
    export const getRandomSeed = () => randomSeed;

    /**
     * A random-looking number for a cell that is the same every time it is asked for.
     *
     * The same cell and seed always give the same answer, and neighboring cells give unrelated ones, which is
     * what a random order needs to survive a re-render without reshuffling.
     *
     * @param col The cell's column.
     * @param row The cell's row.
     * @param seed The seed, from {@link getRandomSeed} or {@link FIXED_HASH_SEED}.
     * @returns A number from `0` up to but not including `1`.
     */
    export const hashToUnit = (col: number, row: number, seed: number) => {
        const mixed =
            Math.imul(col + HASH_OFFSET, HASH_MULTIPLIER_X) ^
            Math.imul(row + HASH_OFFSET, HASH_MULTIPLIER_Y) ^
            Math.imul(seed + HASH_OFFSET, HASH_MULTIPLIER_MIX);
        const folded = Math.imul(mixed ^ (mixed >>> HASH_LOW_SHIFT), HASH_MULTIPLIER_MIX);

        return ((folded ^ (folded >>> HASH_HIGH_SHIFT)) >>> 0) / HASH_RANGE;
    };

    /**
     * Interleaves the bits of a column and a row into one number, which orders cells along a Z-shaped curve.
     *
     * Reading cells in the order of this number visits them in ever larger squares, each finished before the
     * next is started, so nearby cells stay close in the order.
     *
     * @param col The cell's column.
     * @param row The cell's row.
     * @param bits How many bits of each to use, enough for the largest column or row.
     * @returns The interleaved number.
     */
    export const interleaveBits = (col: number, row: number, bits: number) => {
        let result = 0;

        for (let bit = 0; bit < bits; bit++) {
            result |= ((col >> bit) & 1) << (bit * 2);
            result |= ((row >> bit) & 1) << (bit * 2 + 1);
        }

        return result;
    };

    /**
     * The largest whole number both numbers divide by.
     *
     * @param a One number.
     * @param b The other.
     * @returns Their greatest common divisor.
     */
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

    /**
     * A weight that visits every item exactly once, in an order that jumps around rather than walking.
     *
     * It steps through the items by a fixed stride — close to the golden ratio of the total, which spreads the
     * visits evenly, and adjusted until it shares no divisor with the total, which is what guarantees every item
     * is reached before any repeats. The order starts at the origin's item.
     *
     * @param index The item's place in a reading order.
     * @param originIndex The origin's place in the same order.
     * @param total How many items there are.
     * @returns The item's weight.
     */
    export const stride = (index: number, originIndex: number, total: number) => {
        if (total <= 1) return 1;

        let step = Math.max(Math.round(total * GOLDEN_RATIO), 1);

        while (step > 1 && greatestCommonDivisor(step, total) !== 1) {
            step--;
        }

        return fromOrderedIndex((((index - originIndex + total) % total) * step) % total, total);
    };

    /**
     * A weight that rises and falls in bands moving out from the origin, like a ripple.
     *
     * The bands are `periodCells` wide. `travelRatio` blends between two extremes: at `0` the bands are
     * standing, every crest going at once, and at `1` the ripple is only a falloff, nearest first.
     *
     * @param spread The cell's distance from the origin.
     * @param maxSpread The largest distance on the grid.
     * @param defs The band width and the blend.
     * @returns The cell's weight.
     */
    export const ripple = (spread: number, maxSpread: number, defs: RippleDefs) => {
        const { periodCells, travelRatio } = defs;

        const band = (Math.cos((spread / periodCells) * Math.PI * 2) + 1) * 0.5;
        const falloff = 1 - MathUtils.clamp01(spread / maxSpread);

        return MathUtils.lerp(band, falloff, travelRatio);
    };

    /**
     * A weight that sweeps round the origin like the hand of a radar, one ring at a time.
     *
     * `quadrantsPerSection` is how many quarters of the turn one sweep covers, so `1` sends four hands out at
     * once and `4` one hand all the way round; the four multipliers set where each part of the sweep starts. The
     * origin itself always goes first.
     *
     * @param pos The cell.
     * @param count The number of columns and rows.
     * @param origin The cell the sweep turns about.
     * @param defs How many sweeps there are and where each starts.
     * @returns The cell's weight.
     */
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

    /**
     * A weight that winds outward from the origin in a square spiral.
     *
     * It takes the same settings as {@link radar}, with the same meaning, but walks each ring in turn rather than
     * sweeping all of them together, so the order reads as one continuous line. The origin always goes first.
     *
     * @param pos The cell.
     * @param count The number of columns and rows.
     * @param origin The cell the spiral starts from.
     * @param defs How many arms there are and where each starts.
     * @returns The cell's weight.
     */
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

    /**
     * Runs a weight function over a whole grid, which is the one call a cell animation's weights come from.
     *
     * Each weight is clamped to `0` to `1` and rounded to {@link WEIGHT_DECIMAL_PLACES}; an origin outside the
     * grid is pulled back inside it first; and the random seed moves on once, so a random weight gives a new
     * order each run. Two options reshape the result. `shouldMakeUnique` spreads cells that share a weight across
     * the gap to the next one, so no two go at exactly the same moment. `shouldNormalize` spaces the distinct
     * weights evenly from `0` to `1` by rank, so a weight that bunches up still uses the whole timeline.
     *
     * @param compute The weight function to run for each cell.
     * @param count The number of columns and rows.
     * @param origin The cell the weights are measured from.
     * @param opts Whether to break ties and whether to even out the spacing.
     * @returns The weights, row by row.
     */
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
