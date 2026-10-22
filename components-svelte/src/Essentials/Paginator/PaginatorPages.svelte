<script lang="ts">
    import { PAGINATOR_DEFAULTS, PaginatorUtils, PaginatorStyles as styles } from "@thewaver/ss-components";

    import { getPaginatorContext } from "./Paginator.context.js";
    import type { PaginatorPagesProps } from "./Paginator.types.js";
    import PaginatorGapControl from "./PaginatorGapControl.svelte";
    import PaginatorPageControl from "./PaginatorPageControl.svelte";

    let props: PaginatorPagesProps = $props();

    const context = getPaginatorContext("PaginatorPages");

    const entries = $derived(
        context === undefined
            ? []
            : PaginatorUtils.getEntries(context.getPage(), {
                  pageCount: context.getPageCount(),
                  siblingCount: props.siblingCount ?? PAGINATOR_DEFAULTS.siblingCount,
                  boundaryCount: props.boundaryCount ?? PAGINATOR_DEFAULTS.boundaryCount,
              }),
    );
</script>

{#if context}
    <div class={styles.paginatorRow} style:gap={`${props.gap ?? PAGINATOR_DEFAULTS.gap}px`}>
        {#each entries as entry, index (index)}
            {#if entry.kind === "page"}
                <PaginatorPageControl
                    {context}
                    {entry}
                    computePageLabel={props.computePageLabel}
                    renderPage={props.renderPage}
                    renderGap={props.renderGap}
                />
            {:else}
                <PaginatorGapControl
                    {context}
                    {entry}
                    computePageLabel={props.computePageLabel}
                    renderPage={props.renderPage}
                    renderGap={props.renderGap}
                />
            {/if}
        {/each}
    </div>
{/if}
