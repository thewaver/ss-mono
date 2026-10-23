import type { JSX } from "solid-js";

import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTableCellContentValues,
    BaseTableDetailContentValues,
    BaseTableExpanderValues,
    BaseTableHeaderContentValues,
    BaseTableResizerValues,
} from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.types";

export type { TableAlign } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.types";

export type TableHeaderContentProps = AccessorValues<BaseTableHeaderContentValues>;

export type TableCellContentProps = AccessorValues<BaseTableCellContentValues> & { leading?: JSX.Element };

export type TableResizerProps = AccessorValues<BaseTableResizerValues>;

export type TableExpanderProps = AccessorValues<BaseTableExpanderValues>;

export type TableDetailContentProps = AccessorValues<BaseTableDetailContentValues>;
