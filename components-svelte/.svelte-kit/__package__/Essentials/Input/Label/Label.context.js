import { createContext } from "svelte";
const [getContext, setContext, hasContext] = createContext();
export const setLabelContext = (context) => setContext(context);
export const LABEL_CONTEXT = {
    getIsLabeled: () => true,
    getLabelId: () => undefined,
};
const UNLABELED_CONTEXT = {
    getIsLabeled: () => false,
    getLabelId: () => undefined,
};
export const getLabelContext = () => (hasContext() ? getContext() : UNLABELED_CONTEXT);
