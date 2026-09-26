import { MathUtils, type Point2d, type Rect } from "@thewaver/ss-utils";

const HASH_MULTIPLIER_A = 0x85ebca6b;
const HASH_MULTIPLIER_B = 0xc2b2ae35;
const HASH_SHIFT_WIDE = 16;
const HASH_SHIFT_NARROW = 13;
const HASH_RANGE = 4294967296;

const mix = (value: number) => {
    let hash = value | 0;

    hash ^= hash >>> HASH_SHIFT_WIDE;
    hash = Math.imul(hash, HASH_MULTIPLIER_A);
    hash ^= hash >>> HASH_SHIFT_NARROW;
    hash = Math.imul(hash, HASH_MULTIPLIER_B);
    hash ^= hash >>> HASH_SHIFT_WIDE;

    return hash >>> 0;
};

/**
 * The arithmetic behind a particle field: which cells lie inside its area, when a cell spawns in a pass, whether it
 * spawns at all, and how far through its life a particle is.
 */
export namespace ParticleFieldUtils {
    /**
     * The center of a box.
     *
     * @param rect The box.
     * @returns The point halfway across and halfway down it.
     */
    export const toCenter = (rect: Rect): Point2d => ({ x: rect.x + rect.width * 0.5, y: rect.y + rect.height * 0.5 });

    /**
     * Whether a point lies inside a closed outline.
     *
     * Casts a ray to the right of the point and counts how many edges it crosses; an odd count is inside. The outline
     * is closed from its last corner back to its first, and may be concave or cross itself — a crossing outline counts
     * its overlaps as outside, as SVG's `evenodd` rule does. A point exactly on an edge may come out either way.
     *
     * @param point The point to test.
     * @param outline The corners, in order.
     * @returns `false` when the outline has fewer than three corners, since that encloses nothing.
     */
    export const isPointInPolygon = (point: Point2d, outline: Point2d[]): boolean => {
        if (outline.length < 3) return false;

        let isInside = false;

        for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
            const a = outline[i];
            const b = outline[j];

            if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
                isInside = !isInside;
            }
        }

        return isInside;
    };

    /**
     * When a cell spawns within a pass, in milliseconds from the pass's start.
     *
     * The heaviest cell spawns at the start and the lightest late enough that its particle is removed exactly as the
     * pass ends, so every particle a pass spawns also finishes inside it. A lifetime as long as the pass, or longer,
     * leaves no room to stagger, and every cell spawns at the start. A weight outside `0` to `1` is clamped.
     *
     * @param weight The cell's weight.
     * @param durationMs How long the pass takes.
     * @param lifetimeMs How long one particle lives.
     * @returns The moment the cell spawns, `0` or more.
     */
    export const computeBatchSpawnMs = (weight: number, durationMs: number, lifetimeMs: number): number =>
        (1 - MathUtils.clamp01(weight)) * Math.max(durationMs - lifetimeMs, 0);

    /**
     * A die roll for one cell in one pass, the same every time it is asked.
     *
     * A field that spawns by chance has to decide each cell once per pass and keep to it: re-rolling as the pass is
     * redrawn would make particles flicker in and out while somebody drags through it. So the roll is a hash of the
     * three numbers that name the decision rather than a draw from `Math.random`, and a field wanting its own
     * sequence gives its own seed. The results spread evenly, so the share of rolls under a chance is that chance.
     *
     * @param seed Which sequence of rolls this is.
     * @param pass Which pass, counted from `0`.
     * @param key Which cell, as any whole number unique within the grid.
     * @returns A number from `0` up to but excluding `1`.
     */
    export const computeRoll = (seed: number, pass: number, key: number): number =>
        mix(mix(mix(seed) ^ pass) ^ key) / HASH_RANGE;

    /**
     * How far through its life a particle is.
     *
     * @param nowMs Where the pass's clock is.
     * @param spawnMs When the particle appeared, on the same clock.
     * @param lifetimeMs How long it lives. A lifetime of `0` or less is over as soon as it begins.
     * @returns `0` as it appears to `1` as it is removed, held at both ends.
     */
    export const computeLife = (nowMs: number, spawnMs: number, lifetimeMs: number): number =>
        lifetimeMs <= 0 ? 1 : MathUtils.clamp01((nowMs - spawnMs) / lifetimeMs);
}
