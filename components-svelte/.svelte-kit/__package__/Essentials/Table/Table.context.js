import { createContext } from "svelte";
import { TableUtils } from "@thewaver/ss-components";
const [getContext, setContext, hasContext] = createContext();
export const setTableHeaderContext = (context) => setContext(context);
export const getTableHeaderContext = (control) => {
    const context = hasContext() ? getContext() : undefined;
    if (!context)
        TableUtils.warnOutsideHeader(control);
    return context;
};
