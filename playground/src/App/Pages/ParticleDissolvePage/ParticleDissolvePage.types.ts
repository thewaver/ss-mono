import type { ShapeConst } from "@thewaver/ss-utils";

export type BaseParticleDissolveExampleValues = {
    durationMs: number;
    particleLifetimeMs: number;
    featherShare: number;
    spawnChance: number;
    particlesPerCell: number;
    cellSize: number;
};

export type BaseParticleDissolveAngleExampleValues = BaseParticleDissolveExampleValues & {
    angleDegrees: number;
};

export type BaseParticleDissolveSvgExampleValues = BaseParticleDissolveAngleExampleValues & {
    shapeKind: ShapeConst.DefaultShape;
};
