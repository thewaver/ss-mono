<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SortableMarkerProps } from "./SortableContent.types";

    let props: SortableMarkerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[props.orientation === "horizontal" ? styles.sortableMarkerRow : styles.sortableMarkerColumn, layerClass]}
></div>
