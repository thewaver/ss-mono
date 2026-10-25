import { type ParentProps, Show, createSignal } from "solid-js";

import type { TableSortDirection } from "@thewaver/ss-components-solid";
import { NavigatorSolidUtils, access } from "@thewaver/ss-components-solid";
import {
    DEFAULT_ALIGN,
    EXPANDER_MARKERS,
    SORT_MARKERS,
    UNSORTED_MARKER,
} from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    TableCellContentProps,
    TableDetailContentProps,
    TableExpanderProps,
    TableHeaderContentProps,
    TableResizerProps,
} from "./TableContentSolid.types";

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
                [styles.isPinnedStart]: access(props.renderProps).pin === "start",
                [styles.isPinnedEnd]: access(props.renderProps).pin === "end",
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
                [styles.isPinnedStart]: access(props.renderProps).pin === "start",
                [styles.isPinnedEnd]: access(props.renderProps).pin === "end",
                [styles.isExpanded]: access(props.renderProps).isExpanded,
            }}
        >
            <Show when={props.leading !== undefined}>
                <div class={styles.tableCellLeading}>{props.leading}</div>
            </Show>

            <div class={styles.tableText}>{props.children}</div>
        </div>
    );
};

export const PageTableRowExpander = (props: TableExpanderProps) => {
    const getLayerClass = useLayerClass();

    const [getRef, setRef] = createSignal<HTMLElement>();
    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRef);

    const getMarker = () => {
        if (access(props.renderProps).isExpanded) return EXPANDER_MARKERS.open;

        return getDirection() === "rtl" ? EXPANDER_MARKERS.closedRightToLeft : EXPANDER_MARKERS.closed;
    };

    return (
        <div ref={setRef} class={[styles.tableRowExpander, getLayerClass()].join(" ")}>
            {getMarker()}
        </div>
    );
};

export const PageTableDetailContent = (props: ParentProps<TableDetailContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.tableDetailContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
        >
            {props.children}
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
