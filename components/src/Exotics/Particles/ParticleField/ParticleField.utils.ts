import { type Index2d, MathUtils, type Point2d, type Rect, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ParticleFieldCellDefs, ParticleFieldParticle } from "./ParticleField.types";

const HASH_MULTIPLIER_A = 0x85ebca6b;
const HASH_MULTIPLIER_B = 0xc2b2ae35;
const HASH_SHIFT_WIDE = 16;
const HASH_SHIFT_NARROW = 13;
const HASH_RANGE = 4294967296;
const DEFAULT_CELL_WEIGHT = 0;
const NO_EDGE_THICKNESSES = [0];
const NO_PARTICLES: ParticleFieldParticle[] = [];

let nextId = 0;

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
 * spawns at all, how far through its life a particle is, and the roster of particles alive at a point in the pass.
 *
 * The grid and the pass clock are `CellAnimationUtils`' own, shared rather than repeated.
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

    /**
     * The outline particles are kept inside, from the corners the consumer worked out.
     *
     * @param points The area's corners, or `undefined` for the whole field.
     * @param joinRadii How far each corner is rounded, as `Shape` takes it.
     * @param lameExponents How square or pinched each rounded corner is, as `Shape` takes it.
     * @returns The rounded outline's points, or `undefined` when there is no area to keep to.
     */
    export const computeOutline = (
        points: Point2d[] | undefined,
        joinRadii: number[] | undefined,
        lameExponents: number[] | undefined,
    ) => (points ? ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, joinRadii, lameExponents).outerOutline : undefined);

    /**
     * The cells that may spawn, in reading order.
     *
     * @param count The grid's size in cells, from `CellAnimationUtils.computeCellCount`.
     * @param size The field's size.
     * @param weights A weight per cell, by row then column. A cell with none counts as `0`.
     * @param outline From {@link computeOutline}. A cell whose center is outside it is left out.
     */
    export const computeCells = (
        count: Index2d,
        size: Size2d,
        weights: number[][],
        outline: Point2d[] | undefined,
    ): ParticleFieldCellDefs[] => {
        const cellSize = { width: size.width / count.col, height: size.height / count.row };
        const cells: ParticleFieldCellDefs[] = [];

        for (let row = 0; row < count.row; row++) {
            for (let col = 0; col < count.col; col++) {
                const rect = { x: col * cellSize.width, y: row * cellSize.height, ...cellSize };

                if (outline && !isPointInPolygon(toCenter(rect), outline)) continue;

                cells.push({
                    pos: { col, row },
                    count,
                    weight: weights[row]?.[col] ?? DEFAULT_CELL_WEIGHT,
                    size: cellSize,
                    rect,
                });
            }
        }

        return cells;
    };

    /**
     * Keeps the particles alive at a point in the pass, one per cell at most.
     *
     * Each refresh decides every cell afresh from the pass clock — whether its moment has come and gone, and whether
     * it wins its roll — so dragging through the pass shows the same particles each time. A particle that is still
     * alive is kept, with its id and its place, so a view keyed by id does not redraw it and a random place is asked
     * for once per spawn. A refresh for a different grid drops everything first, since a cell's key then names a
     * different cell.
     *
     * @param seed Which sequence of rolls this roster uses, as {@link computeRoll} takes it. Left out, a random one.
     * @returns `refresh`, `clear`, and `getParticles` for the list the last refresh settled on.
     */
    export const createRoster = (seed = Math.floor(Math.random() * HASH_RANGE)) => {
        let byCell = new Map<number, ParticleFieldParticle>();
        let particles = NO_PARTICLES;
        let grid: Index2d | undefined;

        const clear = () => {
            byCell = new Map();
            particles = NO_PARTICLES;
        };

        return {
            /**
             * Works out who is alive now.
             *
             * @param defs.count The grid's size in cells. A different one from last time drops every particle first.
             * @param defs.cells From {@link computeCells}.
             * @param defs.clockMs Where the pass's clock is.
             * @param defs.durationMs How long a pass takes.
             * @param defs.lifetimeMs How long a particle lives, already cut to the pass.
             * @param defs.spawnChance The chance a cell spawns in a pass.
             * @param defs.pass Which pass, counted from `0`.
             * @param defs.hasEnded Whether every pass is done, which leaves nobody alive.
             * @param defs.computeParticlePos Where a new particle sits. Left out, its cell's center.
             * @returns The particles, and whether the list is a different one from last time. While nobody spawned
             * or left, the list is the same array as before.
             */
            refresh: (defs: {
                count: Index2d;
                cells: ParticleFieldCellDefs[];
                clockMs: number;
                durationMs: number;
                lifetimeMs: number;
                spawnChance: number;
                pass: number;
                hasEnded: boolean;
                computeParticlePos?: (cell: ParticleFieldCellDefs) => Point2d;
            }) => {
                if (grid && (grid.col !== defs.count.col || grid.row !== defs.count.row)) clear();

                grid = defs.count;

                const next = new Map<number, ParticleFieldParticle>();

                let hasChanged = false;

                if (!defs.hasEnded) {
                    for (const cell of defs.cells) {
                        const spawnMs = computeBatchSpawnMs(cell.weight, defs.durationMs, defs.lifetimeMs);

                        if (defs.clockMs < spawnMs || defs.clockMs >= spawnMs + defs.lifetimeMs) continue;

                        const key = cell.pos.row * cell.count.col + cell.pos.col;

                        if (computeRoll(seed, defs.pass, key) >= defs.spawnChance) continue;

                        const existing = byCell.get(key);

                        if (existing) {
                            existing.spawnMs = spawnMs;
                            next.set(key, existing);
                        } else {
                            next.set(key, {
                                id: nextId++,
                                cell,
                                spawnMs,
                                pos: defs.computeParticlePos?.(cell) ?? toCenter(cell.rect),
                            });
                            hasChanged = true;
                        }
                    }
                }

                if (next.size !== byCell.size) hasChanged = true;

                byCell = next;

                if (hasChanged) particles = [...next.values()];

                return { particles, hasChanged };
            },
            /** Drops every particle, for a field starting over. */
            clear,
            /** The list the last refresh settled on. */
            getParticles: () => particles,
        };
    };
}
