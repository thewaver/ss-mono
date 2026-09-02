import { For, Show, createMemo } from "solid-js";

import { access } from "@thewaver/ss-components";
import type { SortableGridGeometry } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

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

/**
 * One user unit is one pixel and nothing is inset, so the polygon lands on the cells it names. A viewBox
 * bigger than the element in one direction is scaled to fit and centred, which is a shape drawn short of
 * its own box — worst on a tall thin one, where the two ratios are furthest apart. The stroke's outer half
 * falls outside the box and is drawn because the element is `overflow: visible`.
 */
const getViewBox = (geometry: SortableGridGeometry) => {
    const box = getBox(geometry);

    return `0 0 ${box.width} ${box.height}`;
};

export const PageSortableGridItemContent = (props: SortableGridItemContentProps) => {
    const getGeometry = createMemo(() => access(props.geometry));

    const getGlyphRect = createMemo(() => getGeometry().block);

    const getIsNamed = createMemo(() => getGlyphRect().width >= getGeometry().cells[0].width * NAMED_WIDTH);

    return (
        <div
            class={styles.sortableGridItemContent}
            classList={{
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

export const PageSortableGridCell = (props: SortableGridCellProps) => (
    <div
        class={styles.sortableGridCell}
        classList={{ [styles.isOdd]: (access(props.spot).x + access(props.spot).y) % 2 === 1 }}
    />
);

export const PageSortableGridLanding = (props: SortableGridLandingProps) => (
    <svg
        class={styles.sortableGridLanding}
        classList={{ [styles.isAllowed]: access(props.isAllowed) }}
        viewBox={getViewBox(access(props.geometry))}
        aria-hidden="true"
    >
        <polygon class={styles.sortableGridLandingOutline} points={getPoints(access(props.geometry))} />
    </svg>
);

export const PageSortableGridSurface = (props: SortableGridSurfaceProps) => (
    <div
        class={styles.sortableGridSurface}
        classList={{
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
