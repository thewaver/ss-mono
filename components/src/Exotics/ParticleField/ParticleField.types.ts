import type { Accessor, JSX } from "solid-js";

import type { CSSAnimationValues, Index2d, Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type ParticleFieldCellDefs = {
    pos: Index2d;
    count: Index2d;
    weight: number;
    size: Size2d;
    rect: Rect;
};

export type ParticleFieldProps = AccessorProps<{
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
    /** Whether the field is running. It is the only thing that starts or pauses it, and a pause freezes every particle. */
    playbackSignal?: SignalSource<boolean>;
    /**
     * How far through the current pass the field is, `0`–`1`. The component writes it as the pass runs, and writing it
     * moves the pass there: while playing it carries on from the new point, and with playback paused it scrubs.
     */
    progressSignal?: SignalSource<number>;
    /**
     * The corners of the area particles may appear in, worked out from the field's size — the same input `Shape`
     * takes, so `ShapeConst.getDefaultShapePoints` is a ready answer. A cell spawns only when its center is inside.
     * Left out, the whole field is used.
     */
    computeShapePoints?: (size: Size2d) => Point2d[];
    /** How far each corner of the area is rounded, as `Shape` takes it. */
    shapeJoinRadii?: number[];
    /** How square or how pinched each rounded corner of the area is, as `Shape` takes it. */
    shapeLameExponents?: number[];
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
     * What one particle does over its life, `0` as it appears and `1` as it is removed — the same values
     * `CellAnimation` takes for a cell, so its keyframe samples play here too.
     */
    computeParticleAnimation?: (defs: ParticleFieldCellDefs, t: number) => CSSAnimationValues;
    /** Draws one particle, and is told how far through its life it is. */
    renderParticle: (defs: ParticleFieldCellDefs, getT: Accessor<number>) => JSX.Element;
    /** Runs at the end of each pass. */
    onIterationEnd?: () => void;
    /** Runs once every pass is done. */
    onAnimationEnd?: () => void;
}>;
