import type { Point2d } from "@thewaver/ss-utils";

export type ParticleWindDefs = {
    directionDegrees?: number;
    strengthPixels?: number;
    gustRatio?: number;
    gustPeriodMs?: number;
};

export type ParticleAttractionDefs = {
    strengthRatio?: number;
    reachPixels?: number;
} & ({ offset: Point2d; modMarkerIndex?: never } | { modMarkerIndex: number; offset?: never });
