import type { TableColumnRenderProps } from "./Table.types";

export type TableHeaderContextType = {
    getRenderProps: () => TableColumnRenderProps;
    sort: () => void;
    pickUp: () => void;
    registerSort: () => void;
    registerReorder: () => void;
};
