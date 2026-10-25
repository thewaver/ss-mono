<script module lang="ts">
    import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-svelte";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableItemContent from "../../StyledComponents/SortableContent/PageSortableItemContent.svelte";

    export const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

    export { renderSortableCard };
</script>

{#snippet renderSortableCard(item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>)}
    <PageSortableItemContent {flags} detail={`${item.value.cost}`}>{item.value.name}</PageSortableItemContent>
{/snippet}
