import type { Signal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import type { Part } from "@thewaver/ss-playground-core/App/Pages/TablePage/TableParts.types";

export type { Part, PartColumnDefs } from "@thewaver/ss-playground-core/App/Pages/TablePage/TableParts.types";

export type TableExampleProps = {
    sortSignal: Signal<TableSort | undefined>;
    selectionSignal: Signal<Part[]>;
};
