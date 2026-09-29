<script lang="ts">
    import { Sortable } from "@thewaver/ss-components-svelte";
    import type {
        InteractionFlags,
        SortableGridItem,
        SortableItem,
        SortableItemFlags,
    } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
    import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

    import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.svelte";
    import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";
    import { GRID_GAP, computeGearKey, computeGearLabel } from "../SortableGridPage.const";
    import InventoryExample from "./Inventory.svelte";

    type Props = {
        groupId: string;
        loot: SortableItem<Gear>[];
        pack: SortableGridItem<Gear>[];
    };

    const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

    let { loot = $bindable(), pack = $bindable(), ...props }: Props = $props();
</script>

{#snippet renderLoot(item: SortableItem<Gear>, flags: InteractionFlags<SortableItemFlags>)}
    <PageSortableItemContent {flags} detail={item.value.glyph}>{item.value.name}</PageSortableItemContent>
{/snippet}

<div class={styles.sortableGridPair}>
    <div class={styles.sortableGridStack}>
        <div class={styles.sortableGridCaption}>Ground</div>

        <div class={styles.sortableGridLootStrip}>
            <Sortable
                groupId={props.groupId}
                ariaLabel={"Ground"}
                announcements={SORTABLE_ANNOUNCEMENTS}
                gap={GRID_GAP}
                minHeight={72}
                bind:items={loot}
                computeItemKey={computeGearKey}
                computeItemLabel={computeGearLabel}
                renderItem={renderLoot}
            >
                {#snippet renderCarried(item)}
                    {@render renderLoot(item, RESTING_FLAGS)}
                {/snippet}

                {#snippet renderMarker(orientation)}
                    <PageSortableMarker {orientation} />
                {/snippet}

                {#snippet renderDecoration(flags)}
                    <PageSortableSurface {flags} emptyText={"Nothing left"} />
                {/snippet}
            </Sortable>
        </div>
    </div>

    <div class={styles.sortableGridStack}>
        <div class={styles.sortableGridCaption}>Pack</div>

        <InventoryExample
            groupId={props.groupId}
            bind:items={pack}
            ariaLabel={"Pack"}
            emptyText={"Empty pack"}
            isTurnable={true}
        />
    </div>
</div>
