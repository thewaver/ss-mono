import { createContext, useContext, useEffect } from "react";

import { type TableCellContextType, type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

const TableHeaderContext = createContext<TableHeaderContextType | undefined>(undefined);

export const TableHeaderContextProvider = TableHeaderContext.Provider;

export const useTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = useContext(TableHeaderContext);

    useEffect(() => {
        if (!context) TableUtils.warnOutsideHeader(control);
    }, [context === undefined]);

    return context;
};

const TableCellContext = createContext<TableCellContextType | undefined>(undefined);

export const TableCellContextProvider = TableCellContext.Provider;

export const useTableCellContext = (control: string): TableCellContextType | undefined => {
    const context = useContext(TableCellContext);

    useEffect(() => {
        if (!context) TableUtils.warnOutsideCell(control);
    }, [context === undefined]);

    return context;
};
