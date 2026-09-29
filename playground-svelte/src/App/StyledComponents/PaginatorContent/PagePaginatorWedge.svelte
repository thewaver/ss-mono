<script lang="ts">
    import { type PlacementRect, PlacementUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorWedgeProps } from "./PaginatorContent.types";

    const HALF = 0.5;

    const toViewBox = (rect: PlacementRect) =>
        `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

    let props: PaginatorWedgeProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const gradientId = $props.id();

    const sectorPath = $derived(PlacementUtils.getSectorPath(props.placement.sector!));
</script>

<div
    class={[
        styles.paginatorWedge,
        layerClass,
        props.isCurrent && styles.isCurrent,
        props.isHovered && styles.isHovered,
        props.isActive && styles.isActive,
        props.isDisabled && styles.isDisabled,
    ]}
>
    <svg class={styles.paginatorWedgeCanvas} viewBox={toViewBox(props.placement)} aria-hidden="true">
        <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                <stop class={styles.paginatorWedgeGradientFrom} offset="0%" />
                <stop class={styles.paginatorWedgeGradientTo} offset="100%" />
            </linearGradient>
        </defs>

        <path class={styles.paginatorWedgeShape} d={sectorPath} />

        <path class={styles.paginatorWedgeFill} style:fill={`url(#${gradientId})`} d={sectorPath} />
    </svg>

    <div class={styles.paginatorWedgeLabel} aria-hidden="true">
        {@render props.children?.()}
    </div>
</div>
