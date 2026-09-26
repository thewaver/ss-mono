import type { ParentProps } from "solid-js";

import type { TableSortDirection } from "@thewaver/ss-components";
import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
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

export const PageTableHeaderContent = (props: ParentProps<TableHeaderContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.tableHeaderContent, styles.alignVariants[access(props.align) ?? DEFAULT_ALIGN]].join(" ")}
            classList={{
                [getLayerClass()]: true,
                [styles.isSortable]: access(props.renderProps).isSortable,
                [styles.isResizable]: access(props.renderProps).isResizable,
                [styles.isSorted]: access(props.renderProps).sortDirection !== undefined,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
        >
            {props.children}
        </div>
    );
};

export const PageTableHeaderText = (props: ParentProps) => <div class={styles.tableHeaderText}>{props.children}</div>;

export const PageTableSortControl = (props: TableResizerProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.tableSortMarker, getLayerClass()].join(" ")}>
            {getSortMarker(access(props.renderProps).sortDirection)}
        </div>
    );
};

export const PageTableReorderGrip = () => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.tableReorderGrip, getLayerClass()].join(" ")}>{"\u283F"}</div>;
};

export const PageTableCellContent = (props: ParentProps<TableCellContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.tableCellContent, styles.alignVariants[access(props.align) ?? DEFAULT_ALIGN]].join(" ")}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
        >
            <div class={styles.tableText}>{props.children}</div>
        </div>
    );
};

export const PageTableResizer = (props: TableResizerProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.tableResizerHandle}
            classList={{ [getLayerClass()]: true, [styles.isResizing]: access(props.renderProps).isResizing }}
            aria-hidden="true"
        />
    );
};

export const PageTableMarker = () => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.tableMarker, getLayerClass()].join(" ")} />;
};
