import { createContext, useContext } from "solid-js";

import type { LabelContextType } from "./Label.context.types";

const LabelContext = createContext<LabelContextType>();

export const LabelContextProvider = LabelContext.Provider;

export const LABEL_CONTEXT: LabelContextType = {
    getIsLabelled: () => true,
    getLabelId: () => undefined,
};

const UNLABELLED_CONTEXT: LabelContextType = {
    getIsLabelled: () => false,
    getLabelId: () => undefined,
};

export const useLabelContext = (): LabelContextType => useContext(LabelContext) ?? UNLABELLED_CONTEXT;
