import type { Index2d, Point2d, Rect, Size2d } from "@thewaver/ss-utils";

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
