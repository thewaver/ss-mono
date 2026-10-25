<script lang="ts">
    import { Sortable } from "@thewaver/ss-components-svelte";
    import type { SortableItem } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        HAND,
        LIST_GAP,
        LIST_MIN_HEIGHT,
        computeCardKey,
        computeCardLabel,
    } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.svelte";
    import PageSortableRoom from "../../../StyledComponents/SortableContent/PageSortableRoom.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";
    import { RESTING_FLAGS, renderSortableCard } from "../SortablePage.const.svelte";

    let items = $state<SortableItem<Card>[]>(HAND);
</script>

<div dir={"rtl"}>
    <PageSortableRoom>
        <Sortable
            groupId={"rightToLeft"}
            ariaLabel={"Row in a right-to-left box"}
            orientation={"horizontal"}
            announcements={SORTABLE_ANNOUNCEMENTS}
            gap={LIST_GAP}
            minHeight={LIST_MIN_HEIGHT}
            bind:items
            computeItemKey={computeCardKey}
            computeItemLabel={computeCardLabel}
            renderItem={renderSortableCard}
        >
            {#snippet renderCarried(item)}
                {@render renderSortableCard(item, RESTING_FLAGS)}
            {/snippet}

            {#snippet renderMarker(orientation)}
                <PageSortableMarker {orientation} />
            {/snippet}

            {#snippet renderDecoration(flags)}
                <PageSortableSurface {flags} emptyText={"No cards"} />
            {/snippet}
        </Sortable>
    </PageSortableRoom>
</div>
