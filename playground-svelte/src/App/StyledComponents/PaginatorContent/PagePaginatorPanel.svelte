<script lang="ts">
    import { PaginatorUtils } from "@thewaver/ss-components-svelte";
    import { RESULTS } from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorPanelProps } from "./PaginatorContentSvelte.types";

    const toResult = (itemNumber: number) => RESULTS[(itemNumber - 1) % RESULTS.length];

    let props: PaginatorPanelProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const range = $derived(PaginatorUtils.computeItemRange(props.page, props.itemCount, props.pageSize));

    const summary = $derived(
        range === undefined ? "nothing to show" : `showing ${range.first} to ${range.last} of ${props.itemCount}`,
    );

    const itemNumbers = $derived(
        range === undefined
            ? []
            : Array.from({ length: range.last - range.first + 1 }, (_unused, offset) => range.first + offset),
    );
</script>

<div class={[styles.paginatorPanel, layerClass]}>
    <div class={styles.paginatorPanelSummary} role="status">
        {summary}
    </div>

    {#each itemNumbers as itemNumber (itemNumber)}
        <div class={styles.paginatorPanelRow}>
            <span>{toResult(itemNumber)}</span><span class={styles.paginatorPanelIndex}>{`#${itemNumber}`}</span>
        </div>
    {/each}
</div>
