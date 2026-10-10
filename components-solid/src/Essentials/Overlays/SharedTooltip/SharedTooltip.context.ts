import { createContext, useContext } from "solid-js";

import type { SharedTooltipContextType } from "./SharedTooltipSolid.types";

const SharedTooltipContext = createContext<SharedTooltipContextType>();

export const SharedTooltipContextProvider = SharedTooltipContext.Provider;

export const useSharedTooltipContext = (): SharedTooltipContextType | undefined => useContext(SharedTooltipContext);
