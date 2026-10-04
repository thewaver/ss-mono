import type { Point3d } from "@thewaver/ss-utils";

export const ROLLER_DEFAULTS = {
    rollDurationMs: 1400,
    tumbleCount: 2,
    settleDurationMs: 700,
    restDurationMs: 3000,
    momentumMs: 325,
    driftAxis: { x: 0.3, y: 1, z: 0.15 } as Point3d,
};
