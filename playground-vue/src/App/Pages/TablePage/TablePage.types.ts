import type { TableSort } from "@thewaver/ss-components-vue";
import type { Part } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type TableExampleProps = {
    "sort": TableSort | undefined;
    "onUpdate:sort"?: (sort: TableSort | undefined) => void;
    "selection": Part[];
    "onUpdate:selection"?: (rows: Part[]) => void;
};
