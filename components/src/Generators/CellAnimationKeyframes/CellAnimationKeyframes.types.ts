import type { CSSAnimationKey, Index2d } from "@thewaver/ss-utils";

import type {
    CellAnimationEvaluationDefs,
    CellAnimationEvaluationResult,
} from "../../Exotics/CellAnimation/CellAnimation.types";
import type { CellAnimationZoneType } from "../CellAnimationZones/CellAnimationZones.types";

export type CellStop = { at: number; originX?: number; originY?: number; depth?: number } & Partial<
    Record<CSSAnimationKey, number>
>;

export type CellStopTrack = { at: number; value: number }[];

export type CompiledCellStops = Record<string, CellStopTrack>;

export type CellAnimationFn = (
    timeline: number,
    defs: CellAnimationEvaluationDefs & { origin: Index2d },
) => CellAnimationEvaluationResult;

export type CellZone = {
    zone: CellAnimationZoneType;
    animation: CellAnimationFn;
};
