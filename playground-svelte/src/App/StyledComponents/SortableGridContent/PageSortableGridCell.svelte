<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SortableGridCellProps } from "./SortableGridContent.types";

    let props: SortableGridCellProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.sortableGridCell,
        layerClass,
        (props.spot.col + props.spot.row) % 2 === 1 && styles.isOdd,
        (props.isBlocked ?? false) && styles.isBlocked,
    ]}
></div>
