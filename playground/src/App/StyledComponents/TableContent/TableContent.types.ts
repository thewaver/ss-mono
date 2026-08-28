import type { AccessorProps, TableCellFlags, TableColumnFlags } from "@thewaver/ss-components";

export type TableAlign = "start" | "end";

export type TableHeaderContentProps = AccessorProps<{
    flags: TableColumnFlags;
    align?: TableAlign;
}>;

export type TableCellContentProps = AccessorProps<{
    flags: TableCellFlags;
    align?: TableAlign;
}>;

export type TableResizerProps = AccessorProps<{
    flags: TableColumnFlags;
}>;
