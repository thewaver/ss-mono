import type { TableCellRenderProps, TableColumnRenderProps } from "./Table.types";

export type TableHeaderContextType = {
    getRenderProps: () => TableColumnRenderProps;
    sort: () => void;
    pickUp: () => void;
    registerSort: () => void;
    registerReorder: () => void;
};

export type TableCellContextType = {
    getRenderProps: () => TableCellRenderProps;
    toggle: () => void;
    registerExpander: () => void;
};
