import { createContext, useContext, useEffect } from "react";

import { type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

const TableHeaderContext = createContext<TableHeaderContextType | undefined>(undefined);

export const TableHeaderContextProvider = TableHeaderContext.Provider;

export const useTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = useContext(TableHeaderContext);

    useEffect(() => {
        if (!context) TableUtils.warnOutsideHeader(control);
    }, [context === undefined]);

    return context;
};
