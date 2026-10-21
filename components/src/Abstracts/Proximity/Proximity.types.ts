import type { CSSAnimationValues, Point2d } from "@thewaver/ss-utils";

import type { PlacementReach, PlacementRect, PlacementSpan, PlacementSpreadRule } from "../Placement/Placement.types";

export type ProximityEffect = CSSAnimationValues;

export type ProximityArrangement = PlacementReach & {
    spacing: number;
    radius: number;
    slack: number;
    spreadRule?: PlacementSpreadRule;
    span?: PlacementSpan;
};

export type ProximityEffectDefs = ProximityArrangement & {
    placement: PlacementRect;
    frame: PlacementRect;
    offset: Point2d;
    distance: number;
    overreach: number;
    radialShare: number;
    ratio: number;
    prefersReducedMotion: boolean;
};

export type ProximityEffectFn = (defs: ProximityEffectDefs) => ProximityEffect;
