import type { Point2d } from "@thewaver/ss-utils";

import type { ProximityArrangement, ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

export type PlacementBoxContextType = {
    getPointerPoint: () => Point2d | undefined;
    getArrangement: () => ProximityArrangement;
    getOverreach: () => number;
    getPrefersReducedMotion: () => boolean;
    getComputeEffect: () => ProximityEffectFn | undefined;
};
