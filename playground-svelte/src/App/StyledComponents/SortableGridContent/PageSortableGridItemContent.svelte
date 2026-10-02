<script lang="ts" module>
    import type { SortableGridGeometry } from "@thewaver/ss-components-svelte";

    const getBox = (geometry: SortableGridGeometry) => ({
        width: Math.max(...geometry.contour.map((point) => point.x)),
        height: Math.max(...geometry.contour.map((point) => point.y)),
    });

    export const getPoints = (geometry: SortableGridGeometry) =>
        geometry.contour.map((point) => `${point.x},${point.y}`).join(" ");

    export const getViewBox = (geometry: SortableGridGeometry) => {
        const box = getBox(geometry);

        return `0 0 ${box.width} ${box.height}`;
    };
</script>

<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SortableGridItemContentProps } from "./SortableGridContent.types";

    const NAMED_WIDTH = 2;

    let props: SortableGridItemContentProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const geometry = $derived(props.geometry);

    const glyphRect = $derived(geometry.block);

    const isNamed = $derived(glyphRect.width >= geometry.cells[0].width * NAMED_WIDTH);
</script>

<div
    class={[
        styles.sortableGridItemContent,
        layerClass,
        props.flags.isCarried && styles.isCarried,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {#if (props.paint ?? "contour") === "contour"}
        <svg class={styles.sortableGridItemShape} viewBox={getViewBox(geometry)} aria-hidden="true">
            <polygon class={styles.sortableGridItemContour} points={getPoints(geometry)} />
        </svg>
    {:else}
        {#each geometry.cells as cell, index (index)}
            <div
                class={styles.sortableGridItemTile}
                style={toStyle(assignInlineVars({ [styles.tileHue]: `${props.hue ?? 0}` }), {
                    left: `${cell.left}px`,
                    top: `${cell.top}px`,
                    width: `${cell.width}px`,
                    height: `${cell.height}px`,
                })}
                aria-hidden="true"
            ></div>
        {/each}
    {/if}

    <div
        class={styles.sortableGridItemGlyph}
        style:left={`${glyphRect.left}px`}
        style:top={`${glyphRect.top}px`}
        style:width={`${glyphRect.width}px`}
        style:height={`${glyphRect.height}px`}
        aria-hidden="true"
    >
        <div>{props.glyph}</div>

        {#if isNamed}
            <div class={styles.sortableGridItemName}>{props.name}</div>
        {/if}
    </div>
</div>
