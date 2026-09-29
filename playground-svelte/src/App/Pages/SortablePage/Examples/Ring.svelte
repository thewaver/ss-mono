<script lang="ts">
    import { PlacementLayoutUtils, Sortable } from "@thewaver/ss-components-svelte";
    import type { ArcDefs, InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        LIST_GAP,
        computeCardKey,
        computeCardLabel,
    } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.svelte";
    import PageSortableRingMarker from "../../../StyledComponents/SortableContent/PageSortableRingMarker.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";

    const RING_DEFS: ArcDefs = {
        curveHeightRatio: 1,
        spreadDegrees: 360,
        facingDegrees: 45,
        itemWidthRatio: 0.6512,
        itemHeightRatio: 0.2938,
    };

    const RING_LAYOUT = PlacementLayoutUtils.createArc(RING_DEFS);

    const RING_WIDTH = "324px";

    const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

    type Props = {
        items: SortableItem<Card>[];
    };

    let { items = $bindable() }: Props = $props();
</script>

{#snippet renderCard(item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>)}
    <PageSortableItemContent {flags} detail={`${item.value.cost}`} isCenterd={true}>
        {item.value.name}
    </PageSortableItemContent>
{/snippet}

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
