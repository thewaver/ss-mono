import type { Snippet } from "svelte";

import type {
    BaseTableCellContentProps,
    BaseTableDetailContentProps,
    BaseTableExpanderProps,
    BaseTableHeaderContentProps,
    BaseTableResizerProps,
} from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.types";

export type { TableAlign } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.types";

export type TableHeaderContentProps = BaseTableHeaderContentProps;

export type TableCellContentProps = BaseTableCellContentProps & { leading?: Snippet };

export type TableResizerProps = BaseTableResizerProps;

export type TableExpanderProps = BaseTableExpanderProps;

export type TableDetailContentProps = BaseTableDetailContentProps;
