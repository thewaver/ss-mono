<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.sortableRingMarker, layerClass]} data-marker=""></div>
