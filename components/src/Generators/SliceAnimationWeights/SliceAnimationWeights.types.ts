import type { Index2d } from "@thewaver/ss-utils";

export type WeightFn = (pos: Index2d, count: Index2d, origin: Index2d) => number;

export type SweepDefs = {
    quadrantsPerSection: number;
    clockDownMul: number;
    clockRightMul: number;
    clockUpMul: number;
    clockLeftMul: number;
};

export type RippleDefs = {
    periodCells: number;
    travelRatio: number;
};

export type WeightOpts = {
    shouldMakeUnique?: boolean;
    shouldNormalize?: boolean;
};
