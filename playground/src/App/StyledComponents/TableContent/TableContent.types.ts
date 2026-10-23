import type { TableCellRenderProps, TableColumnRenderProps, TableDetailRenderProps } from "@thewaver/ss-components";

export type TableAlign = "start" | "end";

export type BaseTableHeaderContentValues = {
    renderProps: TableColumnRenderProps;
    align?: TableAlign;
};

export type BaseTableHeaderContentProps = BaseTableHeaderContentValues;

export type BaseTableCellContentValues = {
    renderProps: TableCellRenderProps;
    align?: TableAlign;
};

export type BaseTableCellContentProps = BaseTableCellContentValues;

export type BaseTableResizerValues = {
    renderProps: TableColumnRenderProps;
};

export type BaseTableResizerProps = BaseTableResizerValues;

export type BaseTableExpanderValues = {
    renderProps: TableCellRenderProps;
};

export type BaseTableExpanderProps = BaseTableExpanderValues;

export type BaseTableDetailContentValues = {
    renderProps: TableDetailRenderProps;
};

export type BaseTableDetailContentProps = BaseTableDetailContentValues;
