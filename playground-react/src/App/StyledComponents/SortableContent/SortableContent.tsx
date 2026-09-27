import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SortableContent/SortableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableItemContentProps, SortableMarkerProps, SortableSurfaceProps } from "./SortableContent.types";

export const PageSortableItemContent = (props: PropsWithChildren<SortableItemContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.sortableItemContent,
                layerClass,
                props.isCenterd === true && styles.sortableItemCenterd,
                props.flags.isCarried && styles.isCarried,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.sortableItemGrip} aria-hidden="true">
                {"⠿"}
            </div>

            <div>{props.children}</div>

            {props.detail ? <div className={styles.sortableItemDetail}>{props.detail}</div> : null}
        </div>
    );
};

export const PageSortableSurface = (props: SortableSurfaceProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.sortableSurface,
                layerClass,
                props.flags.isReceiving && styles.isReceiving,
                props.flags.isCarrying && styles.isCarrying,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.flags.isEmpty && <div className={styles.sortableEmpty}>{props.emptyText}</div>}
        </div>
    );
};

export const PageSortableMarker = (props: SortableMarkerProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                props.orientation === "horizontal" ? styles.sortableMarkerRow : styles.sortableMarkerColumn,
                layerClass,
            ].join(" ")}
        />
    );
};

export const PageSortableRingMarker = () => {
    const layerClass = useLayerClass();

    return <div className={[styles.sortableRingMarker, layerClass].join(" ")} data-marker="" />;
};

export const PageSortableRoom = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.sortableRoom, layerClass].join(" ")}>{props.children}</div>;
};
