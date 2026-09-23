import { createContext, useContext } from "solid-js";

import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import type { PlacementBoxContextType } from "./PlacementBox.context.types";

const PlacementBoxContext = createContext<PlacementBoxContextType>();

export const PlacementBoxContextProvider = PlacementBoxContext.Provider;

const UNTRACKED_BOX_CONTEXT: PlacementBoxContextType = {
    getPointerPoint: () => undefined,
    getArrangement: () => ProximityUtils.RESTING_ARRANGEMENT,
    getOverreach: () => 0,
    getPrefersReducedMotion: () => false,
    getComputeEffect: () => undefined,
    getTransitionDurationMs: () => 0,
};

/**
 * Reads the enclosing {@link PlacementBox}'s pointer tracking.
 *
 * Outside a box it answers with an inert context rather than throwing — no pointer, a resting
 * arrangement, no effect and no gliding — so an item rendered on its own degrades to standing still instead of
 * crashing. A consumer building their own item should treat that as the "no box above me" case.
 */
export const usePlacementBoxContext = (): PlacementBoxContextType =>
    useContext(PlacementBoxContext) ?? UNTRACKED_BOX_CONTEXT;
