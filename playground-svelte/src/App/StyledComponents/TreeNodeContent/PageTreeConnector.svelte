<script lang="ts">
    import { PlacementUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TreeConnectorProps } from "./TreeNodeContentSvelte.types";

    let props: TreeConnectorProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const defs = $derived(props.defs);

    const line = $derived(
        defs.from === undefined || defs.to === undefined ? undefined : PlacementUtils.getLinkPath(defs.from, defs.to),
    );
</script>

{#if line}
    <svg class={[styles.treeConnector, layerClass]} viewBox={"0 0 1 1"} aria-hidden={"true"}>
        <path class={styles.treeConnectorPath} d={line} />
    </svg>
{/if}
