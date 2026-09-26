import { createContext, useContext } from "solid-js";

import type { TableHeaderContextType } from "./Table.context.types";

const TableHeaderContext = createContext<TableHeaderContextType>();

export const TableHeaderContextProvider = TableHeaderContext.Provider;

export const useTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = useContext(TableHeaderContext);

    if (!context) {
        console.warn(
            `${control}: no Table header cell around it — it has no column to act on and renders nothing. Render it from a column's renderHeader.`,
        );
    }

    return context;
};
