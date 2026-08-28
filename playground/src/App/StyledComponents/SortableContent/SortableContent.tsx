import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { SortableItemContentProps, SortableMarkerProps, SortableSurfaceProps } from "./SortableContent.types";

import * as styles from "./SortableContent.css";

export const PageSortableItemContent = (props: ParentProps<SortableItemContentProps>) => (
    <div
        class={styles.sortableItemContent}
        classList={{
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

export const PageSortableSurface = (props: SortableSurfaceProps) => (
    <div
        class={styles.sortableSurface}
        classList={{
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

export const PageSortableMarker = (props: SortableMarkerProps) => (
    <div class={access(props.dir) === "row" ? styles.sortableMarkerRow : styles.sortableMarkerColumn} />
);
