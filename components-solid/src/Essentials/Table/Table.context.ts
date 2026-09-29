import { createContext, useContext } from "solid-js";

import { type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

const TableHeaderContext = createContext<TableHeaderContextType>();

export const TableHeaderContextProvider = TableHeaderContext.Provider;

export const useTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = useContext(TableHeaderContext);

    if (!context) TableUtils.warnOutsideHeader(control);

    return context;
};
