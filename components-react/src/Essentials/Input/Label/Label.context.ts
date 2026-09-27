import { createContext, useContext } from "react";

import type { LabelContextType } from "@thewaver/ss-components";

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const LabelContextProvider = LabelContext.Provider;

export const LABEL_CONTEXT: LabelContextType = {
    getIsLabeled: () => true,
    getLabelId: () => undefined,
};

const UNLABELED_CONTEXT: LabelContextType = {
    getIsLabeled: () => false,
    getLabelId: () => undefined,
};

export const useLabelContext = (): LabelContextType => useContext(LabelContext) ?? UNLABELED_CONTEXT;
