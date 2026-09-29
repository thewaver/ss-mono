import { createContext } from "svelte";

import type { LabelContextType } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<LabelContextType>();

export const setLabelContext = (context: LabelContextType) => setContext(context);

export const LABEL_CONTEXT: LabelContextType = {
    getIsLabeled: () => true,
    getLabelId: () => undefined,
};

const UNLABELED_CONTEXT: LabelContextType = {
    getIsLabeled: () => false,
    getLabelId: () => undefined,
};

export const getLabelContext = (): LabelContextType => (hasContext() ? getContext() : UNLABELED_CONTEXT);
