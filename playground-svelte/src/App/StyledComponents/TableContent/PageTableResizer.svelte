<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TableResizerProps } from "./TableContent.types";

    let props: TableResizerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.tableResizerHandle, layerClass, props.renderProps.isResizing && styles.isResizing]}
    aria-hidden="true"
></div>
