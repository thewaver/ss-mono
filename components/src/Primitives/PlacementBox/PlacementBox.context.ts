import { createContext, useContext } from "solid-js";

import type { PlacementBoxContextType } from "./PlacementBox.context.types";

const PlacementBoxContext = createContext<PlacementBoxContextType>();

export const PlacementBoxContextProvider = PlacementBoxContext.Provider;

const UNTRACKED_BOX_CONTEXT: PlacementBoxContextType = {
    getPointerPoint: () => undefined,
    getArrangement: () => ({ spacing: 0, radius: 0, slack: Infinity }),
    getPrefersReducedMotion: () => false,
    getComputeEffect: () => undefined,
};

export const usePlacementBoxContext = (): PlacementBoxContextType =>
    useContext(PlacementBoxContext) ?? UNTRACKED_BOX_CONTEXT;
