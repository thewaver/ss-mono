<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import { getPoints, getViewBox } from "./PageSortableGridItemContent.svelte";
    import type { SortableGridLandingProps } from "./SortableGridContent.types";

    let props: SortableGridLandingProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<svg
    class={[styles.sortableGridLanding, layerClass, props.isAllowed && styles.isAllowed]}
    viewBox={getViewBox(props.geometry)}
    aria-hidden="true"
>
    <polygon class={styles.sortableGridLandingOutline} points={getPoints(props.geometry)} />
</svg>
