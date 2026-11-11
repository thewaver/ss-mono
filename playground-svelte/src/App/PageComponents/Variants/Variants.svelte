<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Variants/Variants.css";

    import PageLayer from "../Layer/Layer.svelte";
    import { getNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
    import type { VariantsProps } from "./Variants.types";

    let props: VariantsProps = $props();

    const getNextLayerClassName = getNextLayerClass();
</script>

<div
    class={styles.variantsRoot}
    style:grid-template-columns={`repeat(auto-fill, minmax(min(100%, ${props.minColumnWidth ?? styles.DEFAULT_MIN_COLUMN_WIDTH}px), 1fr))`}
>
    {#each props.items as variant (variant.key)}
        <div class={[styles.variantContainer, getNextLayerClassName()]} data-variant="" data-testid={variant.key}>
            <PageLayer>
                <div class={styles.variantTitle}>{variant.name}</div>

                <div class={styles.variantDemo}>{@render variant.component()}</div>

                {#if variant.readout}
                    <div class={styles.variantReadout} data-readout="">
                        {variant.readout()}
                    </div>
                {/if}
            </PageLayer>
        </div>
    {/each}
</div>
