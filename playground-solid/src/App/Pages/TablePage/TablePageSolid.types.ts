import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTableBasicDocsExampleValues,
    BaseTableVirtualizedDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type TableBasicDocsExampleProps = AccessorValues<BaseTableBasicDocsExampleValues>;

export type TableVirtualizedDocsExampleProps = AccessorValues<BaseTableVirtualizedDocsExampleValues>;
