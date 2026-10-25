<script lang="ts">
    import { Sortable } from "@thewaver/ss-components-svelte";
    import type { SortableItem } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        CHEAP_ONLY,
        HAND,
        LIST_GAP,
        LIST_MIN_HEIGHT,
        LIST_MIN_WIDTH,
        computeCardKey,
        computeCardLabel,
    } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.css";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";
    import { RESTING_FLAGS, renderSortableCard } from "../SortablePage.const.svelte";

    let hand = $state<SortableItem<Card>[]>(HAND);
    let board = $state<SortableItem<Card>[]>([]);
</script>

<div class={styles.sortablePair}>
    <div class={styles.sortableColumn}>
        <div class={styles.sortableCaption}>Hand</div>

        <Sortable
            groupId={"picky"}
            ariaLabel={"Hand"}
            announcements={SORTABLE_ANNOUNCEMENTS}
            gap={LIST_GAP}
            minHeight={LIST_MIN_HEIGHT}
            minWidth={LIST_MIN_WIDTH}
            bind:items={hand}
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
    </div>

    <div class={styles.sortableColumn}>
        <div class={styles.sortableCaption}>Board</div>

        <Sortable
            groupId={"picky"}
            ariaLabel={"Board"}
            announcements={SORTABLE_ANNOUNCEMENTS}
            gap={LIST_GAP}
            minHeight={LIST_MIN_HEIGHT}
            minWidth={LIST_MIN_WIDTH}
            bind:items={board}
            computeItemKey={computeCardKey}
            computeItemLabel={computeCardLabel}
            computeCanAccept={(card) => card.cost <= CHEAP_ONLY}
            renderItem={renderSortableCard}
        >
            {#snippet renderCarried(item)}
                {@render renderSortableCard(item, RESTING_FLAGS)}
            {/snippet}

            {#snippet renderMarker(orientation)}
                <PageSortableMarker {orientation} />
            {/snippet}

            {#snippet renderDecoration(flags)}
                <PageSortableSurface {flags} emptyText={"Play a card here"} />
            {/snippet}
        </Sortable>
    </div>
</div>
