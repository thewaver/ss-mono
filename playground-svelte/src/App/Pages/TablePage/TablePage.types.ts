import type { TableSort } from "@thewaver/ss-components-svelte";
import type { Part } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type TableExampleProps = {
    sort: TableSort | undefined;
    selection: Part[];
};
