import type { TableSort } from "@thewaver/ss-components-react";
import type { Part } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type TableExampleProps = {
    sort: readonly [TableSort | undefined, (sort: TableSort | undefined) => void];
    selection: readonly [Part[], (rows: Part[]) => void];
};
