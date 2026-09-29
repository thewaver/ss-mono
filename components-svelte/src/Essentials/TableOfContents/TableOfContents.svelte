<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import {
        type InteractionFlags,
        type InteractionSizing,
        TABLE_OF_CONTENTS_DEFAULTS,
        type TableOfContentsFlags,
        type TableOfContentsLink,
        TableOfContentsUtils,
        TableOfContentsStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { TableOfContentsProps } from "./TableOfContents.types.js";
    import TableOfContentsItem from "./TableOfContentsItem.svelte";

    const ROW_SIZING: InteractionSizing = "fit-content";
    const PLACED_SIZING: InteractionSizing = "fill";

    let props: TableOfContentsProps<T> = $props();

    const orientation = $derived(props.orientation ?? TABLE_OF_CONTENTS_DEFAULTS.orientation);
    const flexDirection = $derived(orientation === "horizontal" ? "row" : "column");
    const itemCount = $derived(props.links.length);

    const targets = $derived(props.links.map((link) => link.target));

    const getCurrentIndex = ElementObserverSvelteUtils.createViewportCurrentIndexObserver(
        () => targets,
        () => false,
        { getOffsetRatio: () => props.offsetRatio ?? TABLE_OF_CONTENTS_DEFAULTS.offsetRatio },
    );

    const currentValue = $derived(TableOfContentsUtils.computeCurrentValue(props.links, getCurrentIndex()));

    watchChange(
        () => currentValue,
        (value) => props.onCurrentChange?.(value),
    );

    $effect(() => {
        const list = targets;

        return untrack(() => TableOfContentsUtils.makeTargetsFocusable(list));
    });

    const layout = $derived(props.computeLayout?.({ itemCount }));
</script>

{#snippet control(link: TableOfContentsLink<T>, index: number)}
    {@const placement = layout?.placements[index]}
    <InteractionWrapper
        sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
        extraFlags={{ isCurrent: getCurrentIndex() === index }}
    >
        {#snippet renderControl(attachElement, flags)}
            {#snippet linkContent(itemFlags: InteractionFlags<TableOfContentsFlags>)}
                {@render props.renderLink(link, itemFlags, placement)}
            {/snippet}

            <TableOfContentsItem {attachElement} {link} {flags} renderContent={linkContent} />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet list()}
    <ol
        class={[styles.tableOfContentsList, layout !== undefined && styles.tableOfContentsPlacedList]}
        style:flex-direction={layout === undefined ? flexDirection : undefined}
        style:flex-wrap={layout === undefined && orientation === "horizontal" ? "wrap" : undefined}
        style:gap={layout === undefined ? `${props.gap ?? TABLE_OF_CONTENTS_DEFAULTS.gap}px` : undefined}
    >
        {#each props.links as link, index (index)}
            {#if layout === undefined}
                <li class={styles.tableOfContentsEntry}>
                    {@render control(link, index)}
                </li>
            {:else}
                {@const placement = layout.placements[index]}
                <li class={styles.tableOfContentsLayer}>
                    {#if placement}
                        <PlacementItem {placement}>{@render control(link, index)}</PlacementItem>
                    {/if}
                </li>
            {/if}
        {/each}
    </ol>
{/snippet}

<nav class={styles.tableOfContentsRoot} aria-label={props.ariaLabel} aria-labelledby={props.ariaLabelledBy}>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render list()}
        </PlacementBox>
    {:else}
        {@render list()}
    {/if}
</nav>
