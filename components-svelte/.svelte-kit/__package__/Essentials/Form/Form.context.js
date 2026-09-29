import { createContext } from "svelte";
const [getContext, setContext, hasContext] = createContext();
export const setFormContext = (context) => setContext(context);
export const getFormContext = () => (hasContext() ? getContext() : undefined);
