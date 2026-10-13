import { createContext, useContext } from "react";

import { type LabelContextType, UNLABELED_CONTEXT } from "@thewaver/ss-components";

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const LabelContextProvider = LabelContext.Provider;

export const useLabelContext = (): LabelContextType => useContext(LabelContext) ?? UNLABELED_CONTEXT;
