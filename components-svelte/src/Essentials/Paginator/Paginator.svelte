<script lang="ts">
    import type { Snippet } from "svelte";

    import {
        type InteractionFlags,
        type InteractionSizing,
        PAGINATOR_DEFAULTS,
        type PaginatorGapEntry,
        type PaginatorPageEntry,
        type PaginatorPageRenderProps,
        type PaginatorStep,
        type PaginatorStepRenderProps,
        PaginatorUtils,
        PaginatorStyles as styles,
    } from "@thewaver/ss-components";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import type { PaginatorProps } from "./Paginator.types.js";
    import PaginatorItem from "./PaginatorItem.svelte";

    const ROW_SIZING: InteractionSizing = "fit-content";
    const PLACED_SIZING: InteractionSizing = "fill";

    let props: PaginatorProps = $props();

    const pageCount = $derived(PaginatorUtils.computePageCount(props.pageCount));
    const isDisabled = $derived(props.isDisabled ?? false);
    const page = $derived(props.page);

    const entries = $derived(
        PaginatorUtils.getEntries(page, {
            pageCount,
            siblingCount: props.siblingCount ?? PAGINATOR_DEFAULTS.siblingCount,
            boundaryCount: props.boundaryCount ?? PAGINATOR_DEFAULTS.boundaryCount,
        }),
    );

    const steps = $derived(PaginatorUtils.splitSteps(props.steps ?? PAGINATOR_DEFAULTS.steps));

    const itemCount = $derived(steps.leading.length + entries.length + steps.trailing.length);
    const layout = $derived(props.computeLayout?.({ itemCount }));

    const goTo = (target: number) => {
        if (target === page) return;

        props.onPageChange?.(target);
    };
</script>

{#snippet placed(index: number, body: Snippet)}
    {@const placement = layout?.placements[index]}
    {#if placement}
        <PlacementItem {placement} stackAt={index + 1}>
            {@render body()}
        </PlacementItem>
    {:else}
        {@render body()}
    {/if}
{/snippet}

{#snippet stepControl(step: PaginatorStep, index: number)}
    {@const placement = layout?.placements[index]}
    {@const stepState = PaginatorUtils.computeStepState(step, page, pageCount, isDisabled)}
    {#snippet body()}
        <InteractionWrapper
            sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
            isDisabled={stepState.isDisabled}
            extraFlags={{ step, targetPage: stepState.targetPage, placement }}
        >
            {#snippet renderControl(attachElement, renderProps)}
                {#snippet stepContent(itemFlags: InteractionFlags<PaginatorStepRenderProps>)}
                    {@render props.renderStep(step, itemFlags)}
                {/snippet}

                <PaginatorItem
                    {attachElement}
                    href={stepState.isDisabled ? undefined : props.computeHref?.(stepState.targetPage)}
                    isCurrent={false}
                    ariaLabel={props.computeStepLabel(step, stepState.targetPage)}
                    flags={renderProps}
                    linkComponent={props.linkComponent}
                    renderContent={stepContent}
                    onActivate={() => goTo(stepState.targetPage)}
                />
            {/snippet}
        </InteractionWrapper>
    {/snippet}

    {@render placed(index, body)}
{/snippet}

{#snippet pageControl(entry: PaginatorPageEntry, index: number)}
    {@const placement = layout?.placements[index]}
    {@const isCurrent = entry.page === page}
    {#snippet body()}
        <InteractionWrapper
            sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
            {isDisabled}
            extraFlags={{ page: entry.page, isCurrent, placement }}
        >
            {#snippet renderControl(attachElement, renderProps)}
                {#snippet pageContent(itemFlags: InteractionFlags<PaginatorPageRenderProps>)}
                    {@render props.renderPage(entry, itemFlags)}
                {/snippet}

                <PaginatorItem
                    {attachElement}
                    href={props.computeHref?.(entry.page)}
                    {isCurrent}
                    ariaLabel={props.computePageLabel(entry.page, pageCount)}
                    flags={renderProps}
                    linkComponent={props.linkComponent}
                    renderContent={pageContent}
                    onActivate={() => goTo(entry.page)}
                />
            {/snippet}
        </InteractionWrapper>
    {/snippet}

    {@render placed(index, body)}
{/snippet}

{#snippet gapControl(entry: PaginatorGapEntry, index: number)}
    {#snippet body()}
        <span class={styles.paginatorGap} aria-hidden="true">
            {@render props.renderGap(entry, layout?.placements[index])}
        </span>
    {/snippet}

    {@render placed(index, body)}
{/snippet}

{#snippet row()}
    {#each steps.leading as step, index (index)}
        {@render stepControl(step, index)}
    {/each}

    {#each entries as entry, index (index)}
        {#if entry.kind === "page"}
            {@render pageControl(entry, steps.leading.length + index)}
        {:else}
            {@render gapControl(entry, steps.leading.length + index)}
        {/if}
    {/each}

    {#each steps.trailing as step, index (index)}
        {@render stepControl(step, steps.leading.length + entries.length + index)}
    {/each}
{/snippet}

<nav class={styles.paginatorRoot} style:gap={`${props.gap ?? PAGINATOR_DEFAULTS.gap}px`} aria-label={props.ariaLabel}>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render row()}
        </PlacementBox>
    {:else}
        {@render row()}
    {/if}
</nav>
