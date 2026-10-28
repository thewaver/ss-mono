import type { CSSAnimationValues, Point2d } from "@thewaver/ss-utils";

import type { ParticleFieldCellDefs } from "../ParticleField/ParticleField.types";

export type ParticleDissolveSweep = { kind: "linear"; angleDegrees: number } | { kind: "radial"; origin: Point2d };

export type ParticleDissolveParticleDefs = {
    /** The grid cell the particle belongs to, which says where in the content it came from. */
    cell: ParticleFieldCellDefs;
    /** The color of whatever the particle came from, as CSS writes it: a text color, a background, a shape's fill. */
    color: string;
};

export type BaseParticleDissolveValues = {
    /**
     * Whether the content is dissolved. Changing it plays the dissolve or the rebuild from wherever the content is now,
     * so a change part-way through turns round rather than starting again, and writing the value it already has does
     * nothing. Dissolved content is out of reach as well as out of sight: it cannot be clicked, focused or read by a
     * screen reader until it is rebuilt.
     */
    isDissolved: boolean;
    /**
     * The direction a straight sweep travels, in degrees as CSS writes a gradient's: `0` sweeps up, `90` sweeps to the
     * right, `180` sweeps down. Ignored while `originShare` is set.
     */
    angleDegrees?: number;
    /**
     * Where the sweep starts, as a share of the content's width and height: `{ x: 0.5, y: 0.5 }` is the center. Left
     * out, the sweep is straight and travels along `angleDegrees`. Set, it spreads outward from this point, reaching
     * the farthest corner last, which is how a control can burn away from where it was pressed.
     */
    originShare?: Point2d;
    /** How long the whole dissolve takes, from the first of the content going to the last particle gone. */
    durationMs?: number;
    /**
     * How long one particle lives. It is held below the duration so there is a sweep to follow: the longer the
     * lifetime, the more of the duration the last particles spend flying.
     */
    particleLifetimeMs?: number;
    /**
     * How gradually the edge fades the content, as a share of the distance the sweep travels. `0` gives a hard edge,
     * and a larger share leaves more of the content half faded behind it.
     */
    featherShare?: number;
    /**
     * The chance, `0`–`1`, that a grid square of painted content releases its particle. Each square is rolled on its
     * own, so at `1` every one does, and a lower number thins the ash out.
     */
    spawnChance?: number;
    /** The side of one square of the grid particles are released from, in pixels. A smaller square means finer ash. */
    cellSize?: number;
};

export type BaseParticleDissolveCbs = {
    /**
     * What one particle does over its life, `0` as it is released and `1` as it is gone, in the same values
     * `CellAnimation` takes for a cell. Played backwards as the content rebuilds.
     */
    computeParticleAnimation?: (defs: ParticleDissolveParticleDefs, t: number) => CSSAnimationValues;
    /** Runs when the content has finished dissolving, with the last particle gone. */
    onDissolveEnd?: () => void;
    /** Runs when the content has finished rebuilding. */
    onRebuildEnd?: () => void;
};

export type BaseParticleDissolveProps = BaseParticleDissolveValues & BaseParticleDissolveCbs;
