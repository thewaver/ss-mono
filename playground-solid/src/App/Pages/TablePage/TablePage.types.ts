import type { Signal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import type { Part } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.types";

export type TableExampleProps = {
    sort: Signal<TableSort | undefined>;
    selection: Signal<Part[]>;
};
