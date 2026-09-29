<script lang="ts">
    import { PlacementUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { StepArcConnectorProps } from "./StepContent.types";

    let props: StepArcConnectorProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const defs = $derived(props.defs);

    const run = $derived(
        defs.from === undefined || defs.to === undefined
            ? undefined
            : PlacementUtils.getLinkPath(defs.from, defs.to, defs.origin, defs.radii),
    );
</script>

{#if run}
    <svg class={[styles.arcConnector, layerClass]} viewBox={"0 0 1 1"} aria-hidden={"true"}>
        <path class={styles.arcConnectorPath} d={run} />
    </svg>
{/if}
