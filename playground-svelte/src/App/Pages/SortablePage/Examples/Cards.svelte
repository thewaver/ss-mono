<script lang="ts">
    import { Sortable } from "@thewaver/ss-components-svelte";
    import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        LIST_GAP,
        computeCardKey,
        computeCardLabel,
    } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.svelte";
    import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";

    type Props = {
        groupId: string;
        items: SortableItem<Card>[];
        ariaLabel: string;
        emptyText: string;
        orientation?: "horizontal" | "vertical";
        isDisabled?: boolean;
        isLocked?: boolean;
        computeCanAccept?: (value: Card, fromLabel: string) => boolean;
        onTransfer?: (toLabel: string) => void;
    };

    const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

    let { items = $bindable(), ...props }: Props = $props();
</script>

{#snippet renderCard(item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>)}
    <PageSortableItemContent {flags} detail={`${item.value.cost}`}>{item.value.name}</PageSortableItemContent>
{/snippet}

<Sortable
    groupId={props.groupId}
    ariaLabel={props.ariaLabel}
    announcements={SORTABLE_ANNOUNCEMENTS}
    orientation={props.orientation}
    gap={LIST_GAP}
    minHeight={72}
    isDisabled={props.isDisabled ?? false}
    isLocked={props.isLocked ?? false}
    bind:items
    computeItemKey={computeCardKey}
    computeItemLabel={computeCardLabel}
    computeCanAccept={props.computeCanAccept}
    renderItem={renderCard}
    onTransfer={(transfer) => props.onTransfer?.(transfer.toLabel)}
>
    {#snippet renderCarried(item)}
        {@render renderCard(item, RESTING_FLAGS)}
    {/snippet}

    {#snippet renderMarker(orientation)}
        <PageSortableMarker {orientation} />
    {/snippet}

    {#snippet renderDecoration(flags)}
        <PageSortableSurface {flags} emptyText={props.emptyText} />
    {/snippet}
</Sortable>
