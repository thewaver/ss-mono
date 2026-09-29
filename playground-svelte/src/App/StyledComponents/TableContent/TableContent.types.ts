import type { TableCellRenderProps, TableColumnRenderProps } from "@thewaver/ss-components-svelte";

export type TableAlign = "start" | "end";

export type TableHeaderContentProps = {
    renderProps: TableColumnRenderProps;
    align?: TableAlign;
};

export type TableCellContentProps = {
    renderProps: TableCellRenderProps;
    align?: TableAlign;
};

export type TableResizerProps = {
    renderProps: TableColumnRenderProps;
};
