import type { TableSortDirection } from "@thewaver/ss-components";

import type { TableAlign } from "./TableContent.types";

export const DEFAULT_ALIGN: TableAlign = "start";

export const UNSORTED_MARKER = "↕";

export const EXPANDER_MARKERS = {
    open: "▾",
    closed: "▸",
    closedRightToLeft: "◂",
};

export const SORT_MARKERS: Record<TableSortDirection, string> = {
    ascending: "▲",
    descending: "▼",
};
