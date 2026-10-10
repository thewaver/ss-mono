import { createContext, useContext } from "react";

import type { SharedTooltipReactContextType } from "./SharedTooltip.context.types";

const SharedTooltipContext = createContext<SharedTooltipReactContextType | undefined>(undefined);

export const SharedTooltipContextProvider = SharedTooltipContext.Provider;

export const useSharedTooltipContext = (): SharedTooltipReactContextType | undefined =>
    useContext(SharedTooltipContext);
