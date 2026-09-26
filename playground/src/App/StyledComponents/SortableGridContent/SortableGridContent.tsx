import { For, Show, createMemo } from "solid-js";

import { access } from "@thewaver/ss-components";
import type { SortableGridGeometry } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    SortableGridCellProps,
    SortableGridItemContentProps,
    SortableGridLandingProps,
    SortableGridSurfaceProps,
} from "./SortableGridContent.types";

import * as styles from "./SortableGridContent.css";

const NAMED_WIDTH = 2;

const getBox = (geometry: SortableGridGeometry) => ({
    width: Math.max(...geometry.outline.map((point) => point.x)),
    height: Math.max(...geometry.outline.map((point) => point.y)),
});

const getPoints = (geometry: SortableGridGeometry) =>
    geometry.outline.map((point) => `${point.x},${point.y}`).join(" ");

const getViewBox = (geometry: SortableGridGeometry) => {
    const box = getBox(geometry);

    return `0 0 ${box.width} ${box.height}`;
};

export const PageSortableGridItemContent = (props: SortableGridItemContentProps) => {
    const getLayerClass = useLayerClass();

    const getGeometry = createMemo(() => access(props.geometry));

    const getGlyphRect = createMemo(() => getGeometry().block);

    const getIsNamed = createMemo(() => getGlyphRect().width >= getGeometry().cells[0].width * NAMED_WIDTH);

    return (
        <div
            class={styles.sortableGridItemContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isCarried]: access(props.flags).isCarried,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <Show
                when={(access(props.paint) ?? "outline") === "outline"}
                fallback={
                    <For each={getGeometry().cells}>
                        {(cell) => (
                            <div
                                class={styles.sortableGridItemTile}
                                style={{
                                    ...assignInlineVars({ [styles.tileHue]: `${access(props.hue) ?? 0}` }),
                                    left: `${cell.left}px`,
                                    top: `${cell.top}px`,
                                    width: `${cell.width}px`,
                                    height: `${cell.height}px`,
                                }}
                                aria-hidden="true"
                            />
                        )}
                    </For>
                }
            >
                <svg class={styles.sortableGridItemShape} viewBox={getViewBox(getGeometry())} aria-hidden="true">
                    <polygon class={styles.sortableGridItemOutline} points={getPoints(getGeometry())} />
                </svg>
            </Show>

            <div
                class={styles.sortableGridItemGlyph}
                style={{
                    left: `${getGlyphRect().left}px`,
                    top: `${getGlyphRect().top}px`,
                    width: `${getGlyphRect().width}px`,
                    height: `${getGlyphRect().height}px`,
                }}
                aria-hidden="true"
            >
                <div>{access(props.glyph)}</div>

                <Show when={getIsNamed()}>
                    <div class={styles.sortableGridItemName}>{access(props.name)}</div>
                </Show>
            </div>
        </div>
    );
};

export const PageSortableGridCell = (props: SortableGridCellProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.sortableGridCell}
            classList={{
                [getLayerClass()]: true,
                [styles.isOdd]: (access(props.spot).col + access(props.spot).row) % 2 === 1,
                [styles.isBlocked]: access(props.isBlocked) ?? false,
            }}
        />
    );
};

export const PageSortableGridLanding = (props: SortableGridLandingProps) => {
    const getLayerClass = useLayerClass();

    return (
        <svg
            class={styles.sortableGridLanding}
            classList={{ [getLayerClass()]: true, [styles.isAllowed]: access(props.isAllowed) }}
            viewBox={getViewBox(access(props.geometry))}
            aria-hidden="true"
        >
            <polygon class={styles.sortableGridLandingOutline} points={getPoints(access(props.geometry))} />
        </svg>
    );
};

export const PageSortableGridSurface = (props: SortableGridSurfaceProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.sortableGridSurface}
            classList={{
                [getLayerClass()]: true,
                [styles.isReceiving]: access(props.flags).isReceiving,
                [styles.isCarrying]: access(props.flags).isCarrying,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <Show when={access(props.flags).isEmpty}>
                <div class={styles.sortableGridEmpty}>{access(props.emptyText)}</div>
            </Show>
        </div>
    );
};
