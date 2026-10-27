import type { ShapeConst } from "@thewaver/ss-utils";

export type ParticleDissolveExampleProps = {
    durationMs: () => number;
    particleLifetimeMs: () => number;
    featherShare: () => number;
    spawnChance: () => number;
    particlesPerCell: () => number;
    cellSize: () => number;
};

export type ParticleDissolveAngleExampleProps = ParticleDissolveExampleProps & {
    angleDegrees: () => number;
};

export type ParticleDissolveSvgExampleProps = ParticleDissolveAngleExampleProps & {
    shapeKind: () => ShapeConst.DefaultShape;
};
