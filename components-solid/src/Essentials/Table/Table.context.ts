import { createContext, useContext } from "solid-js";

import { type TableCellContextType, type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

const TableHeaderContext = createContext<TableHeaderContextType>();

export const TableHeaderContextProvider = TableHeaderContext.Provider;

export const useTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = useContext(TableHeaderContext);

    if (!context) TableUtils.warnOutsideHeader(control);

    return context;
};

const TableCellContext = createContext<TableCellContextType>();

export const TableCellContextProvider = TableCellContext.Provider;

export const useTableCellContext = (control: string): TableCellContextType | undefined => {
    const context = useContext(TableCellContext);

    if (!context) TableUtils.warnOutsideCell(control);

    return context;
};
