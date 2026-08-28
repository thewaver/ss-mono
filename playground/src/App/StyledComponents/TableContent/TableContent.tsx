import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import type { TableSortDirection } from "@thewaver/ss-components";
import { access } from "@thewaver/ss-components";

import type {
    TableAlign,
    TableCellContentProps,
    TableHeaderContentProps,
    TableResizerProps,
} from "./TableContent.types";

import * as styles from "./TableContent.css";

const DEFAULT_ALIGN: TableAlign = "start";

const UNSORTED_MARKER = "↕";

const SORT_MARKERS: Record<TableSortDirection, string> = {
    ascending: "▲",
    descending: "▼",
};

const getSortMarker = (direction: TableSortDirection | undefined) =>
    direction === undefined ? UNSORTED_MARKER : SORT_MARKERS[direction];

export const PageTableHeaderContent = (props: ParentProps<TableHeaderContentProps>) => (
    <div
        class={[styles.tableHeaderContent, styles.alignVariants[access(props.align) ?? DEFAULT_ALIGN]].join(" ")}
        classList={{
            [styles.isSortable]: access(props.flags).isSortable,
            [styles.isSorted]: access(props.flags).sortDirection !== undefined,
            [styles.isHovered]: access(props.flags).isHovered,
            [styles.isDisabled]: access(props.flags).isDisabled,
        }}
    >
        <div class={styles.tableText}>{props.children}</div>

        <Show when={access(props.flags).isSortable}>
            <div class={styles.tableSortMarker} aria-hidden="true">
                {getSortMarker(access(props.flags).sortDirection)}
            </div>
        </Show>
    </div>
);

export const PageTableCellContent = (props: ParentProps<TableCellContentProps>) => (
    <div
        class={[styles.tableCellContent, styles.alignVariants[access(props.align) ?? DEFAULT_ALIGN]].join(" ")}
        classList={{
            [styles.isHovered]: access(props.flags).isHovered,
            [styles.isSelected]: access(props.flags).isSelected,
            [styles.isDisabled]: access(props.flags).isDisabled,
        }}
    >
        <div class={styles.tableText}>{props.children}</div>
    </div>
);

export const PageTableResizer = (props: TableResizerProps) => (
    <div
        class={styles.tableResizerHandle}
        classList={{ [styles.isResizing]: access(props.flags).isResizing }}
        aria-hidden="true"
    />
);
