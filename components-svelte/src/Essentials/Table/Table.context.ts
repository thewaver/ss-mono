import { createContext } from "svelte";

import { type TableCellContextType, type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<TableHeaderContextType>();

export const setTableHeaderContext = (context: TableHeaderContextType) => setContext(context);

export const getTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = hasContext() ? getContext() : undefined;

    if (!context) TableUtils.warnOutsideHeader(control);

    return context;
};

const [getCellContext, setCellContext, hasCellContext] = createContext<TableCellContextType>();

export const setTableCellContext = (context: TableCellContextType) => setCellContext(context);

export const getTableCellContext = (control: string): TableCellContextType | undefined => {
    const context = hasCellContext() ? getCellContext() : undefined;

    if (!context) TableUtils.warnOutsideCell(control);

    return context;
};
