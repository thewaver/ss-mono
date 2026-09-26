import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableItemContentProps, SortableMarkerProps, SortableSurfaceProps } from "./SortableContent.types";

import * as styles from "./SortableContent.css";

export const PageSortableItemContent = (props: ParentProps<SortableItemContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.sortableItemContent}
            classList={{
                [getLayerClass()]: true,
                [styles.sortableItemCenterd]: access(props.isCenterd) === true,
                [styles.isCarried]: access(props.flags).isCarried,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <div class={styles.sortableItemGrip} aria-hidden="true">
                {"⠿"}
            </div>

            <div>{props.children}</div>

            <Show when={access(props.detail)}>
                {(getDetail) => <div class={styles.sortableItemDetail}>{getDetail()}</div>}
            </Show>
        </div>
    );
};

export const PageSortableSurface = (props: SortableSurfaceProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.sortableSurface}
            classList={{
                [getLayerClass()]: true,
                [styles.isReceiving]: access(props.flags).isReceiving,
                [styles.isCarrying]: access(props.flags).isCarrying,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <Show when={access(props.flags).isEmpty}>
                <div class={styles.sortableEmpty}>{access(props.emptyText)}</div>
            </Show>
        </div>
    );
};

export const PageSortableMarker = (props: SortableMarkerProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[
                access(props.orientation) === "horizontal" ? styles.sortableMarkerRow : styles.sortableMarkerColumn,
                getLayerClass(),
            ].join(" ")}
        />
    );
};

export const PageSortableRingMarker = () => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.sortableRingMarker, getLayerClass()].join(" ")} data-marker />;
};

export const PageSortableRoom = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.sortableRoom, getLayerClass()].join(" ")}>{props.children}</div>;
};
