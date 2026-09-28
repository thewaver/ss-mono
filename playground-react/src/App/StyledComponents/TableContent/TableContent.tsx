import type { PropsWithChildren } from "react";

import type { TableSortDirection } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    TableAlign,
    TableCellContentProps,
    TableHeaderContentProps,
    TableResizerProps,
} from "./TableContent.types";

const DEFAULT_ALIGN: TableAlign = "start";

const UNSORTED_MARKER = "↕";

const SORT_MARKERS: Record<TableSortDirection, string> = {
    ascending: "▲",
    descending: "▼",
};

const getSortMarker = (direction: TableSortDirection | undefined) =>
    direction === undefined ? UNSORTED_MARKER : SORT_MARKERS[direction];

export const PageTableHeaderContent = (props: PropsWithChildren<TableHeaderContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.tableHeaderContent,
                styles.alignVariants[props.align ?? DEFAULT_ALIGN],
                layerClass,
                props.renderProps.isSortable && styles.isSortable,
                props.renderProps.isResizable && styles.isResizable,
                props.renderProps.sortDirection !== undefined && styles.isSorted,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageTableHeaderText = (props: PropsWithChildren) => (
    <div className={styles.tableHeaderText}>{props.children}</div>
);

export const PageTableSortControl = (props: TableResizerProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.tableSortMarker, layerClass].join(" ")}>
            {getSortMarker(props.renderProps.sortDirection)}
        </div>
    );
};

export const PageTableReorderGrip = () => {
    const layerClass = useLayerClass();

    return <div className={[styles.tableReorderGrip, layerClass].join(" ")}>{"⠿"}</div>;
};

export const PageTableCellContent = (props: PropsWithChildren<TableCellContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.tableCellContent,
                styles.alignVariants[props.align ?? DEFAULT_ALIGN],
                layerClass,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.tableText}>{props.children}</div>
        </div>
    );
};

export const PageTableResizer = (props: TableResizerProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.tableResizerHandle, layerClass, props.renderProps.isResizing && styles.isResizing]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        />
    );
};

export const PageTableMarker = () => {
    const layerClass = useLayerClass();

    return <div className={[styles.tableMarker, layerClass].join(" ")} />;
};
