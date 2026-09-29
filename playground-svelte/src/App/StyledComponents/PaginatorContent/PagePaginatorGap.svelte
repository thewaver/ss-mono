<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorGapContentProps } from "./PaginatorContent.types";

    let props: PaginatorGapContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.paginatorGap, layerClass]} title={`Pages ${props.entry.from} to ${props.entry.to}`}>…</div>
