import type { TableSort } from "@thewaver/ss-components-react";
import type { Part } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type TableExampleProps = {
    sortState: readonly [TableSort | undefined, (sort: TableSort | undefined) => void];
    selectionState: readonly [Part[], (rows: Part[]) => void];
};
