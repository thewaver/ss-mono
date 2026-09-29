import { createContext } from "svelte";

import { type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<TableHeaderContextType>();

export const setTableHeaderContext = (context: TableHeaderContextType) => setContext(context);

export const getTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = hasContext() ? getContext() : undefined;

    if (!context) TableUtils.warnOutsideHeader(control);

    return context;
};
