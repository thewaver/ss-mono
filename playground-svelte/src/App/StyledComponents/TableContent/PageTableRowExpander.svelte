<script lang="ts">
    import { EXPANDER_MARKERS } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TableExpanderProps } from "./TableContentSvelte.types";

    let props: TableExpanderProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.tableRowExpander, layerClass]}>
    {props.renderProps.isExpanded ? EXPANDER_MARKERS.open : EXPANDER_MARKERS.closed}
</div>
