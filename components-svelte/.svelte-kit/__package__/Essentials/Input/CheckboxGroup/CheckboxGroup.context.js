import { createContext } from "svelte";
const [getContext, setContext, hasContext] = createContext();
export const setCheckboxGroupContext = (context) => setContext(context);
export const getCheckboxGroupContext = () => hasContext() ? getContext() : undefined;
