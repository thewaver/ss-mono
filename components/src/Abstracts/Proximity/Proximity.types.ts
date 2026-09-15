import type { CSSAnimationValues, Point2d } from "@thewaver/ss-utils";

import type { PlacementReach, PlacementRect } from "../Placement/Placement.types";

export type ProximityEffect = CSSAnimationValues;

export type ProximityArrangement = PlacementReach & {
    spacing: number;
    radius: number;
    slack: number;
};

export type ProximityEffectDefs = ProximityArrangement & {
    placement: PlacementRect;
    frame: PlacementRect;
    offset: Point2d;
    distance: number;
    radialShare: number;
    ratio: number;
    prefersReducedMotion: boolean;
};

export type ProximityEffectFn = (defs: ProximityEffectDefs) => ProximityEffect;
