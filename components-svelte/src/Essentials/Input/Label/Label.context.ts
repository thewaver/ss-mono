import { createContext } from "svelte";

import { type LabelContextType, UNLABELED_CONTEXT } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<LabelContextType>();

export const setLabelContext = (context: LabelContextType) => setContext(context);

export const getLabelContext = (): LabelContextType => (hasContext() ? getContext() : UNLABELED_CONTEXT);
