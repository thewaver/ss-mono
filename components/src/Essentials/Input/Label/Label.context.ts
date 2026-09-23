import { createContext, useContext } from "solid-js";

import type { LabelContextType } from "./Label.context.types";

const LabelContext = createContext<LabelContextType>();

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
