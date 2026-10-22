<script lang="ts">
    import { untrack } from "svelte";

    import type { InteractionFlags, PaginatorPageEntry, PaginatorPageRenderProps } from "@thewaver/ss-components";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import type { PaginatorEntryControlProps } from "./Paginator.types.js";
    import PaginatorItem from "./PaginatorItem.svelte";
    import { PaginatorSvelteUtils } from "./PaginatorSvelte.utils.svelte.js";

    let props: PaginatorEntryControlProps<PaginatorPageEntry> = $props();

    let element = $state<HTMLElement>();

    const placed = PaginatorSvelteUtils.createPlacedControl(untrack(() => props.context), () => element);

    const placement = $derived(placed.getPlacement());

    const isCurrent = $derived(props.entry.page === props.context.getPage());
</script>

{#snippet control()}
    <InteractionWrapper
        bind:ref={element}
        sizing={placed.getSizing()}
        isDisabled={props.context.getIsDisabled()}
        extraFlags={{ page: props.entry.page, isCurrent, placement }}
    >
        {#snippet renderControl(attachElement, renderProps)}
            {#snippet pageContent(itemFlags: InteractionFlags<PaginatorPageRenderProps>)}
                {@render props.renderPage(props.entry, itemFlags)}
            {/snippet}

            <PaginatorItem
                {attachElement}
                href={props.context.computeHref(props.entry.page)}
                isCurrent={renderProps.isCurrent}
                ariaLabel={props.computePageLabel(props.entry.page, props.context.getPageCount())}
                flags={renderProps}
                linkComponent={props.context.getLinkComponent()}
                renderContent={pageContent}
                onActivate={() => props.context.goTo(props.entry.page)}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#if placement}
    <PlacementItem {placement} stackAt={placed.getStackAt()}>
        {@render control()}
    </PlacementItem>
{:else}
    {@render control()}
{/if}
