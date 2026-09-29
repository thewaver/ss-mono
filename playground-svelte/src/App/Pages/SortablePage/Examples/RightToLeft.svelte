<script lang="ts">
    import type { SortableItem } from "@thewaver/ss-components-svelte";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import PageSortableRoom from "../../../StyledComponents/SortableContent/PageSortableRoom.svelte";
    import CardsExample from "./Cards.svelte";

    type Props = {
        items: SortableItem<Card>[];
    };

    let { items = $bindable() }: Props = $props();
</script>

<div dir={"rtl"}>
    <PageSortableRoom>
        <CardsExample
            groupId={"rightToLeft"}
            bind:items
            ariaLabel={"Row in a right-to-left box"}
            emptyText={"No cards"}
            orientation={"horizontal"}
        />
    </PageSortableRoom>
</div>
