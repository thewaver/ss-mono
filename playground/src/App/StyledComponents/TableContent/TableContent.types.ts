import type { AccessorProps, TableCellRenderProps, TableColumnRenderProps } from "@thewaver/ss-components";

export type TableAlign = "start" | "end";

export type TableHeaderContentProps = AccessorProps<{
    renderProps: TableColumnRenderProps;
    align?: TableAlign;
}>;

export type TableCellContentProps = AccessorProps<{
    renderProps: TableCellRenderProps;
    align?: TableAlign;
}>;

export type TableResizerProps = AccessorProps<{
    renderProps: TableColumnRenderProps;
}>;
