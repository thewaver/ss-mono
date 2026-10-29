import type { Index2d, Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { SliceAnimationRenderer } from "../../../Abstracts/SliceAnimation/SliceAnimation.types";
import type { SliceAnimationFn } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";

export type ParticleFieldCellDefs = {
    pos: Index2d;
    count: Index2d;
    weight: number;
    size: Size2d;
    rect: Rect;
};

export type ParticleFieldParticle = {
    /** Unique across every field on the page, for as long as the particle lives. */
    id: number;
    /** The cell it spawned in. */
    cell: ParticleFieldCellDefs;
    /** When it spawned, on the pass's clock. */
    spawnMs: number;
    /** Where it sits, relative to the field. */
    pos: Point2d;
};

export type BaseParticleFieldValues = {
    /**
     * The picture every particle is drawn with, at its cell's size. A white picture takes any color through
     * `computeParticleTint`; a picture of its own, a butterfly rather than a dot, is drawn as it is.
     */
    src: string;
    /**
     * How many cells the field is split into, across and down. A cell holds at most one particle at a time, so this is
     * also the most particles the field can show at once.
     */
    cellCount: Index2d;
    /**
     * The chance, `0`–`1`, that a cell spawns in a given pass. At `1` every cell spawns in every pass. Each cell is
     * decided once at the start of a pass, and the same pass always decides the same way, so scrubbing back over it
     * shows the same particles.
     */
    spawnChance?: number;
    /** How long one pass over the whole grid takes, and so the shortest time between two spawns from one cell. */
    animationDurationMs?: number;
    /** How many passes to run. Left out, it never stops. */
    animationIterationCount?: number;
    /** How long the field waits between one pass and the next. */
    animationIterationDelayMs?: number;
    /** How long one particle lives, from appearing to being removed. It is cut to the pass if it is longer. */
    particleLifetimeMs?: number;
    /** How far each corner of the area is rounded, as `Shape` takes it. */
    shapeJoinRadii?: number[];
    /** How square or how pinched each rounded corner of the area is, as `Shape` takes it. */
    shapeLameExponents?: number[];
    /** The cell a sample measures from — the center its zones and its own geometry take. */
    origin?: Index2d;
    /**
     * What draws the particles. `"graphics_card"` draws them into one canvas and falls back to page elements by itself
     * wherever it cannot: no WebGL 2, a sample written by hand rather than built by `SliceAnimationKeyframeUtils`, a
     * picture whose server gives no cross-origin permission, or a moment the browser has taken the graphics card away.
     * `"elements"` always draws each particle as an element of its own, which keeps an animated picture playing — the
     * graphics card draws only its first frame.
     */
    renderer?: SliceAnimationRenderer;
};

export type BaseParticleFieldCbs = {
    /**
     * The corners of the area particles may appear in, worked out from the field's size — the same input `Shape`
     * takes, so `ShapeConst.getDefaultShapePoints` is a ready answer. A cell spawns only when its center is inside.
     * Left out, the whole field is used.
     */
    computeShapePoints?: (size: Size2d) => Point2d[];
    /**
     * A weight per cell, `0`–`1`, handed the grid the field actually drew. It is the cell's turn in a pass: the
     * heaviest spawns first and the lightest last. A cell with no weight counts as `0`.
     */
    computeCellWeights?: (count: Index2d) => number[][];
    /**
     * Where a particle appears, relative to the field, given the cell it spawns in. Asked once per spawn, so a
     * random answer scatters particles differently every time. Left out, a particle sits at its cell's center.
     */
    computeParticlePos?: (defs: ParticleFieldCellDefs) => Point2d;
    /**
     * The sample one particle plays over its life, from `0` as it appears to `1` as it is removed, handed the cell it
     * spawned in — the same samples `CellAnimation` plays on a cell. A sample built by `SliceAnimationKeyframeUtils` can
     * be drawn on the graphics card; one written by hand plays on page elements.
     */
    computeParticleAnimation?: SliceAnimationFn;
    /**
     * The color one particle is multiplied by, as CSS writes it, asked once as it appears. A picture tinted red stays
     * the same picture, only redder; left out, the picture is drawn as it is.
     */
    computeParticleTint?: (defs: ParticleFieldCellDefs) => string;
    /** Runs at the end of each pass. */
    onIterationEnd?: () => void;
    /** Runs once every pass is done. */
    onAnimationEnd?: () => void;
};

export type BaseParticleFieldProps = BaseParticleFieldValues & BaseParticleFieldCbs;
