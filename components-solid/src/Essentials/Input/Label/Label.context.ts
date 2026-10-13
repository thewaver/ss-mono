import { createContext, useContext } from "solid-js";

import { type LabelContextType, UNLABELED_CONTEXT } from "@thewaver/ss-components";

const LabelContext = createContext<LabelContextType>();

export const LabelContextProvider = LabelContext.Provider;

export const useLabelContext = (): LabelContextType => useContext(LabelContext) ?? UNLABELED_CONTEXT;
