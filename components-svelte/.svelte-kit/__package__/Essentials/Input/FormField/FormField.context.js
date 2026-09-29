import { createContext } from "svelte";
const [getContext, setContext, hasContext] = createContext();
export const setFormFieldContext = (context) => setContext(context);
const UNDESCRIBED_CONTEXT = {
    getDescriptionId: () => undefined,
    registerControl: () => undefined,
    unregisterControl: () => undefined,
};
export const getFormFieldContext = () => (hasContext() ? getContext() : UNDESCRIBED_CONTEXT);
