import { MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type { PointerReading } from "../../../Abstracts/PointerTracker/PointerTracker.types";
import type { PatternProximityOpts } from "../SVGDefs.types";
import { SVGPatternLayouts } from "../SVGPatternLayouts.const";
import type { SVGPatternCellCount, SVGPatternCellIndex, SVGPatternKind } from "../SVGPatternLayouts.types";

const TILE_CELL_COUNT: SVGPatternCellCount = { rows: 8, cols: 8 };
const MIN_COUNT = 1;
const FULL_LEVEL = 1;
const NO_TRAIL_MS = 0;
const NO_RETENTION_MS = 0;

/** A cell's brightest recent level and when it was reached, which its trail fades from. */
type TrailMark = { level: number; litMs: number };

/**
 * The arithmetic behind a pattern whose cells answer to the pointer rather than to a clock: how many cells to draw,
 * where the pointer is in the pattern's own units, and how strongly each cell reacts. Drawing the cells, and what a
 * cell does with its level, are each framework's and each sample's.
 */
export namespace TrackedPatternUtils {
    /**
     * A sample's options with its own defaults filled in, in the shape {@link computeLevel} reads.
     *
     * @param opts What the consumer passed, if anything.
     * @param defaults The sample's defaults, from `TrackedPatternDefaults`.
     * @returns Every option resolved, with `tiled` renamed `isTiled`.
     */
    export const resolveOpts = (opts: PatternProximityOpts | undefined, defaults: Required<PatternProximityOpts>) => ({
        isTiled: opts?.tiled ?? defaults.tiled,
        reach: opts?.reach ?? defaults.reach,
        restLevel: opts?.restLevel ?? defaults.restLevel,
        trailMs: opts?.trailMs ?? defaults.trailMs,
        retentionMs: opts?.retentionMs ?? defaults.retentionMs,
    });

    /**
     * Whether a sample's cells remember the pointer once it has passed: held where it left them for `retentionMs`,
     * then fading back to rest over `trailMs`.
     *
     * @param opts The resolved options, from {@link resolveOpts}.
     * @returns `false` when both are `0`, so a cell shows its live level and nothing has to run between pointer moves.
     */
    export const getHasTrail = (opts: { trailMs: number; retentionMs: number }) =>
        opts.trailMs > NO_TRAIL_MS || opts.retentionMs > NO_RETENTION_MS;

    /**
     * How long a cell can go on changing after the pointer last moved: the hold and the fade together.
     *
     * A clock driving the trail has to keep ticking for this long after it was last woken, or a held cell would never
     * start to fade.
     *
     * @param opts The resolved options, from {@link resolveOpts}.
     */
    export const getTrailSpanMs = (opts: { trailMs: number; retentionMs: number }) =>
        Math.max(opts.retentionMs, NO_RETENTION_MS) + Math.max(opts.trailMs, NO_TRAIL_MS);

    /**
     * How much of a remembered level is left at a moment, from `1` while it is held down to `0` once it has faded.
     *
     * The level is held whole for `retentionMs` after it was reached, then falls away over `trailMs`, easing out. With
     * no fade it drops straight to nothing the moment the hold ends.
     *
     * @param elapsedMs How long ago the level was reached.
     * @param opts.trailMs How long the fade takes.
     * @param opts.retentionMs How long the level is held before the fade begins.
     */
    export const computeTrailShare = (elapsedMs: number, opts: { trailMs: number; retentionMs: number }) => {
        const fadingMs = elapsedMs - Math.max(opts.retentionMs, NO_RETENTION_MS);

        if (fadingMs <= 0) return FULL_LEVEL;
        if (opts.trailMs <= NO_TRAIL_MS) return 0;

        return (1 - MathUtils.clamp01(fadingMs / opts.trailMs)) ** 2;
    };

    /**
     * Remembers how brightly each cell was lit, so a cell the pointer has left keeps its glow for a while.
     *
     * A cell's shown level is the higher of its live level, from {@link computeLevel}, and what is left of the
     * brightest level it reached recently: held there for `retentionMs`, then falling back to rest over `trailMs`, as
     * {@link computeTrailShare} gives it. Only the cooling waits — a live level above what is remembered shows at once
     * and becomes the new memory. The memory is kept by the key the caller gives each cell, so a repeating tile's
     * copies share one trail.
     *
     * @returns `computeLevel`, which takes a cell's key, its live level, the frame time and the resolved options,
     * records the live level when it is the brighter, and answers the level to draw.
     */
    export const createTrail = () => {
        const marks = new Map<string, TrailMark>();

        const computeTrailLevel = (
            key: string,
            liveLevel: number,
            nowMs: number,
            opts: { trailMs: number; retentionMs: number; restLevel: number },
        ) => {
            const { restLevel } = opts;
            const mark = marks.get(key);
            const fading = mark
                ? MathUtils.lerp(restLevel, mark.level, computeTrailShare(nowMs - mark.litMs, opts))
                : restLevel;

            if (liveLevel >= fading && liveLevel > restLevel) marks.set(key, { level: liveLevel, litMs: nowMs });

            return Math.max(liveLevel, fading);
        };

        return { computeLevel: computeTrailLevel };
    };

    /**
     * The fewest cells of a layout whose single tile reaches across a whole area.
     *
     * A pattern drawn this way never repeats inside the area it paints, so a cell lit by the pointer is lit once. The
     * price is that the count follows the area: small cells over a large area mean many cells.
     *
     * @param kind The layout the cells are placed by. Its own rounding is taken into account, so a layout that
     * only repeats on an even count is asked for one that still reaches.
     * @param cellSize One cell's size.
     * @param areaSize The area the tile has to cover.
     * @returns The request to hand the layout, in cells across and down, at least one either way. The layout turns
     * it into the count it draws.
     */
    export const computeCoveringCellCount = (
        kind: SVGPatternKind,
        cellSize: Size2d,
        areaSize: Size2d,
    ): SVGPatternCellCount => {
        const layout = SVGPatternLayouts.ALL[kind];
        const computeTileSize = (count: SVGPatternCellCount) =>
            layout.computePatternSize(layout.computeCellCount(count), cellSize);

        let cols = cellSize.width > 0 ? Math.max(MIN_COUNT, Math.floor(areaSize.width / cellSize.width)) : MIN_COUNT;
        let rows = cellSize.height > 0 ? Math.max(MIN_COUNT, Math.floor(areaSize.height / cellSize.height)) : MIN_COUNT;

        while (cellSize.width > 0 && computeTileSize({ rows: MIN_COUNT, cols }).width < areaSize.width) cols += 1;
        while (cellSize.height > 0 && computeTileSize({ rows, cols: MIN_COUNT }).height < areaSize.height) rows += 1;

        return { rows, cols };
    };

    /**
     * How many cells a tracked pattern draws.
     *
     * @param kind The layout the cells are placed by.
     * @param isTiled `true` to draw the same fixed tile the timed patterns draw and let it repeat, so every copy
     * reacts to the pointer at once; `false` to draw one tile covering the whole area, see
     * {@link computeCoveringCellCount}.
     * @param cellSize One cell's size.
     * @param areaSize The area being painted.
     * @returns The request to hand the layout, in cells across and down.
     */
    export const computeCellCount = (
        kind: SVGPatternKind,
        isTiled: boolean,
        cellSize: Size2d,
        areaSize: Size2d,
    ): SVGPatternCellCount => (isTiled ? TILE_CELL_COUNT : computeCoveringCellCount(kind, cellSize, areaSize));

    /**
     * Where the pointer is, in the units a pattern filling the area is drawn in.
     *
     * @param reading The pointer's reading against the painted element.
     * @param isPointerPresent Whether the pointer is over the window at all.
     * @param areaSize The painted element's size.
     * @returns The point, measured from the element's top-left corner, or `undefined` while the pointer is away, so
     * every cell falls back to rest.
     */
    export const computePointerPoint = (
        reading: PointerReading,
        isPointerPresent: boolean,
        areaSize: Size2d,
    ): Point2d | undefined =>
        isPointerPresent
            ? { x: reading.boxRatio.x * areaSize.width, y: reading.boxRatio.y * areaSize.height }
            : undefined;

    /**
     * How strongly one cell reacts to the pointer, from its rest level up to `1`.
     *
     * Distance is measured from the cell's center in cells rather than in pixels, so the reach keeps its meaning as
     * the cell size changes and stays round on cells that are not square. The level eases in rather than rising in a
     * straight line, so the edge of the lit area is soft. On a repeating tile the distance is taken to the nearest copy
     * of the pointer, which is what makes the cells at one edge of a tile answer to a pointer just past the other.
     *
     * @param kind The layout the cell is placed by.
     * @param index The cell's place in the grid.
     * @param cellCount The grid's size, which sets the tile's size on a repeating tile.
     * @param cellSize One cell's size.
     * @param pointer The pointer, from {@link computePointerPoint}.
     * @param opts.isTiled Whether the tile repeats.
     * @param opts.reach How many cells away from the pointer a cell still reacts.
     * @param opts.restLevel The level of a cell out of reach, `0`–`1`.
     * @returns `opts.restLevel` out of reach or with no pointer, `1` with the pointer on the cell's center.
     */
    export const computeLevel = (
        kind: SVGPatternKind,
        index: SVGPatternCellIndex,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        pointer: Point2d | undefined,
        opts: { isTiled: boolean; reach: number; restLevel: number },
    ) => {
        if (!pointer || opts.reach <= 0 || cellSize.width <= 0 || cellSize.height <= 0) return opts.restLevel;

        const layout = SVGPatternLayouts.ALL[kind];
        const pos = layout.computeCellPos(index, cellSize);
        const tileSize = layout.computePatternSize(cellCount, cellSize);
        const wrap = (delta: number, period: number) =>
            opts.isTiled && period > 0 ? delta - Math.round(delta / period) * period : delta;
        const dx = wrap(pos.x + cellSize.width * 0.5 - pointer.x, tileSize.width) / cellSize.width;
        const dy = wrap(pos.y + cellSize.height * 0.5 - pointer.y, tileSize.height) / cellSize.height;
        const nearness = MathUtils.clamp01(1 - Math.hypot(dx, dy) / opts.reach);

        return MathUtils.lerp(opts.restLevel, FULL_LEVEL, nearness * nearness * (3 - 2 * nearness));
    };
}
