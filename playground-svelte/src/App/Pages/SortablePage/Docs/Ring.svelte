<script lang="ts">
    import { Sortable } from "@thewaver/ss-components-svelte";
    import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { computeCardKey, computeCardLabel, LIST_GAP, QUEUE, RING_LAYOUT, RING_WIDTH } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.svelte";
    import PageSortableRingMarker from "../../../StyledComponents/SortableContent/PageSortableRingMarker.svelte";
    import PageSortableRoom from "../../../StyledComponents/SortableContent/PageSortableRoom.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";
    import { RESTING_FLAGS } from "../SortablePage.const.svelte";

    let items = $state<SortableItem<Card>[]>(QUEUE);
</script>

{#snippet renderCard(item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>)}
    <PageSortableItemContent {flags} detail={`${item.value.cost}`} isCentered={true}>
        {item.value.name}
    </PageSortableItemContent>
{/snippet}

<PageSortableRoom>
    <div style:width={RING_WIDTH}>
        <Sortable
            groupId={"ring"}
            ariaLabel={"Ring"}
            announcements={SORTABLE_ANNOUNCEMENTS}
            gap={LIST_GAP}
            bind:items
            computeLayout={RING_LAYOUT}
            computeItemKey={computeCardKey}
            computeItemLabel={computeCardLabel}
            renderItem={renderCard}
        >
            {#snippet renderCarried(item)}
                {@render renderCard(item, RESTING_FLAGS)}
            {/snippet}

            {#snippet renderMarker()}
                <PageSortableRingMarker />
            {/snippet}

            {#snippet renderDecoration(flags)}
                <PageSortableSurface {flags} emptyText={"No cards"} />
            {/snippet}
        </Sortable>
    </div>
</PageSortableRoom>
