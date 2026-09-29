<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorPanelProps } from "./PaginatorContent.types";

    const PAGE_SIZE = 3;
    const FIRST_PAGE = 1;

    const RESULTS = [
        "Aurora",
        "Basalt",
        "Cinder",
        "Drift",
        "Ember",
        "Fathom",
        "Glimmer",
        "Hollow",
        "Iris",
        "Jetty",
        "Kelp",
        "Loam",
    ];

    const toResult = (index: number) => RESULTS[index % RESULTS.length];

    let props: PaginatorPanelProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const firstIndex = $derived((Math.max(props.page, FIRST_PAGE) - FIRST_PAGE) * PAGE_SIZE);

    const total = $derived(Math.max(props.pageCount, 0) * PAGE_SIZE);

    const indexes = $derived(
        Array.from({ length: PAGE_SIZE }, (_unused, offset) => firstIndex + offset).filter((index) => index < total),
    );
</script>

<div class={[styles.paginatorPanel, layerClass]}>
    <div class={styles.paginatorPanelSummary} role="status">
        {indexes.length === 0
            ? "nothing to show"
            : `showing ${firstIndex + FIRST_PAGE} to ${firstIndex + indexes.length} of ${total}`}
    </div>

    {#each indexes as index (index)}
        <div class={styles.paginatorPanelRow}>
            <span>{toResult(index)}</span><span class={styles.paginatorPanelIndex}>{`#${index + FIRST_PAGE}`}</span>
        </div>
    {/each}
</div>
