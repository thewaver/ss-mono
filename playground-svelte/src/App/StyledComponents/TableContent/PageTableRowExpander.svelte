<script lang="ts">
    import { NavigatorSvelteUtils } from "@thewaver/ss-components-svelte";
    import { EXPANDER_MARKERS } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TableExpanderProps } from "./TableContentSvelte.types";

    let props: TableExpanderProps = $props();

    const layerClass = $derived.by(getLayerClass());

    let element = $state<HTMLDivElement>();

    const getDirection = NavigatorSvelteUtils.createDirection(() => element);

    const marker = $derived.by(() => {
        if (props.renderProps.isExpanded) return EXPANDER_MARKERS.open;

        return getDirection() === "rtl" ? EXPANDER_MARKERS.closedRightToLeft : EXPANDER_MARKERS.closed;
    });
</script>

<div bind:this={element} class={[styles.tableRowExpander, layerClass]}>
    {marker}
</div>
