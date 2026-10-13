import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTableCellContentValues,
    BaseTableHeaderContentValues,
    BaseTableResizerValues,
} from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.types";

export type { TableAlign } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.types";

export type TableHeaderContentProps = AccessorValues<BaseTableHeaderContentValues>;

export type TableCellContentProps = AccessorValues<BaseTableCellContentValues>;

export type TableResizerProps = AccessorValues<BaseTableResizerValues>;
