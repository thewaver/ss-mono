import { createContext, useContext } from "react";

import { type PlacementBoxContextType, PlacementBoxUtils } from "@thewaver/ss-components";

const PlacementBoxContext = createContext<PlacementBoxContextType | undefined>(undefined);

export const PlacementBoxContextProvider = PlacementBoxContext.Provider;

export const usePlacementBoxContext = (): PlacementBoxContextType =>
    useContext(PlacementBoxContext) ?? PlacementBoxUtils.UNTRACKED_CONTEXT;
