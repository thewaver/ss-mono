<script lang="ts">
    import type { TableSortDirection } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TableResizerProps } from "./TableContent.types";

    const UNSORTED_MARKER = "↕";

    const SORT_MARKERS: Record<TableSortDirection, string> = {
        ascending: "▲",
        descending: "▼",
    };

    const getSortMarker = (direction: TableSortDirection | undefined) =>
        direction === undefined ? UNSORTED_MARKER : SORT_MARKERS[direction];

    let props: TableResizerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.tableSortMarker, layerClass]}>
    {getSortMarker(props.renderProps.sortDirection)}
</div>
