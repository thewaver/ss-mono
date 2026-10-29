import type { CSSAnimationKey, Index2d } from "@thewaver/ss-utils";

import type {
    SliceAnimationEvaluationDefs,
    SliceAnimationEvaluationResult,
} from "../../Exotics/Animations/CellAnimation/CellAnimation.types";
import type { CellAnimationZoneType } from "../CellAnimationZones/CellAnimationZones.types";

export type SliceStop = { at: number; originX?: number; originY?: number; depth?: number } & Partial<
    Record<CSSAnimationKey, number>
>;

export type SliceStopTrack = { at: number; value: number }[];

export type CompiledSliceStops = Record<string, SliceStopTrack>;

export type SliceAnimationFn = (
    timeline: number,
    defs: SliceAnimationEvaluationDefs & { origin: Index2d },
) => SliceAnimationEvaluationResult;

export type SliceZone = {
    zone: CellAnimationZoneType;
    animation: SliceAnimationFn;
};

export type SliceStopsFn = (defs: SliceAnimationEvaluationDefs & { origin: Index2d }) => SliceStop[];

export type SliceAnimationDefinition =
    | { kind: "stops"; stops: SliceStop[] }
    | { kind: "zones"; zones: SliceZone[]; fallback: SliceAnimationFn }
    | { kind: "slices"; computeStops: SliceStopsFn };
