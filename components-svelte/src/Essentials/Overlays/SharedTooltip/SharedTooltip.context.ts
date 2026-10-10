import { createContext } from "svelte";

import type { SharedTooltipContextType } from "./SharedTooltip.types.js";

const [getContext, setContext, hasContext] = createContext<SharedTooltipContextType>();

export const setSharedTooltipContext = (context: SharedTooltipContextType) => setContext(context);

export const getSharedTooltipContext = (): SharedTooltipContextType | undefined =>
    hasContext() ? getContext() : undefined;
